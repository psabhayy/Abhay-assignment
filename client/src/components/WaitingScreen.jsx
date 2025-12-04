import './WaitingScreen.css';

const WaitingScreen = () => {
  const handleChangeStudent = () => {
    if (window.confirm('Do you want to join as a different student? This will clear your current session.')) {
      localStorage.removeItem('role');
      localStorage.removeItem('studentId');
      localStorage.removeItem('studentName');
      window.location.reload();
    }
  };

  return (
    <div className="waiting-screen">
      <div className="waiting-container">
        <div className="logo-badge">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L3 7V13L10 18L17 13V7L10 2Z" fill="white" stroke="white" strokeWidth="2"/>
          </svg>
          <span>Intervue Poll</span>
        </div>
        
        <div className="spinner-large"></div>
        
        <h2 className="waiting-title">Wait for the teacher to ask questions..</h2>
        
        <button 
          onClick={handleChangeStudent}
          style={{
            marginTop: '20px',
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Switch Student
        </button>
      </div>
    </div>
  );
};

export default WaitingScreen;
