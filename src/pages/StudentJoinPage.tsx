import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface StudentJoinPageProps {
  classCode?: string;
  onJoinClass: (studentName: string, studentId: string, classCode: string) => void;
  onBackToHome: () => void;
}

type ClassState = 'active' | 'ended' | 'not-started' | 'loading';

const StudentJoinPage: React.FC<StudentJoinPageProps> = ({
  classCode: initialClassCode = '',
  onJoinClass,
  onBackToHome,
}) => {
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [classCode, setClassCode] = useState(initialClassCode);
  const [classState, setClassState] = useState<ClassState>('loading');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Simulate checking class status
  useEffect(() => {
    if (classCode) {
      checkClassStatus(classCode);
    } else {
      setClassState('active'); // Default to active if no code provided
    }
  }, [classCode]);

  const checkClassStatus = async (code: string) => {
    setClassState('loading');
    setError('');
    
    try {
      const classData = await apiService.getClass(code);
      
      if (classData.status === 'active') {
        setClassState('active');
      } else if (classData.status === 'ended') {
        setClassState('ended');
      } else if (classData.status === 'preparing') {
        setClassState('not-started');
      }
    } catch {
      setError('Class not found or invalid class code');
      setClassState('active'); // Allow retry
    }
  };

  const validateInputs = (): boolean => {
    if (!studentName.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!studentId.trim()) {
      setError('Please enter your Student ID');
      return false;
    }
    if (!classCode.trim()) {
      setError('Please enter the class code');
      return false;
    }
    return true;
  };

  const handleJoinClass = async () => {
    setError('');
    setIsJoining(true);
    
    if (!validateInputs()) {
      setIsJoining(false);
      return;
    }

    try {
      const response = await apiService.joinClass({
        code: classCode,
        studentName,
        studentId,
      });

      if (response.success) {
        onJoinClass(studentName, studentId, classCode);
      } else {
        setError(response.message || 'Failed to join class');
      }
    } catch (error) {
      setError('Failed to join class. Please try again.');
      console.error('Error joining class:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleRefresh = () => {
    if (classCode) {
      checkClassStatus(classCode);
    }
  };

  const renderActiveClassState = () => (
    <>
      <div className="neo-mb-6">
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Your Name"
          className="neo-input neo-mb-4 bg-neo-accent1"
          style={{ textTransform: 'none' }}
        />
        
        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Student ID"
          className="neo-input neo-mb-4 bg-neo-accent2"
          style={{ textTransform: 'none' }}
        />
        
        <input
          type="text"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value.toUpperCase())}
          placeholder="Class Code"
          className="neo-input neo-mb-4 bg-neo-info"
        />
      </div>

      <button
        onClick={handleJoinClass}
        disabled={isJoining}
        className="neo-btn neo-btn-success neo-w-full neo-mb-4"
        style={{ opacity: isJoining ? 0.6 : 1 }}
      >
        {isJoining ? 'Joining...' : 'Join Class'}
      </button>
    </>
  );

  const renderEndedClassState = () => (
    <>
      <div className="neo-text-center neo-mb-6">
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>🔴</div>
        <h2 className="neo-text-2xl neo-font-black neo-mb-4">Class Has Ended</h2>
        <p className="neo-font-bold">This class is no longer active</p>
      </div>

      <button
        onClick={onBackToHome}
        className="neo-btn neo-btn-muted neo-w-full"
      >
        Back to Home
      </button>
    </>
  );

  const renderNotStartedState = () => (
    <>
      <div className="neo-text-center neo-mb-6">
        <div style={{ fontSize: '80px', marginBottom: '16px' }}>⏳</div>
        <h2 className="neo-text-2xl neo-font-black neo-mb-4">Class Not Started</h2>
        <p className="neo-font-bold">Please wait for your teacher to start the class</p>
      </div>

      <button
        onClick={handleRefresh}
        className="neo-btn neo-btn-info neo-w-full"
      >
        Refresh
      </button>
    </>
  );

  const renderLoadingState = () => (
    <div className="neo-text-center neo-mb-6">
      <div className="neo-pulse" style={{ fontSize: '80px', marginBottom: '16px' }}>⏳</div>
      <p className="neo-font-bold">Checking class status...</p>
    </div>
  );

  return (
    <div className="neo-container">
      <div className="neo-card neo-p-8 neo-max-w-md neo-w-full bg-neo-surface">
        {/* App Logo and Branding */}
        <div className="neo-text-center neo-mb-8">
          <div className="neo-logo">CP</div>
          <h1 className="neo-text-4xl neo-font-black">Join Class</h1>
        </div>

        {/* Dynamic Content Based on Class State */}
        {classState === 'loading' && renderLoadingState()}
        {classState === 'active' && renderActiveClassState()}
        {classState === 'ended' && renderEndedClassState()}
        {classState === 'not-started' && renderNotStartedState()}

        {/* Error Display */}
        {error && (
          <div className="neo-text-center neo-mb-4 neo-card-sm neo-p-4 bg-neo-error" style={{ color: 'white', fontWeight: 'bold' }}>
            {error}
          </div>
        )}

        {/* Back to Home Link */}
        <div className="neo-text-center">
          <button
            onClick={onBackToHome}
            className="neo-btn-sm neo-btn-muted"
            style={{ backgroundColor: 'transparent', border: 'none', textDecoration: 'underline' }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentJoinPage; 