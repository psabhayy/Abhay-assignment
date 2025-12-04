import { useState } from 'react';
import './PollHistory.css';

const PollHistory = ({ history, onClose }) => {
  const [selectedPoll, setSelectedPoll] = useState(null);

  if (!history || history.length === 0) {
    return (
      <div className="poll-history-screen">
        <div className="poll-history-container">
          <div className="history-header">
            <h2>Poll History</h2>
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
          <p className="no-history">No polls conducted yet.</p>
        </div>
      </div>
    );
  }

  if (selectedPoll) {
    return (
      <div className="poll-history-screen">
        <div className="poll-history-container">
          <div className="history-header">
            <button className="back-btn" onClick={() => setSelectedPoll(null)}>
              ← Back to History
            </button>
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>

          <h2 className="results-title">Question</h2>
          <div className="question-box">
            <p className="question-text">{selectedPoll.text}</p>
          </div>

          <div className="results-list">
            {selectedPoll.options.map((option, index) => (
              <div key={option.id} className="result-item">
                <div className="result-header">
                  <div className="result-option">
                    <span className="option-number">{index + 1}</span>
                    <span className="option-label">{option.label}</span>
                  </div>
                  <span className="result-percentage">{option.percentage}%</span>
                </div>
                <div className="result-bar-container">
                  <div
                    className="result-bar"
                    style={{ width: `${option.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="poll-stats">
            <p>Total Responses: {selectedPoll.totalResponses}</p>
            <p>Total Students: {selectedPoll.totalStudents}</p>
            <p>Conducted: {new Date(selectedPoll.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="poll-history-screen">
      <div className="poll-history-container">
        <div className="history-header">
          <h2>Poll History</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="history-list">
          {history.map((poll, index) => (
            <div
              key={poll.id}
              className="history-item"
              onClick={() => setSelectedPoll(poll)}
            >
              <div className="history-item-header">
                <span className="history-number">Poll #{history.length - index}</span>
                <span className="history-date">
                  {new Date(poll.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="history-question">{poll.text}</p>
              <div className="history-meta">
                <span>{poll.totalResponses} responses</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PollHistory;
