import './PollResults.css';

const PollResults = ({ results, showHistory = false, onAskNext, isTeacher = false }) => {
  if (!results) return null;

  return (
    <div className="poll-results-screen">
      <div className="poll-results-container">
        {showHistory && (
          <button className="history-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            View Poll history
          </button>
        )}

        <h2 className="results-title">Question</h2>

        <div className="question-box">
          <p className="question-text">{results.text}</p>
        </div>

        <div className="results-list">
          {results.options.map((option, index) => (
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

        {isTeacher && onAskNext ? (
          <button className="ask-next-btn" onClick={onAskNext}>
            Ask Next Question
          </button>
        ) : (
          !showHistory && (
            <p className="waiting-message">Wait for the teacher to ask a new question..</p>
          )
        )}
      </div>
    </div>
  );
};

export default PollResults;
