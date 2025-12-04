import './KickedScreen.css';

const KickedScreen = () => {
  return (
    <div className="kicked-screen">
      <div className="kicked-container">
        <div className="logo-badge">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L3 7V13L10 18L17 13V7L10 2Z" fill="white" stroke="white" strokeWidth="2"/>
          </svg>
          <span>Intervue Poll</span>
        </div>
        
        <h1 className="kicked-title">You've been Kicked out !</h1>
        <p className="kicked-message">
          Looks like the teacher had removed you from the poll system. Please Try again sometime.
        </p>
      </div>
    </div>
  );
};

export default KickedScreen;
