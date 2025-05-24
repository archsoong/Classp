import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (userType: 'teacher' | 'student', userId: string, classCode?: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [showClassCodeInput, setShowClassCodeInput] = useState(false);
  const [classCode, setClassCode] = useState('');

  const handleTeacherLogin = () => {
    if (!userId.trim()) {
      alert('Please enter your ID');
      return;
    }
    if (userId.length < 3 || userId.length > 20 || !/^[a-zA-Z0-9]+$/.test(userId)) {
      alert('ID must be 3-20 alphanumeric characters');
      return;
    }
    onLogin('teacher', userId);
  };

  const handleStudentLogin = () => {
    if (!userId.trim()) {
      alert('Please enter your ID');
      return;
    }
    if (userId.length < 3 || userId.length > 20 || !/^[a-zA-Z0-9]+$/.test(userId)) {
      alert('ID must be 3-20 alphanumeric characters');
      return;
    }
    setShowClassCodeInput(true);
  };

  const handleJoinClass = () => {
    if (!classCode.trim()) {
      alert('Please enter class code');
      return;
    }
    onLogin('student', userId, classCode);
  };

  return (
    <div className="neo-container">
      <div className="neo-card neo-p-8 neo-max-w-md neo-w-full bg-neo-white">
        <div className="neo-text-center neo-mb-8">
          <div className="neo-logo">CI</div>
          <h1 className="neo-text-4xl neo-font-black">
            CLASSROOM<br />INTERACTIVE
          </h1>
        </div>

        {!showClassCodeInput ? (
          <>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="ENTER YOUR ID"
              className="neo-input bg-neo-blue neo-mb-6"
              maxLength={20}
            />

            <div className="neo-grid neo-grid-2">
              <button
                onClick={handleTeacherLogin}
                className="neo-btn bg-neo-green neo-text-xl"
              >
                I'M A<br />TEACHER
              </button>
              <button
                onClick={handleStudentLogin}
                className="neo-btn bg-neo-purple neo-text-xl"
              >
                I'M A<br />STUDENT
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="neo-mb-6">
              <p className="neo-font-bold neo-mb-4">STUDENT: {userId}</p>
              <input
                type="text"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                placeholder="ENTER CLASS CODE"
                className="neo-input bg-neo-cyan"
                maxLength={6}
              />
            </div>

            <div className="neo-grid neo-grid-2">
              <button
                onClick={handleJoinClass}
                className="neo-btn bg-neo-green"
              >
                JOIN CLASS
              </button>
              <button
                onClick={() => setShowClassCodeInput(false)}
                className="neo-btn bg-neo-gray"
              >
                BACK
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPage; 