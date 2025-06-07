import React, { useState } from 'react';

interface Class {
  id: string;
  name: string;
  code: string;
  students: number;
  lastActive: string;
  questions: number;
  status: 'preparing' | 'active' | 'ended';
  createdAt: string;
}

interface TeacherDashboardProps {
  teacherId: string;
  onLogout: () => void;
  onEnterClass: (classCode: string) => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacherId,
  onLogout,
  onEnterClass,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [className, setClassName] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [classes, setClasses] = useState<Class[]>([
    {
      id: '1',
      name: 'MATH 101',
      code: 'ABC123',
      students: 25,
      lastActive: '2 hours ago',
      questions: 15,
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'SCIENCE 202',
      code: 'XYZ789',
      students: 30,
      lastActive: 'Yesterday',
      questions: 8,
      status: 'ended',
      createdAt: '2024-01-14',
    },
    {
      id: '3',
      name: 'HISTORY 101',
      code: 'HIJ456',
      students: 0,
      lastActive: 'Never',
      questions: 0,
      status: 'preparing',
      createdAt: '2024-01-16',
    },
  ]);

  // Generate unique 8-character class code
  const generateClassCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const showCreateClassModal = () => {
    setShowCreateModal(true);
    setClassName('');
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setClassName('');
  };

  const createNewClass = () => {
    if (!className.trim()) {
      alert('Please enter a class name');
      return;
    }

    const newClass: Class = {
      id: Date.now().toString(),
      name: className.toUpperCase(),
      code: generateClassCode(),
      students: 0,
      lastActive: 'Just created',
      questions: 0,
      status: 'preparing',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setClasses([newClass, ...classes]);
    closeModal();
  };

  const exportClassData = (classItem: Class) => {
    // Mock export functionality - in real app, this would generate actual JSON export
    const exportData = {
      class: classItem,
      exportedAt: new Date().toISOString(),
      questions: [], // Would contain actual question data
      participants: [], // Would contain actual participant data
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    (link as any).download = `${classItem.name}_${classItem.code}_export.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filterClasses = (status: 'active' | 'past') => {
    setActiveTab(status);
  };

  const getFilteredClasses = () => {
    if (activeTab === 'active') {
      return classes.filter(c => c.status === 'active' || c.status === 'preparing');
    } else {
      return classes.filter(c => c.status === 'ended');
    }
  };

  const getStatusBadge = (status: Class['status']) => {
    const statusConfig = {
      preparing: { text: '⚫ Preparing', color: '#666666' },
      active: { text: '🟢 Active', color: '#00FF66' },
      ended: { text: '🔴 Ended', color: '#FF0000' },
    };
    
    const config = statusConfig[status];
    return (
      <span 
        className="neo-card-sm neo-p-2 neo-font-black" 
        style={{ backgroundColor: config.color, color: 'black', padding: '4px 8px' }}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="neo-page">
      {/* Header */}
      <header className="neo-header">
        <h1 className="neo-text-2xl neo-font-black">Welcome, {teacherId}</h1>
        <button onClick={onLogout} className="neo-btn" style={{ backgroundColor: '#FF0000', color: 'white' }}>
          Logout
        </button>
      </header>

      <div className="neo-max-w-6xl" style={{ margin: '0 auto' }}>
        {/* Create Class Button */}
        <div className="neo-mb-6">
          <button
            onClick={showCreateClassModal}
            className="neo-btn-lg"
            style={{ backgroundColor: '#FF0066', color: 'white', maxWidth: '400px' }}
          >
            + Create New Class
          </button>
        </div>

        {/* Tab Group */}
        <div className="neo-mb-6">
          <div className="neo-flex neo-gap-4">
            <button
              onClick={() => filterClasses('active')}
              className={`neo-btn ${activeTab === 'active' ? 'bg-neo-blue' : 'bg-neo-gray'}`}
              style={{ 
                backgroundColor: activeTab === 'active' ? '#0066FF' : '#666666',
                color: activeTab === 'active' ? 'black' : 'white',
                borderBottom: activeTab === 'active' ? '4px solid #0066FF' : 'none'
              }}
            >
              Active Classes
            </button>
            <button
              onClick={() => filterClasses('past')}
              className={`neo-btn ${activeTab === 'past' ? 'bg-neo-blue' : 'bg-neo-gray'}`}
              style={{ 
                backgroundColor: activeTab === 'past' ? '#0066FF' : '#666666',
                color: activeTab === 'past' ? 'black' : 'white',
                borderBottom: activeTab === 'past' ? '4px solid #0066FF' : 'none'
              }}
            >
              Past Classes
            </button>
          </div>
        </div>

        {/* Classes Grid */}
        {getFilteredClasses().length === 0 ? (
          <div className="neo-card neo-p-8 neo-text-center bg-neo-white">
            <p className="neo-text-xl neo-font-bold neo-mb-4">
              {activeTab === 'active' ? 'No active classes. Create your first class to get started!' : 'No past classes yet.'}
            </p>
            {activeTab === 'active' && <div className="neo-text-4xl">↑</div>}
          </div>
        ) : (
          <div className="neo-grid neo-grid-3">
            {getFilteredClasses().map((classItem) => (
              <div key={classItem.id} className="neo-card neo-p-6 bg-neo-white">
                <div className="neo-flex-between neo-mb-4">
                  <h4 className="neo-text-2xl neo-font-black">{classItem.name}</h4>
                  {getStatusBadge(classItem.status)}
                </div>

                <div className="neo-mb-4" style={{ lineHeight: '1.6' }}>
                  <p style={{ margin: '4px 0' }}>
                    <span className="neo-font-bold">Code:</span>{' '}
                    <span className="neo-card-sm neo-p-2 bg-neo-yellow neo-font-black" style={{ padding: '4px 8px' }}>
                      {classItem.code}
                    </span>
                  </p>

                  <p style={{ margin: '4px 0' }}>
                    <span className="neo-font-bold">{classItem.createdAt} • {classItem.students} students</span>
                  </p>

                  <p style={{ margin: '4px 0' }}>
                    <span className="neo-font-bold">{classItem.questions} questions</span>
                  </p>
                </div>

                <div className="neo-flex neo-gap-2">
                  <button
                    onClick={() => onEnterClass(classItem.code)}
                    className="neo-btn neo-w-full"
                    style={{ backgroundColor: '#666666', color: 'white' }}
                  >
                    Manage
                  </button>
                  <button
                    onClick={() => exportClassData(classItem)}
                    className="neo-btn"
                    style={{ backgroundColor: 'transparent', border: '2px solid #666666', color: '#666666' }}
                  >
                    Export Data
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Class Modal */}
      {showCreateModal && (
        <div 
          className="neo-modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div 
            className="neo-card neo-p-6 bg-neo-white"
            style={{ maxWidth: '500px', width: '90%' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="neo-text-2xl neo-font-black neo-mb-4">Create New Class</h3>
            
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Class Name"
              className="neo-input neo-mb-4"
              style={{ textTransform: 'none' }}
              autoFocus
            />
            
            <div className="neo-flex neo-gap-4">
              <button
                onClick={createNewClass}
                className="neo-btn neo-w-full"
                style={{ backgroundColor: '#0066FF', color: 'black' }}
              >
                Create Class
              </button>
              <button
                onClick={closeModal}
                className="neo-btn neo-w-full"
                style={{ backgroundColor: '#666666', color: 'white' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard; 