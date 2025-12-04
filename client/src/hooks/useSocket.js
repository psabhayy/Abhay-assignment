import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import socketService from '../services/socket';
import {
  setCurrentQuestion,
  setResults,
  setPollHistory,
  setStudents
} from '../store/pollSlice';
import { addMessage, setMessages } from '../store/chatSlice';
import { setKicked } from '../store/userSlice';

export const useSocket = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.user.role);

  useEffect(() => {
    const socket = socketService.connect();

    socket.on('poll:question', (question) => {
      dispatch(setCurrentQuestion(question));
    });

    socket.on('poll:results', (results) => {
      dispatch(setResults(results));
    });

    socket.on('poll:history', (history) => {
      dispatch(setPollHistory(history));
    });

    socket.on('chat:message', (message) => {
      dispatch(addMessage(message));
    });

    socket.on('student:kicked', () => {
      dispatch(setKicked());
    });

    socket.on('students:update', (studentList) => {
      dispatch(setStudents(studentList));
    });

    if (role === 'teacher') {
      socket.on('teacher:state', (state) => {
        if (state.students) {
          dispatch(setStudents(state.students));
        }
        if (state.currentQuestion) {
          dispatch(setCurrentQuestion(state.currentQuestion));
        }
        if (state.pollHistory) {
          dispatch(setPollHistory(state.pollHistory));
        }
        if (state.chatHistory) {
          dispatch(setMessages(state.chatHistory));
        }
      });

      socket.on('teacher:welcome', (data) => {
        if (data.students) {
          dispatch(setStudents(data.students));
        }
        if (data.currentQuestion) {
          dispatch(setCurrentQuestion(data.currentQuestion));
        }
        if (data.pollHistory) {
          dispatch(setPollHistory(data.pollHistory));
        }
      });
    }

    return () => {
      socket.off('poll:question');
      socket.off('poll:results');
      socket.off('poll:history');
      socket.off('chat:message');
      socket.off('student:kicked');
      socket.off('students:update');
      socket.off('teacher:state');
      socket.off('teacher:welcome');
    };
  }, [dispatch, role]);

  const joinAsTeacher = useCallback(() => {
    socketService.emit('teacher:join');
  }, []);

  const joinAsStudent = useCallback((name, studentId, callback) => {
    socketService.emit('student:join', { name, studentId }, callback);
  }, []);

  const askQuestion = useCallback((questionData, callback) => {
    socketService.emit('teacher:ask-question', questionData, callback);
  }, []);

  const submitAnswer = useCallback((studentId, optionId, callback) => {
    socketService.emit('student:answer', { studentId, optionId }, callback);
  }, []);

  const kickStudent = useCallback((studentId) => {
    socketService.emit('teacher:kick-student', { studentId });
  }, []);

  const sendChatMessage = useCallback((authorId, authorRole, content, authorName) => {
    socketService.emit('chat:message', { authorId, authorRole, content, authorName });
  }, []);

  return {
    joinAsTeacher,
    joinAsStudent,
    askQuestion,
    submitAnswer,
    kickStudent,
    sendChatMessage
  };
};
