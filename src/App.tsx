import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherClassroom from './pages/TeacherClassroom';
import StudentJoinPage from './pages/StudentJoinPage';
import StudentClassroom from './pages/StudentClassroom';

type AppState = 'login' | 'teacherDashboard' | 'teacherClassroom' | 'studentJoin' | 'studentClassroom';

interface User {
  id: string;
  type: 'teacher' | 'student';
  name?: string; // For students
}

interface ClassInfo {
  code: string;
  name: string;
  teacherName?: string;
}

function App() {
  const [currentState, setCurrentState] = useState<AppState>('login');
  const [user, setUser] = useState<User | null>(null);
  const [currentClass, setCurrentClass] = useState<ClassInfo | null>(null);

  // Handle teacher login from LoginPage
  const handleLogin = (userType: 'teacher' | 'student', userId: string, classCode?: string) => {
    setUser({ id: userId, type: userType });

    if (userType === 'teacher') {
      setCurrentState('teacherDashboard');
    } else if (userType === 'student' && classCode) {
      // This shouldn't happen in the new flow, but keeping for compatibility
      setCurrentClass({
        code: classCode,
        name: 'MATH 101', // This would come from the server
        teacherName: 'MR. SMITH', // This would come from the server
      });
      setCurrentState('studentClassroom');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setCurrentClass(null);
    setCurrentState('login');
  };

  // Handle teacher entering a class from dashboard
  const handleEnterClass = (classCode: string) => {
    // In a real app, you would fetch class details from the server
    setCurrentClass({
      code: classCode,
      name: 'MATH 101', // This would come from the server based on classCode
    });
    setCurrentState('teacherClassroom');
  };

  // Handle teacher going back to dashboard
  const handleBackToDashboard = () => {
    setCurrentClass(null);
    setCurrentState('teacherDashboard');
  };

  // Handle student joining class from StudentJoinPage
  const handleStudentJoinClass = (studentName: string, studentId: string, classCode: string) => {
    // Create student user with name
    setUser({ 
      id: studentId, 
      type: 'student',
      name: studentName 
    });
    
    // Set class info (in real app, this would come from server)
    setCurrentClass({
      code: classCode,
      name: 'MATH 101', // This would come from the server
      teacherName: 'MR. SMITH', // This would come from the server
    });
    
    setCurrentState('studentClassroom');
  };

  // Handle student leaving class
  const handleLeaveClass = () => {
    setUser(null);
    setCurrentClass(null);
    setCurrentState('login');
  };

  // Handle navigation to student join page (for direct links)
  const handleNavigateToStudentJoin = (classCode?: string) => {
    setCurrentState('studentJoin');
    if (classCode) {
      // Pre-fill class code if provided in URL
      setCurrentClass({ code: classCode, name: '' });
    }
  };

  // Handle back to home from student join page
  const handleBackToHome = () => {
    setCurrentState('login');
    setUser(null);
    setCurrentClass(null);
  };

  return (
    <div className="App">
      {/* Login Page - Teacher only entry point */}
      {currentState === 'login' && (
        <LoginPage onLogin={handleLogin} />
      )}

      {/* Teacher Dashboard - Class management hub */}
      {currentState === 'teacherDashboard' && user && user.type === 'teacher' && (
        <TeacherDashboard
          teacherId={user.id}
          onLogout={handleLogout}
          onEnterClass={handleEnterClass}
        />
      )}

      {/* Teacher Classroom - Live class control center */}
      {currentState === 'teacherClassroom' && user && user.type === 'teacher' && currentClass && (
        <TeacherClassroom
          classCode={currentClass.code}
          className={currentClass.name}
          onBack={handleBackToDashboard}
        />
      )}

      {/* Student Join Page - Class entry point via link */}
      {currentState === 'studentJoin' && (
        <StudentJoinPage
          classCode={currentClass?.code}
          onJoinClass={handleStudentJoinClass}
          onBackToHome={handleBackToHome}
        />
      )}

      {/* Student Classroom - Question answering interface */}
      {currentState === 'studentClassroom' && user && user.type === 'student' && currentClass && (
        <StudentClassroom
          classCode={currentClass.code}
          className={currentClass.name}
          teacherName={currentClass.teacherName || 'TEACHER'}
          studentId={user.id}
          studentName={user.name || user.id}
          onLeave={handleLeaveClass}
        />
      )}
    </div>
  );
}

export default App;
