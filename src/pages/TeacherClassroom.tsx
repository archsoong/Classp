import React, { useState, useEffect } from 'react';

interface Question {
  id: string;
  text: string;
  type: 'mc' | 'text';
  options?: string[];
  responses: number;
  totalStudents: number;
  results: { [key: string]: number };
  timestamp: string;
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
  const [activeStudents] = useState(15);
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState<'mc' | 'text'>('mc');
  const [options, setOptions] = useState(['', '', '', '']);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [questionHistory, setQuestionHistory] = useState<Question[]>([
    {
      id: '1',
      text: 'What is 2+2?',
      type: 'mc',
      options: ['2', '3', '4', '5'],
      responses: 15,
      totalStudents: 15,
      results: { '4': 10, '3': 1, '2': 1, '5': 0 },
      timestamp: '2 min ago',
    },
    {
      id: '2',
      text: 'Capital of France?',
      type: 'text',
      responses: 14,
      totalStudents: 15,
      results: { 'Paris': 12, 'London': 1, 'Berlin': 1 },
      timestamp: '5 min ago',
    },
  ]);
  const [showHistory, setShowHistory] = useState(false);

  // Simulate real-time updates for active question
  useEffect(() => {
    if (activeQuestion) {
      const interval = setInterval(() => {
        setActiveQuestion(prev => {
          if (!prev) return null;
          const newResponses = Math.min(prev.responses + Math.floor(Math.random() * 2), prev.totalStudents);
          return { ...prev, responses: newResponses };
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [activeQuestion]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const publishQuestion = () => {
    if (!questionText.trim()) {
      alert('Please enter a question');
      return;
    }

    if (questionType === 'mc' && options.filter(opt => opt.trim()).length < 2) {
      alert('Please provide at least 2 options for multiple choice');
      return;
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      text: questionText,
      type: questionType,
      options: questionType === 'mc' ? options.filter(opt => opt.trim()) : undefined,
      responses: 0,
      totalStudents: activeStudents,
      results: {},
      timestamp: 'Just now',
    };

    setActiveQuestion(newQuestion);
    setQuestionText('');
    setOptions(['', '', '', '']);
    alert('Question published to students!');
  };

  const endQuestion = () => {
    if (activeQuestion) {
      setQuestionHistory([activeQuestion, ...questionHistory]);
      setActiveQuestion(null);
    }
  };

  const getResponsePercentage = () => {
    if (!activeQuestion) return 0;
    return Math.round((activeQuestion.responses / activeQuestion.totalStudents) * 100);
  };

  const getResultPercentage = (count: number) => {
    if (!activeQuestion || activeQuestion.responses === 0) return 0;
    return Math.round((count / activeQuestion.responses) * 100);
  };

  return (
    <div className="neo-page">
      {/* Header */}
      <header className="neo-header">
        <div className="neo-flex" style={{ alignItems: 'center' }}>
          <button onClick={onBack} className="neo-btn neo-btn-muted">
            ← BACK
          </button>
          <h2 className="neo-text-2xl neo-font-black">
            {className} ({classCode})
          </h2>
        </div>
        <div className="neo-status">
          <div className="neo-status-dot neo-status-online"></div>
          <span className="neo-font-black">{activeStudents} ACTIVE</span>
        </div>
      </header>

      <div className="neo-max-w-6xl" style={{ margin: '0 auto' }}>
        <div className="neo-grid neo-grid-1" style={{ gap: '24px' }}>
          {/* Question Creation Panel */}
          <div className="neo-card neo-p-6 bg-neo-light-blue">
            <div className="neo-flex-between neo-mb-4">
              <h3 className="neo-text-2xl neo-font-black">CREATE QUESTION</h3>
              <div className="neo-flex neo-gap-2">
                <button
                  onClick={() => setShowHistory(false)}
                  className={`neo-btn ${!showHistory ? 'neo-btn-primary' : 'neo-btn-muted'}`}
                >
                  CREATE
                </button>
                <button
                  onClick={() => setShowHistory(true)}
                  className={`neo-btn ${showHistory ? 'neo-btn-primary' : 'neo-btn-muted'}`}
                >
                  HISTORY
                </button>
              </div>
            </div>

            {!showHistory ? (
              <>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="TYPE YOUR QUESTION HERE..."
                  className="neo-input neo-textarea bg-neo-surface neo-mb-4"
                />

                <div className="neo-flex neo-gap-4 neo-mb-4">
                  <button
                    onClick={() => setQuestionType('mc')}
                    className={`neo-btn neo-w-full ${questionType === 'mc' ? 'neo-btn-secondary' : 'neo-btn-muted'}`}
                  >
                    [MC]
                  </button>
                  <button
                    onClick={() => setQuestionType('text')}
                    className={`neo-btn neo-w-full ${questionType === 'text' ? 'neo-btn-secondary' : 'neo-btn-muted'}`}
                  >
                    [TEXT]
                  </button>
                </div>

                {questionType === 'mc' ? (
                  <div className="neo-mb-4" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {options.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`OPTION ${String.fromCharCode(65 + index)}`}
                        className="neo-input bg-neo-accent1"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="neo-mb-4">
                    <div className="neo-card neo-p-4 bg-neo-accent2 neo-text-center neo-font-bold">
                      STUDENTS WILL TYPE THEIR ANSWER
                    </div>
                  </div>
                )}

                <button
                  onClick={publishQuestion}
                  className="neo-btn-lg neo-btn-success neo-w-full"
                >
                  PUBLISH QUESTION
                </button>
              </>
            ) : (
              <div className="neo-mb-4">
                <h4 className="neo-text-xl neo-font-black neo-mb-4">QUESTION HISTORY</h4>
                {questionHistory.length === 0 ? (
                  <div className="neo-card neo-p-4 bg-neo-surface neo-text-center">
                    <p className="neo-font-bold">No questions published yet</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {questionHistory.map((question, index) => (
                      <div key={question.id} className="neo-card neo-p-4 bg-neo-surface">
                        <div className="neo-flex-between neo-mb-2">
                          <span className="neo-font-bold">Q{questionHistory.length - index}: {question.text}</span>
                          <span className="neo-card-sm neo-p-2 bg-neo-info" style={{ padding: '4px 8px' }}>
                            {question.type === 'mc' ? 'MC' : 'TEXT'}
                          </span>
                        </div>
                        <div className="neo-flex-between">
                          <span>Responses: {question.responses}/{question.totalStudents}</span>
                          <span>{question.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Question Display */}
          {activeQuestion && (
            <div className="neo-card neo-p-6 bg-neo-accent1">
              <div className="neo-flex-between neo-mb-4">
                <h3 className="neo-text-2xl neo-font-black">ACTIVE QUESTION</h3>
                <button
                  onClick={endQuestion}
                  className="neo-btn neo-btn-error"
                >
                  END QUESTION
                </button>
              </div>

              <div className="neo-card neo-p-4 bg-neo-surface neo-mb-4">
                <p className="neo-text-xl neo-font-bold neo-mb-4">{activeQuestion.text}</p>
                
                {activeQuestion.type === 'mc' && activeQuestion.options && (
                  <div className="neo-mb-4">
                    <h4 className="neo-font-bold neo-mb-2">OPTIONS:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                  <span className="neo-font-bold">RESPONSES</span>
                  <span className="neo-font-bold">{activeQuestion.responses}/{activeQuestion.totalStudents} ({getResponsePercentage()}%)</span>
                </div>
                <div className="neo-progress">
                  <div 
                    className="neo-progress-fill" 
                    style={{ width: `${getResponsePercentage()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Results Display */}
          {!activeQuestion && questionHistory.length > 0 && (
            <div className="neo-card neo-p-6 bg-neo-light-green">
              <h3 className="neo-text-2xl neo-font-black neo-mb-4">LATEST RESULTS</h3>
              
              {(() => {
                const latestQuestion = questionHistory[0];
                if (!latestQuestion) return null;
                
                return (
                  <div className="neo-card neo-p-4 bg-neo-surface">
                    <h4 className="neo-font-bold neo-mb-4">{latestQuestion.text}</h4>
                    
                    {latestQuestion.type === 'mc' ? (
                      <div>
                        {latestQuestion.options?.map((option, index) => {
                          const count = latestQuestion.results[option] || 0;
                          const percentage = getResultPercentage(count);
                          
                          return (
                            <div key={index} className="neo-mb-4">
                              <div className="neo-flex-between neo-mb-2">
                                <span className="neo-font-bold">{String.fromCharCode(65 + index)}. {option}</span>
                                <span className="neo-font-bold">{count} votes ({percentage}%)</span>
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
                        <h5 className="neo-font-bold neo-mb-2">ANSWERS:</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {Object.entries(latestQuestion.results).map(([answer, count], index) => (
                            <div key={index} className="neo-card-sm neo-p-2 bg-neo-light-purple">
                              <span className="neo-font-bold">"{answer}" - {count} students</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="neo-text-center neo-mt-4 neo-card-sm neo-p-2 bg-neo-warning">
                      <span className="neo-font-bold">Total Responses: {latestQuestion.responses}/{latestQuestion.totalStudents}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* No Active Question State */}
          {!activeQuestion && questionHistory.length === 0 && (
            <div className="neo-card neo-p-8 neo-text-center bg-neo-muted">
              <h3 className="neo-text-3xl neo-font-black neo-mb-4">NO ACTIVE QUESTION</h3>
              <p className="neo-text-xl neo-font-bold neo-mb-4">
                Create and publish a question to start collecting responses from students.
              </p>
              <div className="neo-text-4xl">↑</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherClassroom; 