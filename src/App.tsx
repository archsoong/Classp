import React, { useState, useEffect, useRef } from 'react';
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherClassroom from './pages/TeacherClassroom';
import StudentJoinPage from './pages/StudentJoinPage';
import StudentClassroom from './pages/StudentClassroom';
import ChangelogPage from './pages/ChangelogPage';
import AboutPage from './pages/AboutPage';
import WishlistPage from './pages/WishlistPage';
import ContactPage from './pages/ContactPage';

type AppState = 'login' | 'teacherDashboard' | 'teacherClassroom' | 'studentJoin' | 'studentClassroom' | 'changelog' | 'about' | 'wishlist' | 'contact';

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
  const [devMode, setDevMode] = useState(false); // Dev navigation collapsed by default
  const [showTeacherDropdown, setShowTeacherDropdown] = useState(false); // Teacher dropdown state
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for dropdown click outside detection

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTeacherDropdown(false);
      }
    };

    if (showTeacherDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTeacherDropdown]);

  // Development navigation - for UI review
  const handleDevNavigation = (page: AppState) => {
    setCurrentState(page);
    
    // Set up mock data for each page
    switch (page) {
      case 'teacherDashboard':
        setUser({ id: 'TEACHER123', type: 'teacher' });
        setCurrentClass(null);
        break;
      case 'teacherClassroom':
        setUser({ id: 'TEACHER123', type: 'teacher' });
        setCurrentClass({ code: 'ABC123', name: 'MATH 101' });
        break;
      case 'studentJoin':
        setUser(null);
        setCurrentClass({ code: 'ABC123', name: 'MATH 101' });
        break;
      case 'studentClassroom':
        setUser({ id: 'STUDENT456', type: 'student', name: 'John Doe' });
        setCurrentClass({ code: 'ABC123', name: 'MATH 101', teacherName: 'MR. SMITH' });
        break;
      case 'changelog':
      case 'about':
      case 'wishlist':
      case 'contact':
        // Navigation pages don't need special state setup
        setUser(null);
        setCurrentClass(null);
        break;
      case 'login':
      default:
        setUser(null);
        setCurrentClass(null);
        break;
    }
  };

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
    setShowTeacherDropdown(false); // Close dropdown on logout
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
    setShowTeacherDropdown(false); // Close dropdown when navigating
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
      {/* Main Navigation Header */}
      <nav className="neo-main-nav">
        <a href="#" className="neo-main-nav-logo" onClick={() => setCurrentState('login')}>
          <div className="neo-main-nav-logo-icon">C</div>
          <span>Classp</span>
        </a>
        <div className="neo-main-nav-links">
          <a href="#" className="neo-main-nav-link" onClick={(e) => { e.preventDefault(); setCurrentState('changelog'); }}>Changelog</a>
          <a href="#" className="neo-main-nav-link" onClick={(e) => { e.preventDefault(); setCurrentState('about'); }}>About</a>
          <a href="#" className="neo-main-nav-link" onClick={(e) => { e.preventDefault(); setCurrentState('wishlist'); }}>Wishlist</a>
          <a href="#" className="neo-main-nav-link" onClick={(e) => { e.preventDefault(); setCurrentState('contact'); }}>Contact</a>
          
          {/* Teacher Dropdown or Login Button */}
          {user && user.type === 'teacher' ? (
            <div className="neo-teacher-dropdown" style={{ position: 'relative' }} ref={dropdownRef}>
              <button 
                className="neo-main-nav-login-btn"
                onClick={(e) => { 
                  e.preventDefault(); 
                  setShowTeacherDropdown(!showTeacherDropdown); 
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Hi, {user.id}
                <span style={{ fontSize: '12px' }}>▼</span>
              </button>
              
              {showTeacherDropdown && (
                <div 
                  className="neo-dropdown-menu"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #000000',
                    zIndex: 1000,
                    minWidth: '160px',
                    boxShadow: '4px 4px 0px #000000'
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentState('teacherDashboard');
                      setCurrentClass(null);
                      setShowTeacherDropdown(false);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      borderBottom: '1px solid #000000'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a href="#" className="neo-main-nav-login-btn" onClick={(e) => { e.preventDefault(); setCurrentState('login'); }}>Login</a>
          )}
        </div>
      </nav>

      {/* Development Navigation Bar - for UI review */}
      {devMode && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: '#000',
          color: 'white',
          padding: '8px 16px',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          <span style={{ fontWeight: 'bold', marginRight: '16px' }}>DEV NAV:</span>
          <button 
            onClick={() => handleDevNavigation('login')}
            style={{ 
              background: currentState === 'login' ? '#FF7A5C' : '#333', 
              color: 'white', 
              border: 'none', 
              padding: '4px 8px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Login
          </button>
          <button 
            onClick={() => handleDevNavigation('teacherDashboard')}
            style={{ 
              background: currentState === 'teacherDashboard' ? '#FF7A5C' : '#333', 
              color: 'white', 
              border: 'none', 
              padding: '4px 8px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Teacher Dashboard
          </button>
          <button 
            onClick={() => handleDevNavigation('teacherClassroom')}
            style={{ 
              background: currentState === 'teacherClassroom' ? '#FF7A5C' : '#333', 
              color: 'white', 
              border: 'none', 
              padding: '4px 8px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Teacher Classroom
          </button>
          <button 
            onClick={() => handleDevNavigation('studentJoin')}
            style={{ 
              background: currentState === 'studentJoin' ? '#FF7A5C' : '#333', 
              color: 'white', 
              border: 'none', 
              padding: '4px 8px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Student Join
          </button>
          <button 
            onClick={() => handleDevNavigation('studentClassroom')}
            style={{ 
              background: currentState === 'studentClassroom' ? '#FF7A5C' : '#333', 
              color: 'white', 
              border: 'none', 
              padding: '4px 8px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Student Classroom
          </button>
          <button 
            onClick={() => handleDevNavigation('changelog')}
            style={{ 
              background: currentState === 'changelog' ? '#FF7A5C' : '#333', 
              color: 'white', 
              border: 'none', 
              padding: '4px 8px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Changelog
          </button>
          <button 
            onClick={() => handleDevNavigation('about')}
            style={{ 
              background: currentState === 'about' ? '#FF7A5C' : '#333', 
              color: 'white', 
              border: 'none', 
              padding: '4px 8px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            About
          </button>
          <button 
            onClick={() => handleDevNavigation('wishlist')}
            style={{ 
              background: currentState === 'wishlist' ? '#FF7A5C' : '#333', 
              color: 'white', 
              border: 'none', 
              padding: '4px 8px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Wishlist
          </button>
          <button 
            onClick={() => handleDevNavigation('contact')}
            style={{ 
              background: currentState === 'contact' ? '#FF7A5C' : '#333', 
              color: 'white', 
              border: 'none', 
              padding: '4px 8px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Contact
          </button>
          <button 
            onClick={() => setDevMode(false)}
            style={{ 
              background: '#666', 
              color: 'white', 
              border: 'none', 
              padding: '4px 8px', 
              cursor: 'pointer',
              fontSize: '12px',
              marginLeft: 'auto'
            }}
          >
            Hide Nav
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="neo-main-content" style={{ paddingTop: devMode ? '40px' : '0' }}>
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

        {/* Navigation Pages */}
        {currentState === 'changelog' && <ChangelogPage />}
        {currentState === 'about' && <AboutPage />}
        {currentState === 'wishlist' && <WishlistPage />}
        {currentState === 'contact' && <ContactPage />}
      </div>

      {/* Show dev nav toggle if hidden */}
      {!devMode && (
        <button
          onClick={() => setDevMode(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 9999,
            background: '#000',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: 'monospace',
            borderRadius: '4px'
          }}
        >
          Show Dev Nav
        </button>
      )}
    </div>
  );
}

export default App;
