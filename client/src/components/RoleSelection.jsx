import { useState } from 'react';
import './RoleSelection.css';

const RoleSelection = ({ onSelectRole }) => {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleClick = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      onSelectRole(selectedRole);
    }
  };

  return (
    <div className="role-selection">
      <div className="role-container">
        <div className="logo-badge">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L3 7V13L10 18L17 13V7L10 2Z" fill="white" stroke="white" strokeWidth="2"/>
          </svg>
          <span>Intervue Poll</span>
        </div>
        
        <h1 className="title">Welcome to the <strong>Live Polling System</strong></h1>
        <p className="subtitle">Please select the role that best describes you to begin using the live polling system</p>
        
        <div className="role-cards">
          <div 
            className={`role-card ${selectedRole === 'student' ? 'role-card-selected' : ''}`}
            onClick={() => handleRoleClick('student')}
          >
            <h2>I'm a Student</h2>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
          </div>
          
          <div 
            className={`role-card ${selectedRole === 'teacher' ? 'role-card-selected' : ''}`}
            onClick={() => handleRoleClick('teacher')}
          >
            <h2>I'm a Teacher</h2>
            <p>Submit answers and view live poll results in real-time.</p>
          </div>
        </div>
        
        <button 
          className="continue-btn" 
          onClick={handleContinue}
          disabled={!selectedRole}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
