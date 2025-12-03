const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { nanoid } = require('nanoid');

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*';

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN === '*' ? '*' : CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN === '*' ? '*' : CLIENT_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST']
  }
});

const teacher = { socketId: null };
const students = new Map();
let currentQuestion = null;
const pollHistory = [];
const chatHistory = [];
const MAX_HISTORY = 25;
const MAX_CHAT = 100;

const activeStudentIds = () =>
  Array.from(students.values())
    .filter((student) => !student.kicked)
    .map((student) => student.id);

const summarizeStudents = () =>
  Array.from(students.values()).map(({ id, name, joinedAt, kicked, socketId }) => ({
    id,
    name,
    joinedAt,
    kicked,
    socketId
  }));

const publicQuestion = (question) => {
  if (!question) return null;
  const { id, text, options, duration, expiresAt, createdAt } = question;
  return {
    id,
    text,
    duration,
    createdAt,
    expiresAt,
    options: options.map(({ id: optionId, label }) => ({ id: optionId, label }))
  };
};

const computeResults = (question) => {
  if (!question) return null;
  const totalResponses = Object.keys(question.answers).length;
  const counts = question.options.map(() => 0);
  Object.values(question.answers).forEach((index) => {
    if (typeof index === 'number' && counts[index] !== undefined) {
      counts[index] += 1;
    }
  });
  const percentages = counts.map((count) => (totalResponses ? Math.round((count / totalResponses) * 100) : 0));
  return {
    id: question.id,
    text: question.text,
    createdAt: question.createdAt,
    closedAt: question.closedAt,
    duration: question.duration,
    totalResponses,
    options: question.options.map((option, idx) => ({
      id: option.id,
      label: option.label,
      isCorrect: option.isCorrect,
      votes: counts[idx],
      percentage: percentages[idx]
    }))
  };
};

const emitToTeacher = (event, payload) => {
  if (teacher.socketId) {
    io.to(teacher.socketId).emit(event, payload);
  }
};

const broadcastTeacherState = () => {
  if (!teacher.socketId) return;
  emitToTeacher('teacher:state', {
    students: summarizeStudents(),
    currentQuestion: publicQuestion(currentQuestion),
    pollHistory,
    chatHistory
  });
};

const closeCurrentQuestion = (reason = 'completed') => {
  if (!currentQuestion || currentQuestion.closedAt) return;
  clearTimeout(currentQuestion.timer);
  currentQuestion.closedAt = Date.now();
  currentQuestion.closedReason = reason;

  const results = computeResults(currentQuestion);
  pollHistory.unshift(results);
  if (pollHistory.length > MAX_HISTORY) {
    pollHistory.pop();
  }

  io.to('students').emit('poll:results', results);
  io.to('teachers').emit('poll:results', results);
  currentQuestion = null;
  broadcastTeacherState();
};

const canAskNewQuestion = () => !currentQuestion;

io.on('connection', (socket) => {
  socket.on('teacher:join', () => {
    teacher.socketId = socket.id;
    socket.join('teachers');
    socket.emit('teacher:welcome', {
      pollHistory,
      students: summarizeStudents(),
      currentQuestion: publicQuestion(currentQuestion)
    });
  });

  socket.on('teacher:ask-question', (payload = {}, cb) => {
    if (!canAskNewQuestion()) {
      cb?.({ ok: false, message: 'Wait for the current question to finish before asking a new one.' });
      return;
    }

    const text = String(payload.text || '').trim();
    const duration = Math.min(Math.max(Number(payload.duration) || 60, 10), 120);
    let options = Array.isArray(payload.options) ? payload.options : [];

    options = options
      .filter((option) => option && option.label)
      .map((option, idx) => ({
        id: option.id || `opt-${idx + 1}-${nanoid(4)}`,
        label: option.label.trim(),
        isCorrect: Boolean(option.isCorrect)
      }));

    if (!text || options.length < 2) {
      cb?.({ ok: false, message: 'Add a question and at least two options.' });
      return;
    }

    currentQuestion = {
      id: nanoid(),
      text,
      options,
      duration,
      createdAt: Date.now(),
      expiresAt: Date.now() + duration * 1000,
      answers: {},
      timer: setTimeout(() => closeCurrentQuestion('timeout'), duration * 1000)
    };

    io.to('students').emit('poll:question', publicQuestion(currentQuestion));
    broadcastTeacherState();
    cb?.({ ok: true });
  });

  socket.on('teacher:kick-student', ({ studentId }) => {
    const student = students.get(studentId);
    if (!student) return;
    student.kicked = true;
    if (student.socketId) {
      io.to(student.socketId).emit('student:kicked');
    }
    broadcastTeacherState();
  });

  socket.on('teacher:request-history', () => {
    socket.emit('poll:history', pollHistory);
  });

  socket.on('student:join', ({ name, studentId } = {}, cb) => {
    const trimmedName = String(name || 'Student').trim().slice(0, 40) || 'Student';
    const id = studentId || nanoid();
    let student = students.get(id);

    if (student?.kicked) {
      cb?.({ ok: false, message: 'You have been removed from the poll.' });
      return;
    }

    if (!student) {
      student = {
        id,
        name: trimmedName,
        joinedAt: Date.now(),
        kicked: false
      };
      students.set(id, student);
    } else {
      student.name = trimmedName;
    }

    student.socketId = socket.id;
    socket.join('students');

    cb?.({
      ok: true,
      student: { id: student.id, name: student.name },
      currentQuestion: publicQuestion(currentQuestion),
      pollHistory,
      chatHistory
    });

    broadcastTeacherState();
  });

  socket.on('student:answer', ({ studentId, optionId } = {}, cb) => {
    const student = students.get(studentId);
    if (!student || student.kicked) {
      cb?.({ ok: false, message: 'You cannot answer right now.' });
      return;
    }
    if (!currentQuestion) {
      cb?.({ ok: false, message: 'No active question currently.' });
      return;
    }
    if (currentQuestion.answers[studentId] !== undefined) {
      cb?.({ ok: false, message: 'Answer already submitted.' });
      return;
    }

    const optionIndex = currentQuestion.options.findIndex((option) => option.id === optionId);
    if (optionIndex === -1) {
      cb?.({ ok: false, message: 'Option not found.' });
      return;
    }

    currentQuestion.answers[studentId] = optionIndex;
    cb?.({ ok: true });

    io.to(student.socketId).emit('poll:answer-confirmed', {
      questionId: currentQuestion.id,
      optionId
    });

    const totalActive = activeStudentIds();
    const answeredCount = Object.keys(currentQuestion.answers).length;

    emitToTeacher('poll:answer', {
      studentId,
      optionId,
      answeredCount,
      totalStudents: totalActive.length
    });

    const everyoneAnswered = totalActive.length > 0
      ? totalActive.every((id) => currentQuestion.answers[id] !== undefined)
      : true;

    if (everyoneAnswered) {
      closeCurrentQuestion('all-answered');
    }
  });

  socket.on('chat:message', ({ authorId, authorRole, content, authorName } = {}) => {
    const trimmedContent = String(content || '').trim();
    if (!trimmedContent) return;

    // Use provided authorName or look it up
    if (!authorName) {
      if (authorRole === 'teacher') {
        authorName = 'Teacher';
      } else if (authorRole === 'student' && authorId) {
        const student = students.get(authorId);
        authorName = student?.name || 'Student';
      } else {
        authorName = 'Student';
      }
    }

    const message = {
      id: nanoid(),
      authorId: authorId || socket.id,
      authorRole: authorRole || 'student',
      authorName: authorName,
      content: trimmedContent.slice(0, 280),
      createdAt: Date.now()
    };

    chatHistory.push(message);
    if (chatHistory.length > MAX_CHAT) {
      chatHistory.shift();
    }

    io.emit('chat:message', message);
  });

  socket.on('disconnect', () => {
    if (socket.id === teacher.socketId) {
      teacher.socketId = null;
      return;
    }

    const studentEntry = Array.from(students.values()).find((student) => student.socketId === socket.id);
    if (studentEntry) {
      studentEntry.socketId = null;
    }
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.get('/polls/history', (_req, res) => {
  res.json({ history: pollHistory });
});

app.get('/polls/current', (_req, res) => {
  res.json({ current: publicQuestion(currentQuestion) });
});

server.listen(PORT, () => {
  console.log(`Live polling server listening on port ${PORT}`);
});
