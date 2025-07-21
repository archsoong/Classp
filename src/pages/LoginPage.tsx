import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '../services/api';

interface LoginPageProps {
  onLogin: (userType: 'teacher' | 'student', userId: string, classCode?: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { t } = useTranslation();
  const [teacherId, setTeacherId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validate teacher ID format (alphanumeric, 3-20 chars)
  const validateTeacherId = (id: string): boolean => {
    return /^[a-zA-Z0-9]{3,20}$/.test(id);
  };

  const handleTeacherLogin = async () => {
    setError('');
    setIsLoading(true);
    
    if (!teacherId.trim()) {
      setError(t('validation.required'));
      setIsLoading(false);
      return;
    }
    
    if (!validateTeacherId(teacherId)) {
      setError('Teacher ID must be 3-20 alphanumeric characters');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await apiService.login(teacherId);
      
      if (response.success && response.teacher) {
        onLogin('teacher', response.teacher.id);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error) {
      setError('Login failed. Please check your connection and try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
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
          <p className="neo-text-lg neo-font-bold neo-mt-2">{t('login.subtitle')}</p>
        </div>

        {/* Teacher Login Form */}
        <div className="neo-mb-6">
          <input
            type="text"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('login.teacherIdPlaceholder')}
            className="neo-input neo-mb-4 bg-neo-accent1"
            maxLength={20}
            style={{ textTransform: 'none' }}
          />
          
          <button
            onClick={handleTeacherLogin}
            disabled={isLoading}
            className="neo-btn neo-btn-primary neo-w-full"
            style={{ backgroundColor: '#FF1493', color: 'white', opacity: isLoading ? 0.6 : 1 }}
          >
            {isLoading ? 'Logging in...' : t('login.enterAsTeacher')}
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