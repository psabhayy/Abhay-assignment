import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRole, setStudent } from './store/userSlice';
import { setHasAnswered, setSelectedAnswer, setResults } from './store/pollSlice';
import { toggleChat } from './store/chatSlice';
import { useSocket } from './hooks/useSocket';
import RoleSelection from './components/RoleSelection';
import StudentNameEntry from './components/StudentNameEntry';
import WaitingScreen from './components/WaitingScreen';
import PollQuestion from './components/PollQuestion';
import PollResults from './components/PollResults';
import TeacherDashboard from './components/TeacherDashboard';
import ChatPopup from './components/ChatPopup';
import KickedScreen from './components/KickedScreen';
import PollHistory from './components/PollHistory';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [viewingHistory, setViewingHistory] = useState(false);
  
  const role = useSelector((state) => state.user.role);
  const studentId = useSelector((state) => state.user.studentId);
  const studentName = useSelector((state) => state.user.studentName);
  const isKicked = useSelector((state) => state.user.isKicked);
  const currentQuestion = useSelector((state) => state.poll.currentQuestion);
  const results = useSelector((state) => state.poll.results);
  const pollHistory = useSelector((state) => state.poll.pollHistory);
  const isChatOpen = useSelector((state) => state.chat.isOpen);
  const selectedAnswer = useSelector((state) => state.poll.selectedAnswer);

  const {
    joinAsTeacher,
    joinAsStudent,
    askQuestion,
    submitAnswer,
    kickStudent,
    sendChatMessage
  } = useSocket();

  useEffect(() => {
    const savedRole = localStorage.getItem('pollRole');
    const savedStudentId = localStorage.getItem('pollStudentId');
    const savedStudentName = localStorage.getItem('pollStudentName');

    if (savedRole) {
      dispatch(setRole(savedRole));
      if (savedRole === 'teacher') {
        joinAsTeacher();
      } else if (savedStudentId && savedStudentName) {
        dispatch(setStudent({ id: savedStudentId, name: savedStudentName }));
        joinAsStudent(savedStudentName, savedStudentId, (response) => {
          if (!response.ok) {
            localStorage.removeItem('pollRole');
            localStorage.removeItem('pollStudentId');
            localStorage.removeItem('pollStudentName');
            dispatch(setRole(null));
            dispatch(setStudent({ id: null, name: null }));
          }
        });
      }
    }
  }, [dispatch, joinAsTeacher, joinAsStudent]);

  const handleSelectRole = (selectedRole) => {
    dispatch(setRole(selectedRole));
    localStorage.setItem('pollRole', selectedRole);
    if (selectedRole === 'teacher') {
      joinAsTeacher();
    }
  };

  const handleStudentNameSubmit = (name) => {
    setLoading(true);
    joinAsStudent(name, null, (response) => {
      setLoading(false);
      if (response.ok) {
        dispatch(setStudent({ id: response.student.id, name: response.student.name }));
        localStorage.setItem('pollStudentId', response.student.id);
        localStorage.setItem('pollStudentName', response.student.name);
      }
    });
  };

  const handleAskQuestion = (questionData) => {
    askQuestion(questionData, (response) => {
      if (!response.ok) {
        alert(response.message || 'Failed to ask question');
      }
    });
  };

  const handleSubmitAnswer = (optionId) => {
    if (studentId) {
      submitAnswer(studentId, optionId, (response) => {
        if (response.ok) {
          dispatch(setSelectedAnswer(optionId));
          dispatch(setHasAnswered(true));
        } else {
          alert(response.message || 'Failed to submit answer');
        }
      });
    }
  };

  const handleKickStudent = (kickStudentId) => {
    kickStudent(kickStudentId);
  };

  const handleSendMessage = (authorId, authorRole, content) => {
    sendChatMessage(authorId, authorRole, content, studentName);
  };

  const handleToggleChat = () => {
    dispatch(toggleChat());
  };

  const handleAskNextQuestion = () => {
    dispatch(setResults(null));
    dispatch(setHasAnswered(false));
    dispatch(setSelectedAnswer(null));
  };

  const handleViewHistory = () => {
    setViewingHistory(true);
  };

  const handleCloseHistory = () => {
    setViewingHistory(false);
  };

  // Show kicked screen
  if (isKicked) {
    return <KickedScreen />;
  }

  // Teacher flow
  if (role === 'teacher') {
    if (viewingHistory) {
      return <PollHistory history={pollHistory} onClose={handleCloseHistory} />;
    }

    return (
      <>
        {currentQuestion ? (
          <PollQuestion question={currentQuestion} canAnswer={false} />
        ) : results ? (
          <PollResults 
            results={results} 
            showHistory={false} 
            onAskNext={handleAskNextQuestion}
            isTeacher={true}
          />
        ) : (
          <TeacherDashboard
            onAskQuestion={handleAskQuestion}
            onKickStudent={handleKickStudent}
            onViewHistory={handleViewHistory}
          />
        )}
        <ChatPopup
          isOpen={isChatOpen}
          onToggle={handleToggleChat}
          onSendMessage={handleSendMessage}
        />
      </>
    );
  }

  // Student flow
  if (role === 'student') {
    if (!studentId || !studentName) {
      return loading ? (
        <WaitingScreen />
      ) : (
        <StudentNameEntry onSubmit={handleStudentNameSubmit} />
      );
    }

    return (
      <>
        {results ? (
          <PollResults 
            results={results} 
            showHistory={false} 
            studentAnswer={selectedAnswer}
          />
        ) : currentQuestion ? (
          <PollQuestion
            question={currentQuestion}
            onSubmit={handleSubmitAnswer}
            canAnswer={true}
          />
        ) : (
          <WaitingScreen />
        )}
        <ChatPopup
          isOpen={isChatOpen}
          onToggle={handleToggleChat}
          onSendMessage={handleSendMessage}
        />
      </>
    );
  }

  // Role selection
  return <RoleSelection onSelectRole={handleSelectRole} />;
}

export default App;

