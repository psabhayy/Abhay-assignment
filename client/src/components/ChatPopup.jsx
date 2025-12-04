import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './ChatPopup.css';

const ChatPopup = ({ isOpen, onToggle, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef(null);

  const messages = useSelector((state) => state.chat.messages);
  const userRole = useSelector((state) => state.user.role);
  const userName = useSelector((state) => state.user.studentName);
  const userId = useSelector((state) => state.user.studentId);
  const students = useSelector((state) => state.poll.students);

  // Calculate active participants count
  const activeParticipants = students.filter(s => !s.kicked && !!s.socketId);
  const participantCount = activeParticipants.length + (userRole === 'teacher' ? 1 : 0); // +1 for teacher

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(userId || 'teacher', userRole || 'student', message.trim(), userName);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {isOpen && <div className="chat-overlay" onClick={onToggle}></div>}
      
      <div className={`chat-popup ${isOpen ? 'chat-open' : ''}`}>
        <div className="chat-tabs">
          <button
            className={`chat-tab ${activeTab === 'chat' ? 'chat-tab-active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: '6px' }}>
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
            </svg>
            Chat
            {messages.length > 0 && (
              <span className="chat-badge">{messages.length}</span>
            )}
          </button>
          <button
            className={`chat-tab ${activeTab === 'participants' ? 'chat-tab-active' : ''}`}
            onClick={() => setActiveTab('participants')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: '6px' }}>
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
            </svg>
            Participants
            <span className="chat-badge participant-badge">{participantCount}</span>
          </button>
        </div>

        {activeTab === 'chat' ? (
          <>
            <div className="chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-message ${msg.authorRole === userRole ? 'chat-message-own' : ''}`}
                >
                  <div className="chat-message-header">
                    <span className="chat-user-label">
                      {msg.authorName || (msg.authorRole === 'teacher' ? 'Teacher' : 'Student')}
                    </span>
                  </div>
                  <div className="chat-message-content">{msg.content}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={2}
              />
              <button onClick={handleSend} disabled={!message.trim()}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="participants-panel">
            <div className="participants-count-header">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
              </svg>
              <span>{participantCount} Participant{participantCount !== 1 ? 's' : ''} Online</span>
            </div>
            <div className="participants-list-container">
              {userRole === 'teacher' && (
                <div className="participant-item participant-teacher">
                  <div className="participant-avatar teacher-avatar">T</div>
                  <span className="participant-name">You (Teacher)</span>
                  <span className="participant-role-badge">Host</span>
                </div>
              )}
              {activeParticipants.map((student) => (
                <div key={student.id} className="participant-item">
                  <div className="participant-avatar">
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="participant-name">
                    {student.name}
                    {userRole === 'student' && student.id === userId && ' (You)'}
                  </span>
                  <span className="participant-status-dot"></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button className="chat-fab" onClick={onToggle}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </>
  );
};

export default ChatPopup;
