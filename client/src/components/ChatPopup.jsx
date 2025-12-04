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
            Chat
          </button>
          <button
            className={`chat-tab ${activeTab === 'participants' ? 'chat-tab-active' : ''}`}
            onClick={() => setActiveTab('participants')}
          >
            Participants
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
            <div className="participants-header">
              <span>Name</span>
            </div>
            {students.filter(s => !s.kicked && !!s.socketId).map((student) => (
              <div key={student.id} className="participant-item">
                {student.name}
              </div>
            ))}
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
