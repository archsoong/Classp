import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherClassroom from './pages/TeacherClassroom';
import StudentClassroom from './pages/StudentClassroom';

type AppState = 'login' | 'teacherDashboard' | 'teacherClassroom' | 'studentClassroom';

interface User {
  id: string;
  type: 'teacher' | 'student';
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

  const handleLogin = (userType: 'teacher' | 'student', userId: string, classCode?: string) => {
    setUser({ id: userId, type: userType });

    if (userType === 'teacher') {
      setCurrentState('teacherDashboard');
    } else if (userType === 'student' && classCode) {
      // In a real app, you would validate the class code here
      setCurrentClass({
        code: classCode,
        name: 'MATH 101', // This would come from the server
        teacherName: 'MR. SMITH', // This would come from the server
      });
      setCurrentState('studentClassroom');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentClass(null);
    setCurrentState('login');
  };

  const handleEnterClass = (classCode: string) => {
    // In a real app, you would fetch class details from the server
    setCurrentClass({
      code: classCode,
      name: 'MATH 101', // This would come from the server based on classCode
    });
    setCurrentState('teacherClassroom');
  };

  const handleBackToDashboard = () => {
    setCurrentClass(null);
    setCurrentState('teacherDashboard');
  };

  const handleLeaveClass = () => {
    setCurrentClass(null);
    setCurrentState('login');
  };

  return (
    <div className="App">
      {currentState === 'login' && (
        <LoginPage onLogin={handleLogin} />
      )}

      {currentState === 'teacherDashboard' && user && (
        <TeacherDashboard
          teacherId={user.id}
          onLogout={handleLogout}
          onEnterClass={handleEnterClass}
        />
      )}

      {currentState === 'teacherClassroom' && user && currentClass && (
        <TeacherClassroom
          classCode={currentClass.code}
          className={currentClass.name}
          onBack={handleBackToDashboard}
        />
      )}

      {currentState === 'studentClassroom' && user && currentClass && (
        <StudentClassroom
          classCode={currentClass.code}
          className={currentClass.name}
          teacherName={currentClass.teacherName || 'TEACHER'}
          studentId={user.id}
          onLeave={handleLeaveClass}
        />
      )}
    </div>
  );
}

export default App;
