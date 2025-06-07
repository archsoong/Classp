import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (userType: 'teacher' | 'student', userId: string, classCode?: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [teacherId, setTeacherId] = useState('');
  const [error, setError] = useState('');

  // Validate teacher ID format (alphanumeric, 3-20 chars)
  const validateTeacherId = (id: string): boolean => {
    return /^[a-zA-Z0-9]{3,20}$/.test(id);
  };

  const handleTeacherLogin = () => {
    setError('');
    
    if (!teacherId.trim()) {
      setError('Please enter your Teacher ID');
      return;
    }
    
    if (!validateTeacherId(teacherId)) {
      setError('Teacher ID must be 3-20 alphanumeric characters');
      return;
    }
    
    // Simulate teacher authentication - in real app, this would check against database
    onLogin('teacher', teacherId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTeacherLogin();
    }
  };

  return (
    <div className="neo-container">
      <div className="neo-card neo-p-8 neo-max-w-md neo-w-full bg-neo-surface">
        {/* App Logo and Branding */}
        <div className="neo-text-center neo-mb-8">
          <div className="neo-logo">CP</div>
          <h1 className="neo-text-4xl neo-font-black">
            Classp
          </h1>
        </div>

        {/* Teacher Login Form */}
        <div className="neo-mb-6">
          <input
            type="text"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter Teacher ID"
            className="neo-input neo-mb-4 bg-neo-accent1"
            maxLength={20}
            style={{ textTransform: 'none' }}
          />
          
          <button
            onClick={handleTeacherLogin}
            className="neo-btn neo-btn-primary neo-w-full"
          >
            Login
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="neo-text-center neo-card-sm neo-p-4 bg-neo-error" style={{ color: 'white', fontWeight: 'bold' }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage; 