import React, { useState, useEffect } from 'react';

// Enhanced interfaces to match the specification
interface Question {
  id: string;
  text: string;
  type: 'mc' | 'sa'; // Multiple Choice or Short Answer
  options?: string[];
  queue_order: number;
  status: 'draft' | 'published' | 'ended';
  published_at?: string;
  ended_at?: string;
  responses: number;
  totalStudents: number;
  results: { [key: string]: number };
}

interface Participant {
  student_id: string;
  student_name: string;
  joined_at: string;
  responses: { [question_id: string]: any };
}

interface ClassStatus {
  status: 'preparing' | 'active' | 'ended';
  started_at?: string;
  ended_at?: string;
}

interface TeacherClassroomProps {
  classCode: string;
  className: string;
  onBack: () => void;
}

const TeacherClassroom: React.FC<TeacherClassroomProps> = ({
  classCode,
  className,
  onBack,
}) => {
  // Class management state
  const [classStatus, setClassStatus] = useState<ClassStatus>({ status: 'preparing' });
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showParticipantList, setShowParticipantList] = useState(false);

  // Question management state
  const [questionQueue, setQuestionQueue] = useState<Question[]>([
    {
      id: '1',
      text: 'What is the capital of France?',
      type: 'mc',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      queue_order: 1,
      status: 'draft',
      responses: 0,
      totalStudents: 0,
      results: {}
    },
    {
      id: '2', 
      text: 'Explain the water cycle in your own words.',
      type: 'sa',
      queue_order: 2,
      status: 'draft',
      responses: 0,
      totalStudents: 0,
      results: {}
    }
  ]);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [questionHistory, setQuestionHistory] = useState<Question[]>([]);
  
  // Question form state
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<'mc' | 'sa'>('mc');
  const [options, setOptions] = useState(['', '']);

  // Results view state
  const [resultView, setResultView] = useState<'current' | 'history'>('current');

  // Real-time simulation
  useEffect(() => {
    if (activeQuestion && classStatus.status === 'active') {
      const interval = setInterval(() => {
        setActiveQuestion(prev => {
          if (!prev) return null;
          const newResponses = Math.min(prev.responses + Math.floor(Math.random() * 2), participants.length);
          return { ...prev, responses: newResponses };
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeQuestion, classStatus.status, participants.length]);

  // Class management functions
  const toggleClassStatus = () => {
    if (classStatus.status === 'preparing') {
      setClassStatus({ status: 'active', started_at: new Date().toISOString() });
    } else if (classStatus.status === 'active') {
      setClassStatus({ 
        ...classStatus, 
        status: 'ended', 
        ended_at: new Date().toISOString() 
      });
      if (activeQuestion) {
        endQuestion();
      }
    }
  };

  const copyJoinLink = () => {
    const link = `${window.location.origin}/join/${classCode}`;
    navigator.clipboard.writeText(link);
    alert('Join link copied to clipboard!');
  };

  const toggleParticipantList = () => {
    setShowParticipantList(!showParticipantList);
  };

  // Question management functions
  const showQuestionFormHandler = () => {
    setShowQuestionForm(true);
    setEditingQuestion(null);
    setQuestionText('');
    setQuestionType('mc');
    setOptions(['', '']);
  };

  const hideQuestionForm = () => {
    setShowQuestionForm(false);
    setEditingQuestion(null);
    setQuestionText('');
    setOptions(['', '']);
  };

  const editQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionText(question.text);
    setQuestionType(question.type);
    setOptions(question.options || ['', '']);
    setShowQuestionForm(true);
  };

  const saveToQueue = () => {
    if (!questionText.trim()) {
      alert('Please enter a question');
      return;
    }

    if (questionType === 'mc' && options.filter(opt => opt.trim()).length < 2) {
      alert('Please provide at least 2 options for multiple choice');
      return;
    }

    const questionData = {
      text: questionText,
      type: questionType,
      options: questionType === 'mc' ? options.filter(opt => opt.trim()) : undefined,
      status: 'draft' as const,
      responses: 0,
      totalStudents: 0,
      results: {}
    };

    if (editingQuestion) {
      // Update existing question
      setQuestionQueue(prev => prev.map(q => 
        q.id === editingQuestion.id 
          ? { ...q, ...questionData }
          : q
      ));
    } else {
      // Add new question
      const newQuestion: Question = {
        id: Date.now().toString(),
        queue_order: Math.max(...questionQueue.map(q => q.queue_order), 0) + 1,
        ...questionData
      };
      setQuestionQueue(prev => [...prev, newQuestion]);
    }

    hideQuestionForm();
  };

  const deleteQuestion = (questionId: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setQuestionQueue(prev => prev.filter(q => q.id !== questionId));
    }
  };

  const publishQuestion = (question: Question) => {
    if (classStatus.status !== 'active') {
      alert('Please start the class first before publishing questions');
      return;
    }

    if (activeQuestion) {
      alert('Please end the current question before publishing a new one');
      return;
    }

    const publishedQuestion = {
      ...question,
      status: 'published' as const,
      published_at: new Date().toISOString(),
      totalStudents: participants.length
    };

    setActiveQuestion(publishedQuestion);
    setQuestionQueue(prev => prev.filter(q => q.id !== question.id));
  };

  const endQuestion = () => {
    if (activeQuestion) {
      const endedQuestion = {
        ...activeQuestion,
        status: 'ended' as const,
        ended_at: new Date().toISOString()
      };
      setQuestionHistory(prev => [endedQuestion, ...prev]);
      setActiveQuestion(null);
    }
  };

  const reorderQueue = (dragIndex: number, hoverIndex: number) => {
    if (dragIndex < 0 || dragIndex >= questionQueue.length || hoverIndex < 0 || hoverIndex >= questionQueue.length) {
      return;
    }
    
    const draggedItem = questionQueue[dragIndex];
    if (!draggedItem) return;
    
    const newQueue = [...questionQueue];
    newQueue.splice(dragIndex, 1);
    newQueue.splice(hoverIndex, 0, draggedItem);
    
    // Update queue_order for all items
    const reorderedQueue = newQueue.map((item, index) => ({
      ...item,
      queue_order: index + 1
    }));
    
    setQuestionQueue(reorderedQueue);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Status indicator helpers
  const getStatusIndicator = () => {
    switch (classStatus.status) {
      case 'preparing': return '⚫ Preparing';
      case 'active': return '🟢 Active';
      case 'ended': return '🔴 Ended';
    }
  };

  const getStatusButtonText = () => {
    switch (classStatus.status) {
      case 'preparing': return 'Start Class';
      case 'active': return 'End Class';
      case 'ended': return 'Class Ended';
    }
  };

  return (
    <div className="neo-page">
      {/* Header Section */}
      <header className="neo-header" style={{ borderBottom: '4px solid black' }}>
        <div className="neo-flex" style={{ alignItems: 'center', gap: '16px' }}>
          <button onClick={onBack} className="neo-btn neo-btn-muted">
            ← BACK
          </button>
          <h1 className="neo-text-2xl neo-font-black">{className}</h1>
          <span 
            className="neo-card-sm neo-p-2 bg-neo-classroom-code neo-font-black"
            style={{ cursor: 'pointer' }}
            onClick={() => navigator.clipboard.writeText(classCode)}
            title="Click to copy class code"
          >
            Class Code: {classCode}
          </span>
          <span className="neo-font-black">{getStatusIndicator()}</span>
        </div>
        
        <div className="neo-flex" style={{ alignItems: 'center', gap: '12px' }}>
          <button
            onClick={toggleClassStatus}
            className={`neo-btn ${classStatus.status === 'preparing' ? 'neo-btn-success' : classStatus.status === 'active' ? 'neo-btn-error' : 'neo-btn-muted'}`}
            style={{ backgroundColor: '#90EE90', color: 'black' }}
            disabled={classStatus.status === 'ended'}
          >
            {getStatusButtonText()}
          </button>
          
          {classStatus.status === 'active' && (
            <button
              onClick={copyJoinLink}
              className="neo-btn neo-btn-secondary"
            >
              Copy Join Link
            </button>
          )}
          
          <div style={{ position: 'relative' }}>
            <button
              onClick={toggleParticipantList}
              className="neo-btn neo-btn-muted"
            >
              {participants.length} PARTICIPANTS {showParticipantList ? '▲' : '▼'}
            </button>
            
            {showParticipantList && (
              <div 
                className="neo-card bg-neo-surface"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '300px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 10,
                  marginTop: '8px'
                }}
              >
                <div className="neo-p-4">
                  <h4 className="neo-font-black neo-mb-2">Participants</h4>
                  {participants.length === 0 ? (
                    <p className="neo-text-center">No participants joined yet</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {participants.map(participant => (
                        <div key={participant.student_id} className="neo-card-sm neo-p-2 bg-neo-accent1">
                          <div className="neo-font-bold">{participant.student_name}</div>
                          <div style={{ fontSize: '12px' }}>
                            {participant.student_id} • Joined {participant.joined_at}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="neo-max-w-6xl" style={{ margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', minHeight: '600px' }}>
          
          {/* Question Queue Panel (Left Side) */}
          <div className="neo-card neo-p-6 bg-neo-light-blue" style={{ border: '4px solid black' }}>
            <div className="neo-flex-between neo-mb-4">
              <h2 className="neo-text-2xl neo-font-black">Question Queue</h2>
              <button
                onClick={showQuestionFormHandler}
                className="neo-btn neo-btn-primary"
                style={{ backgroundColor: '#69D2E7', color: 'black' }}
              >
                + Add Question
              </button>
            </div>

            {/* Question Queue List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {questionQueue
                .sort((a, b) => a.queue_order - b.queue_order)
                .map((question, index) => (
                <div 
                  key={question.id} 
                  className="neo-card neo-p-4"
                  style={{ cursor: 'grab', border: '2px solid #000', backgroundColor: '#FFFFFF' }}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    reorderQueue(dragIndex, index);
                  }}
                >
                  <div className="neo-flex-between neo-mb-2">
                    <div className="neo-flex" style={{ alignItems: 'center', gap: '8px' }}>
                      <span className="neo-font-bold">#{question.queue_order}</span>
                      <span style={{ fontSize: '14px', color: '#000' }}>
                        {question.type === 'mc' ? 'Multiple Choice' : 'Short Answer'}
                      </span>
                    </div>
                    <div className="neo-flex" style={{ gap: '8px' }}>
                      <button
                        onClick={() => editQuestion(question)}
                        className="neo-btn neo-btn-sm neo-btn-secondary"
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                      >
                        EDIT
                      </button>
                      <button
                        onClick={() => deleteQuestion(question.id)}
                        className="neo-btn neo-btn-sm neo-btn-error"
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                  <p className="neo-mb-2" style={{ fontSize: '14px' }}>
                    {question.text.length > 60 ? question.text.substring(0, 60) + '...' : question.text}
                  </p>
                  <button
                    onClick={() => publishQuestion(question)}
                    className="neo-btn neo-btn-success neo-w-full"
                    style={{ backgroundColor: '#90EE90', color: 'black' }}
                    disabled={classStatus.status !== 'active' || activeQuestion !== null}
                  >
                    Publish
                  </button>
                </div>
              ))}
            </div>

            {questionQueue.length === 0 && (
              <div className="neo-card neo-p-4 bg-neo-surface neo-text-center">
                <p className="neo-font-bold">No questions in queue</p>
                <p style={{ fontSize: '14px' }}>Add questions to get started</p>
              </div>
            )}

            {/* Question Creation Form */}
            {showQuestionForm && (
              <div className="neo-card neo-p-4 bg-neo-accent2" style={{ border: '2px solid black' }}>
                <h3 className="neo-font-black neo-mb-4">
                  {editingQuestion ? 'Edit Question' : 'Create Question'}
                </h3>
                
                <div className="neo-mb-4">
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value as 'mc' | 'sa')}
                    className="neo-input bg-neo-surface neo-mb-2"
                  >
                    <option value="mc">Multiple Choice</option>
                    <option value="sa">Short Answer</option>
                  </select>
                </div>

                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter your question..."
                  className="neo-input neo-textarea bg-neo-surface neo-mb-4"
                  rows={3}
                />

                {questionType === 'mc' && (
                  <div className="neo-mb-4">
                    <div className="neo-flex-between neo-mb-2">
                      <span className="neo-font-bold">Options:</span>
                      <div>
                        <button
                          onClick={addOption}
                          className="neo-btn-sm"
                          disabled={options.length >= 6}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {options.map((option, index) => (
                      <div key={index} className="neo-flex neo-mb-2" style={{ gap: '8px' }}>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          className="neo-input bg-neo-surface"
                          style={{ flex: 1 }}
                        />
                        {options.length > 2 && (
                          <button
                            onClick={() => removeOption(index)}
                            className="neo-btn-sm neo-btn-error"
                          >
                            -
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="neo-flex neo-gap-2">
                  <button
                    onClick={saveToQueue}
                    className="neo-btn neo-btn-primary neo-w-full"
                  >
                    {editingQuestion ? 'Update Question' : 'Add to Queue'}
                  </button>
                  <button
                    onClick={hideQuestionForm}
                    className="neo-btn neo-btn-muted neo-w-full"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Active Question Display / Results Display (Center) */}
          <div>
            {activeQuestion ? (
              /* Active Question Display */
              <div className="neo-card neo-p-6 bg-neo-accent1" style={{ border: '4px solid black', backgroundColor: '#FFD700' }}>
                <div className="neo-flex-between neo-mb-4">
                  <h2 className="neo-text-2xl neo-font-black">Active Question</h2>
                  <button
                    onClick={endQuestion}
                    className="neo-btn neo-btn-error"
                  >
                    End Question
                  </button>
                </div>

                <div className="neo-card neo-p-4 bg-neo-surface neo-mb-4">
                  <div className="neo-flex-between neo-mb-2">
                    <span className="neo-card-sm neo-p-2 bg-neo-info">
                      {activeQuestion.type === 'mc' ? 'Multiple Choice' : 'Short Answer'}
                    </span>
                    <div className="neo-text-center">
                      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        {Math.floor((Date.now() - new Date(activeQuestion.published_at || Date.now()).getTime()) / 1000)}s
                      </div>
                      <div style={{ fontSize: '12px' }}>elapsed</div>
                    </div>
                  </div>
                  
                  <h3 className="neo-text-xl neo-font-bold neo-mb-4">{activeQuestion.text}</h3>
                  
                  {activeQuestion.type === 'mc' && activeQuestion.options && (
                    <div className="neo-mb-4">
                      <h4 className="neo-font-bold neo-mb-2">Options:</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {activeQuestion.options.map((option, index) => (
                          <div key={index} className="neo-card-sm neo-p-2 bg-neo-light-purple">
                            <span className="neo-font-bold">{String.fromCharCode(65 + index)}. {option}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="neo-card neo-p-4 bg-neo-info">
                  <div className="neo-flex-between neo-mb-2">
                    <span className="neo-font-bold">Response Progress</span>
                    <span className="neo-font-bold">
                      {activeQuestion.responses}/{activeQuestion.totalStudents} 
                      ({Math.round((activeQuestion.responses / Math.max(activeQuestion.totalStudents, 1)) * 100)}%)
                    </span>
                  </div>
                  <div className="neo-progress">
                    <div 
                      className="neo-progress-fill" 
                      style={{ 
                        width: `${(activeQuestion.responses / Math.max(activeQuestion.totalStudents, 1)) * 100}%`,
                        transition: 'width 0.3s ease'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              /* Results Display */
              <div className="neo-card neo-p-6 bg-neo-light-green" style={{ border: '4px solid black' }}>
                <div className="neo-flex-between neo-mb-4">
                  <h2 className="neo-text-2xl neo-font-black">Results</h2>
                  <div className="neo-flex neo-gap-2">
                    <button
                      onClick={() => setResultView('current')}
                      className={`neo-btn ${resultView === 'current' ? 'neo-btn-primary' : 'neo-btn-muted'}`}
                    >
                      Current
                    </button>
                    <button
                      onClick={() => setResultView('history')}
                      className={`neo-btn ${resultView === 'history' ? 'neo-btn-primary' : 'neo-btn-muted'}`}
                    >
                      History
                    </button>
                  </div>
                </div>

                                 {resultView === 'current' && questionHistory.length > 0 ? (
                   /* Current Results */
                   (() => {
                     const latestQuestion = questionHistory[0];
                     if (!latestQuestion) return null;
                     
                     return (
                       <div className="neo-card neo-p-4 bg-neo-surface">
                         <h3 className="neo-font-bold neo-mb-4">{latestQuestion.text}</h3>
                         
                         {latestQuestion.type === 'mc' ? (
                           <div>
                             {latestQuestion.options?.map((option, index) => {
                               const count = latestQuestion.results[option] || 0;
                               const percentage = latestQuestion.responses > 0 
                                 ? Math.round((count / latestQuestion.responses) * 100) 
                                 : 0;
                               
                               return (
                                 <div key={index} className="neo-mb-4">
                                   <div className="neo-flex-between neo-mb-2">
                                     <span className="neo-font-bold">
                                       {String.fromCharCode(65 + index)}. {option}
                                     </span>
                                     <span className="neo-font-bold">{count} ({percentage}%)</span>
                                   </div>
                                   <div className="neo-progress">
                                     <div 
                                       className="neo-progress-fill" 
                                       style={{ width: `${percentage}%` }}
                                     ></div>
                                   </div>
                                 </div>
                               );
                             })}
                           </div>
                         ) : (
                           <div>
                             <h4 className="neo-font-bold neo-mb-2">Answers:</h4>
                             <div 
                               style={{ 
                                 maxHeight: '300px', 
                                 overflowY: 'auto',
                                 display: 'flex',
                                 flexDirection: 'column',
                                 gap: '8px'
                               }}
                             >
                               {Object.entries(latestQuestion.results).map(([answer, count], index) => (
                                 <div key={index} className="neo-card-sm neo-p-2 bg-neo-light-purple">
                                   <span>"{answer}"</span>
                                   {count > 1 && <span className="neo-font-bold"> (×{count})</span>}
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}
                         
                         <div className="neo-card-sm neo-p-2 bg-neo-warning neo-text-center neo-mt-4">
                           <span className="neo-font-bold">
                             Total Responses: {latestQuestion.responses}/{latestQuestion.totalStudents}
                           </span>
                           <br />
                           <span>
                             Response Rate: {Math.round((latestQuestion.responses / Math.max(latestQuestion.totalStudents, 1)) * 100)}%
                           </span>
                         </div>
                       </div>
                     );
                   })()
                ) : resultView === 'history' ? (
                  /* History Results */
                  <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {questionHistory.length === 0 ? (
                      <div className="neo-card neo-p-4 bg-neo-surface neo-text-center">
                        <p className="neo-font-bold">No questions completed yet</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {questionHistory.map((question, index) => (
                          <div key={question.id} className="neo-card neo-p-4 bg-neo-surface">
                            <div className="neo-flex-between neo-mb-2">
                              <h4 className="neo-font-bold">Q{questionHistory.length - index}: {question.text}</h4>
                              <span className="neo-card-sm neo-p-1 bg-neo-info">
                                {question.type === 'mc' ? 'MC' : 'SA'}
                              </span>
                            </div>
                            <div className="neo-flex-between">
                              <span>Responses: {question.responses}/{question.totalStudents}</span>
                              <span>
                                Rate: {Math.round((question.responses / Math.max(question.totalStudents, 1)) * 100)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* No Results State */
                  <div className="neo-card neo-p-8 neo-text-center bg-neo-surface">
                    <h3 className="neo-text-xl neo-font-black neo-mb-4">No Results Yet</h3>
                    <p className="neo-font-bold neo-mb-4">
                      Publish and complete questions to see results here.
                    </p>
                    <div className="neo-text-4xl">📊</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherClassroom; 