import './PollResults.css';

const PollResults = ({ results, showHistory = false, onAskNext, isTeacher = false, studentAnswer = null }) => {
  if (!results) return null;

  // Find the correct answer and student's answer
  const correctOption = results.options.find(opt => opt.isCorrect);
  const studentSelectedOption = studentAnswer ? results.options.find(opt => opt.id === studentAnswer) : null;
  const isCorrect = studentAnswer && correctOption && studentAnswer === correctOption.id;
  const showFeedback = !isTeacher && studentAnswer && !showHistory;

  return (
    <div className="poll-results-screen">
      <div className="poll-results-container">
        {showHistory && (
          <button className="history-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.1337 14 8 14" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            View Poll history
          </button>
        )}

        {showFeedback && (
          <div className={`feedback-banner ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
            <div className="feedback-icon">
              {isCorrect ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
                  <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2"/>
                  <path d="M8 8L16 16M16 8L8 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              )}
            </div>
            <div className="feedback-content">
              <h3 className="feedback-title">
                {isCorrect ? '🎉 Correct Answer!' : '❌ Wrong Answer'}
              </h3>
              <p className="feedback-message">
                {isCorrect 
                  ? `Great job! You selected the correct answer: "${studentSelectedOption?.label}"`
                  : `You selected "${studentSelectedOption?.label}". The correct answer is: "${correctOption?.label}"`
                }
              </p>
            </div>
          </div>
        )}

        <h2 className="results-title">Question</h2>

        <div className="question-box">
          <p className="question-text">{results.text}</p>
        </div>

        <div className="results-list">
          {results.options.map((option, index) => {
            const isStudentChoice = studentAnswer === option.id;
            const isCorrectAnswer = option.isCorrect;
            
            return (
              <div 
                key={option.id} 
                className={`result-item ${isCorrectAnswer ? 'result-correct' : ''} ${isStudentChoice ? 'result-student-choice' : ''}`}
              >
                <div className="result-header">
                  <div className="result-option">
                    <span className="option-number">{index + 1}</span>
                    <span className="option-label">{option.label}</span>
                    {isCorrectAnswer && (
                      <span className="correct-badge">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Correct
                      </span>
                    )}
                    {isStudentChoice && (
                      <span className="your-answer-badge">Your Answer</span>
                    )}
                  </div>
                  <span className="result-percentage">{option.percentage}%</span>
                </div>
                <div className="result-bar-container">
                  <div
                    className={`result-bar ${isCorrectAnswer ? 'bar-correct' : ''} ${isStudentChoice && !isCorrectAnswer ? 'bar-wrong' : ''}`}
                    style={{ width: `${option.percentage}%` }}
                  ></div>
                </div>
                <div className="result-votes">{option.votes} vote{option.votes !== 1 ? 's' : ''}</div>
              </div>
            );
          })}
        </div>

        {/* Teacher: Student Answer Breakdown */}
        {isTeacher && results.studentAnswers && results.studentAnswers.length > 0 && (
          <div className="student-answers-section">
            <div className="student-answers-header">
              <h3 className="student-answers-title">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 10C12.21 10 14 8.21 14 6C14 3.79 12.21 2 10 2C7.79 2 6 3.79 6 6C6 8.21 7.79 10 10 10ZM10 12C7.33 12 2 13.34 2 16V18H18V16C18 13.34 12.67 12 10 12Z" fill="currentColor"/>
                </svg>
                Student Answers Breakdown
              </h3>
              <div className="answer-stats">
                <span className="stat-correct">
                  ✅ {results.studentAnswers.filter(a => a.isCorrect).length} Correct
                </span>
                <span className="stat-wrong">
                  ❌ {results.studentAnswers.filter(a => !a.isCorrect).length} Wrong
                </span>
              </div>
            </div>

            <div className="student-answers-list">
              {results.studentAnswers.map((answer, idx) => (
                <div 
                  key={answer.studentId} 
                  className={`student-answer-item ${answer.isCorrect ? 'answer-correct' : 'answer-wrong'}`}
                >
                  <div className="student-answer-avatar">
                    {answer.studentName.charAt(0).toUpperCase()}
                  </div>
                  <div className="student-answer-details">
                    <div className="student-answer-name">{answer.studentName}</div>
                    <div className="student-answer-choice">
                      <span className="answer-label">Selected:</span>
                      <span className="answer-value">{answer.selectedOptionLabel}</span>
                      {answer.isCorrect ? (
                        <span className="answer-status status-correct">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Correct
                        </span>
                      ) : (
                        <span className="answer-status status-wrong">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M5 5L11 11M11 5L5 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          Wrong
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="student-answer-rank">#{idx + 1}</div>
                </div>
              ))}
            </div>
          </div>
        )}

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
