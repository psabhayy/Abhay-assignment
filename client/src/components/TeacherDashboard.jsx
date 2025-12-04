import { useState } from 'react';
import { useSelector } from 'react-redux';
import './TeacherDashboard.css';

const TeacherDashboard = ({ onAskQuestion, onKickStudent, onViewHistory }) => {
  const [questionText, setQuestionText] = useState('');
  const [duration, setDuration] = useState(60);
  const [options, setOptions] = useState([
    { id: 'opt-1', label: '', isCorrect: true },
    { id: 'opt-2', label: '', isCorrect: false }
  ]);
  const [showParticipants, setShowParticipants] = useState(false);
  const [confirmKick, setConfirmKick] = useState(null);

  const students = useSelector((state) => state.poll.students);
  const currentQuestion = useSelector((state) => state.poll.currentQuestion);
  const results = useSelector((state) => state.poll.results);

  const activeStudents = students.filter((s) => !s.kicked);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, { id: `opt-${Date.now()}`, label: '', isCorrect: false }]);
    }
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (questionText.trim() && options.filter(o => o.label.trim()).length >= 2) {
      onAskQuestion({
        text: questionText.trim(),
        options: options.filter(o => o.label.trim()),
        duration
      });
      setQuestionText('');
      setOptions([
        { id: 'opt-1', label: '', isCorrect: true },
        { id: 'opt-2', label: '', isCorrect: false }
      ]);
    }
  };

  const handleKickConfirm = (studentId) => {
    onKickStudent(studentId);
    setConfirmKick(null);
  };

  return (
    <div className="teacher-dashboard">
      <div className="teacher-container">
        <div className="logo-badge">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L3 7V13L10 18L17 13V7L10 2Z" fill="white" stroke="white" strokeWidth="2"/>
          </svg>
          <span>Intervue Poll</span>
        </div>

        {onViewHistory && (
          <button className="view-history-btn" onClick={onViewHistory}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 4V8L10.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            View Poll History
          </button>
        )}

        <h1 className="teacher-title">Let's <strong>Get Started</strong></h1>
        <p className="teacher-subtitle">
          you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
        </p>

        <div className="form-group">
          <div className="form-header">
            <label>Enter your question</label>
            <div className="duration-selector">
              <span>{duration} seconds</span>
              <button onClick={() => setDuration(Math.max(10, duration - 10))}>−</button>
              <button onClick={() => setDuration(Math.min(120, duration + 10))}>+</button>
            </div>
          </div>
          <textarea
            placeholder="Rahul Bajaj"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            rows={3}
            maxLength={200}
          />
          <div className="char-count">{questionText.length}/100</div>
        </div>

        <div className="form-group">
          <label>Edit Options</label>
          <div className="options-grid">
            {options.map((option, index) => (
              <div key={option.id} className="option-input-row">
                <span className="option-index">{index + 1}</span>
                <input
                  type="text"
                  placeholder="Rahul Bajaj"
                  value={option.label}
                  onChange={(e) => updateOption(index, 'label', e.target.value)}
                />
                <div className="correct-toggle">
                  <label className="toggle-switch">
                    <input
                      type="radio"
                      name={`correct-option-${index}`}
                      checked={!option.isCorrect}
                      onChange={() => {
                        const newOptions = [...options];
                        newOptions[index].isCorrect = false;
                        setOptions(newOptions);
                      }}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span>Wrong</span>
                  <label className="toggle-switch">
                    <input
                      type="radio"
                      name={`correct-option-${index}`}
                      checked={option.isCorrect}
                      onChange={() => {
                        const newOptions = [...options];
                        newOptions[index].isCorrect = true;
                        setOptions(newOptions);
                      }}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span>Right</span>
                </div>
              </div>
            ))}
          </div>
          {options.length < 6 && (
            <button className="add-option-btn" onClick={addOption}>
              + Add More option
            </button>
          )}
        </div>

        <button 
          className="ask-question-btn"
          onClick={handleSubmit}
          disabled={!questionText.trim() || options.filter(o => o.label.trim()).length < 2}
        >
          Ask Question
        </button>

        <div className="participants-section">
          <div className="participants-toggle" onClick={() => setShowParticipants(!showParticipants)}>
            <div className="participants-header">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 10C12.21 10 14 8.21 14 6C14 3.79 12.21 2 10 2C7.79 2 6 3.79 6 6C6 8.21 7.79 10 10 10ZM10 12C7.33 12 2 13.34 2 16V18H18V16C18 13.34 12.67 12 10 12Z" fill="currentColor"/>
              </svg>
              <span>Active Students</span>
              <span className="student-count">{activeStudents.length}</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="toggle-arrow">
              <path d={showParticipants ? "M8 10L4 6h8l-4 4z" : "M12 6l-4 4-4-4h8z"} />
            </svg>
          </div>
        </div>

        {showParticipants && (
          <div className="participants-list">
            {activeStudents.length === 0 ? (
              <div className="no-students">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="22" stroke="#E5E7EB" strokeWidth="2"/>
                  <path d="M24 24C27.31 24 30 21.31 30 18C30 14.69 27.31 12 24 12C20.69 12 18 14.69 18 18C18 21.31 20.69 24 24 24ZM24 27C19.33 27 10 29.34 10 34V36H38V34C38 29.34 28.67 27 24 27Z" fill="#E5E7EB"/>
                </svg>
                <p>No students have joined yet</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {activeStudents.map((student, index) => (
                    <tr key={student.id}>
                      <td className="student-number">{index + 1}</td>
                      <td className="student-name">
                        <div className="student-avatar">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        {student.name}
                      </td>
                      <td>
                        <span className="status-badge status-active">Active</span>
                      </td>
                      <td>
                        <button
                          className="kick-btn"
                          onClick={() => setConfirmKick(student)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 6L6 4L8 6L10 4L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M3 8H13V13C13 13.5523 12.5523 14 12 14H4C3.44772 14 3 13.5523 3 13V8Z" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M6 2H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {confirmKick && (
          <div className="confirm-modal-overlay" onClick={() => setConfirmKick(null)}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="22" fill="#FEE2E2"/>
                  <path d="M24 14V26M24 30V32" stroke="#DC2626" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Remove Student?</h3>
              <p>Are you sure you want to remove <strong>{confirmKick.name}</strong> from this poll session?</p>
              <p className="confirm-warning">This action cannot be undone during this session.</p>
              <div className="confirm-actions">
                <button className="cancel-btn" onClick={() => setConfirmKick(null)}>
                  Cancel
                </button>
                <button className="confirm-btn" onClick={() => handleKickConfirm(confirmKick.id)}>
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
