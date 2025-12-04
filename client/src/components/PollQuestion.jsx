import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './PollQuestion.css';

const PollQuestion = ({ question, onSubmit, canAnswer = true }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const hasAnswered = useSelector((state) => state.poll.hasAnswered);

  useEffect(() => {
    if (!question) return;
    
    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((question.expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [question]);

  const handleOptionClick = (optionId) => {
    if (!hasAnswered && canAnswer) {
      setSelectedOption(optionId);
    }
  };

  const handleSubmit = () => {
    if (selectedOption && !hasAnswered) {
      onSubmit(selectedOption);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!question) return null;

  return (
    <div className="poll-question-screen">
      <div className="poll-question-container">
        <div className="question-header">
          <span className="question-number">Question 1</span>
          <div className="timer">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 4V8L11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className={timeLeft <= 10 ? 'timer-critical' : ''}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="question-box">
          <p className="question-text">{question.text}</p>
        </div>

        <div className="options-list">
          {question.options.map((option, index) => (
            <div
              key={option.id}
              className={`option-item ${selectedOption === option.id ? 'option-selected' : ''} ${hasAnswered ? 'option-disabled' : ''}`}
              onClick={() => handleOptionClick(option.id)}
            >
              <div className="option-number">{index + 1}</div>
              <span className="option-label">{option.label}</span>
            </div>
          ))}
        </div>

        {canAnswer && (
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={!selectedOption || hasAnswered}
          >
            {hasAnswered ? 'Answer Submitted' : 'Submit'}
          </button>
        )}
      </div>
    </div>
  );
};

export default PollQuestion;
