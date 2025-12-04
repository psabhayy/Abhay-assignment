import { useState } from 'react';
import './StudentNameEntry.css';

const StudentNameEntry = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="name-entry">
      <div className="name-entry-container">
        <div className="logo-badge">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L3 7V13L10 18L17 13V7L10 2Z" fill="white" stroke="white" strokeWidth="2"/>
          </svg>
          <span>Intervue Poll</span>
        </div>
        
        <h1 className="title">Let's <strong>Get Started</strong></h1>
        <p className="subtitle">
          If you're a student, you'll be able to <strong>submit your answers</strong>, participate in live polls, and see how your responses compare with your classmates
        </p>
        
        <div className="name-input-group">
          <label htmlFor="student-name">Enter your Name</label>
          <input
            id="student-name"
            type="text"
            placeholder="Rahul Bajaj"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            maxLength={40}
            autoFocus
          />
        </div>
        
        <button 
          className="continue-btn" 
          onClick={handleSubmit}
          disabled={!name.trim()}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StudentNameEntry;
