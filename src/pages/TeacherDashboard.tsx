import React, { useState } from 'react';

interface Class {
  id: string;
  name: string;
  code: string;
  students: number;
  lastActive: string;
  questions: number;
  avgRate: number;
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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [className, setClassName] = useState('');
  const [classes, setClasses] = useState<Class[]>([
    {
      id: '1',
      name: 'MATH 101',
      code: 'ABC123',
      students: 25,
      lastActive: '2 hours ago',
      questions: 15,
      avgRate: 85,
    },
    {
      id: '2',
      name: 'SCIENCE 202',
      code: 'XYZ789',
      students: 30,
      lastActive: 'Yesterday',
      questions: 8,
      avgRate: 72,
    },
  ]);

  const generateClassCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateClass = () => {
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
      avgRate: 0,
    };

    setClasses([newClass, ...classes]);
    setClassName('');
    setShowCreateForm(false);
    alert(`Class "${newClass.name}" created with code: ${newClass.code}`);
  };

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('Class code copied to clipboard!');
  };

  const deleteClass = (classId: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter(c => c.id !== classId));
    }
  };

  return (
    <div className="neo-page">
      {/* Header */}
      <header className="neo-header">
        <h2 className="neo-text-2xl neo-font-black">TEACHER: {teacherId}</h2>
        <button onClick={onLogout} className="neo-btn bg-neo-red">
          LOGOUT
        </button>
      </header>

      <div className="neo-max-w-6xl" style={{ margin: '0 auto' }}>
        {/* Create Class Section */}
        <div className="neo-mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="neo-btn-lg bg-neo-green neo-w-full"
            style={{ maxWidth: '400px' }}
          >
            + CREATE NEW CLASS
          </button>

          {showCreateForm && (
            <div className="neo-card neo-p-4 neo-mt-4 bg-neo-white">
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="CLASS NAME"
                className="neo-input bg-neo-yellow neo-mb-4"
              />
              <div className="neo-flex neo-gap-4">
                <button
                  onClick={handleCreateClass}
                  className="neo-btn bg-neo-green"
                >
                  CREATE
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="neo-btn bg-neo-gray"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Classes List */}
        <h3 className="neo-text-4xl neo-font-black neo-mb-4">MY CLASSES</h3>

        {classes.length === 0 ? (
          <div className="neo-card neo-p-8 neo-text-center bg-neo-white">
            <p className="neo-text-xl neo-font-bold neo-mb-4">
              No classes yet. Create your first class to get started!
            </p>
            <div className="neo-text-4xl">↑</div>
          </div>
        ) : (
          <div className="neo-grid neo-grid-3">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className="neo-card neo-p-6 bg-neo-pink"
                style={{ position: 'relative' }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  deleteClass(classItem.id);
                }}
              >
                <h4 className="neo-text-2xl neo-font-black neo-mb-2">{classItem.name}</h4>

                <div className="neo-mb-4" style={{ lineHeight: '1.6' }}>
                  <div className="neo-flex neo-gap-2" style={{ alignItems: 'center', marginBottom: '4px' }}>
                    <span className="neo-font-bold">CODE:</span>
                    <span className="neo-card-sm neo-p-2 bg-neo-white neo-font-black" style={{ padding: '4px 8px' }}>
                      {classItem.code}
                    </span>
                    <button
                      onClick={() => copyClassCode(classItem.code)}
                      className="neo-btn-sm bg-neo-blue"
                    >
                      COPY
                    </button>
                  </div>

                  <p style={{ margin: '4px 0' }}>
                    <span className="neo-font-bold">STUDENTS:</span>{' '}
                    <span className="neo-font-black">{classItem.students}</span>
                  </p>

                  <p style={{ margin: '4px 0' }}>
                    <span className="neo-font-bold">LAST ACTIVE:</span>{' '}
                    <span className="neo-font-black">{classItem.lastActive}</span>
                  </p>

                  <p style={{ margin: '4px 0' }}>
                    <span className="neo-font-bold">QUESTIONS:</span>{' '}
                    <span className="neo-font-black">{classItem.questions}</span>
                  </p>

                  <p style={{ margin: '4px 0' }}>
                    <span className="neo-font-bold">AVG RATE:</span>{' '}
                    <span className={`neo-font-black ${classItem.avgRate >= 80 ? 'text-green-600' : classItem.avgRate >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {classItem.avgRate}%
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => onEnterClass(classItem.code)}
                  className="neo-btn bg-neo-blue neo-w-full"
                >
                  ENTER CLASS
                </button>

                <button
                  onClick={() => deleteClass(classItem.id)}
                  className="neo-btn-sm bg-neo-red"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '32px',
                    height: '32px',
                    padding: '0',
                    minHeight: '32px'
                  }}
                  title="Delete class"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard; 