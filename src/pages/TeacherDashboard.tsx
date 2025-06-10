import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation(); // Add i18n translation hook
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
      createdAt: new Date().toISOString().split('T')[0] || '',
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
    link.download = `${classItem.name}_${classItem.code}_export.json`;
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
      preparing: { text: 'Preparing', className: 'neo-status-inactive' },
      active: { text: 'Active', className: 'neo-status-active' },
      ended: { text: 'Ended', className: 'neo-status-inactive' },
    };
    
    const config = statusConfig[status];
    return (
      <span 
        className={`neo-card-sm neo-p-2 neo-font-black neo-status-badge ${config.className}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="neo-page">
      <div className="neo-max-w-6xl neo-container-centered">
        {/* Create Class Button */}
        <div className="neo-mb-6">
          <button
            onClick={showCreateClassModal}
            className="neo-btn neo-btn-lg neo-btn-create-manage"
          >
            + CREATE NEW CLASS
          </button>
        </div>

        {/* Tab Group */}
        <div className="neo-mb-6">
          <div className="neo-flex neo-gap-4">
            <button
              onClick={() => filterClasses('active')}
              className={`neo-btn ${activeTab === 'active' ? 'neo-btn-primary' : 'neo-btn-muted'}`}
            >
              Active Classes
            </button>
            <button
              onClick={() => filterClasses('past')}
              className={`neo-btn ${activeTab === 'past' ? 'neo-btn-primary' : 'neo-btn-muted'}`}
            >
              Past Classes
            </button>
          </div>
        </div>

        {/* Classes Grid */}
        {getFilteredClasses().length === 0 ? (
          <div className="neo-card neo-p-8 neo-text-center bg-neo-surface">
            <p className="neo-text-xl neo-font-bold neo-mb-4">
              {activeTab === 'active' ? 'No active classes. Create your first class to get started!' : 'No past classes yet.'}
            </p>
            {activeTab === 'active' && <div className="neo-text-4xl">↑</div>}
          </div>
        ) : (
          <div className="neo-grid neo-grid-3">
            {getFilteredClasses().map((classItem) => (
              <div key={classItem.id} className="neo-card neo-p-6 bg-neo-surface neo-card-relative">
                {/* Status badge in top right corner */}
                <div className="neo-badge-absolute">
                  {getStatusBadge(classItem.status)}
                </div>

                {/* Class name */}
                <div className="neo-mb-4">
                  <h4 className="neo-text-2xl neo-font-black neo-class-title">{classItem.name}</h4>
                </div>

                <div className="neo-mb-4 neo-class-info">
                  <p className="neo-class-info-item">
                    <span className="neo-font-bold">Code:</span>{' '}
                    <span className="neo-card-sm neo-p-2 bg-neo-classroom-code neo-font-black neo-classroom-code-badge">
                      {classItem.code}
                    </span>
                  </p>

                  <p className="neo-class-info-item">
                    <span className="neo-font-bold">Date:</span> {classItem.createdAt} • <span className="neo-font-bold">{classItem.questions} questions</span> • <span className="neo-font-bold">Students:</span> {classItem.students}
                  </p>
                </div>

                <div className="neo-flex neo-gap-2">
                  {classItem.status !== 'ended' && (
                    <button
                      onClick={() => onEnterClass(classItem.code)}
                      className="neo-btn neo-btn-create-manage neo-w-full"
                    >
                      Manage
                    </button>
                  )}
                  <button
                    onClick={() => exportClassData(classItem)}
                    className={`neo-btn neo-btn-export ${classItem.status === 'ended' ? 'neo-w-full' : ''}`}
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
          onClick={closeModal}
        >
          <div 
            className="neo-card neo-p-6 bg-neo-surface neo-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="neo-text-2xl neo-font-black neo-mb-4">Create New Class</h3>
            
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="Class Name"
              className="neo-input neo-mb-4 bg-neo-accent1 neo-input-no-transform"
              autoFocus
            />
            
            <div className="neo-flex neo-gap-4">
              <button
                onClick={createNewClass}
                className="neo-btn neo-btn-primary neo-w-full"
              >
                Create Class
              </button>
              <button
                onClick={closeModal}
                className="neo-btn neo-btn-muted neo-w-full"
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