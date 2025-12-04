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

        {(currentQuestion || results) && (
          <div className="participants-toggle" onClick={() => setShowParticipants(!showParticipants)}>
            <span>Participants</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d={showParticipants ? "M8 10L4 6h8l-4 4z" : "M12 6l-4 4-4-4h8z"} />
            </svg>
          </div>
        )}

        {showParticipants && (
          <div className="participants-list">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>
                      <button
                        className="kick-btn"
                        onClick={() => onKickStudent(student.id)}
                      >
                        Kick out
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
