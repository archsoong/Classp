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
          <button onClick={onBack} className="neo-btn bg-neo-white">
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
          <div className="neo-card neo-p-6 bg-neo-cyan">
            <div className="neo-flex-between neo-mb-4">
              <h3 className="neo-text-2xl neo-font-black">CREATE QUESTION</h3>
              <div className="neo-flex neo-gap-2">
                <button
                  onClick={() => setShowHistory(false)}
                  className={`neo-btn ${!showHistory ? 'bg-neo-yellow' : 'bg-neo-gray'}`}
                >
                  CREATE
                </button>
                <button
                  onClick={() => setShowHistory(true)}
                  className={`neo-btn ${showHistory ? 'bg-neo-yellow' : 'bg-neo-gray'}`}
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
                  className="neo-input neo-textarea bg-neo-white neo-mb-4"
                />

                <div className="neo-flex neo-gap-4 neo-mb-4">
                  <button
                    onClick={() => setQuestionType('mc')}
                    className={`neo-btn neo-w-full ${questionType === 'mc' ? 'bg-neo-yellow' : 'bg-neo-gray'}`}
                  >
                    [MC]
                  </button>
                  <button
                    onClick={() => setQuestionType('text')}
                    className={`neo-btn neo-w-full ${questionType === 'text' ? 'bg-neo-yellow' : 'bg-neo-gray'}`}
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
                        className="neo-input bg-neo-white"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="neo-mb-4">
                    <div className="neo-card neo-p-4 bg-neo-white neo-text-center neo-font-bold">
                      STUDENTS WILL TYPE THEIR ANSWER
                    </div>
                  </div>
                )}

                <button
                  onClick={publishQuestion}
                  className={`neo-btn-lg neo-w-full ${activeQuestion ? 'bg-neo-gray' : 'bg-neo-green'}`}
                  disabled={!!activeQuestion}
                >
                  {activeQuestion ? 'QUESTION ACTIVE' : 'PUBLISH QUESTION'}
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {questionHistory.map((question) => (
                  <div key={question.id} className="neo-card neo-p-4 bg-neo-white">
                    <div className="neo-flex-between">
                      <span className="neo-font-bold">
                        Q{questionHistory.indexOf(question) + 1}: {question.text}
                      </span>
                      <div className="neo-flex neo-gap-2" style={{ fontSize: '14px' }}>
                        <span className="neo-font-bold">
                          {question.responses}/{question.totalStudents}
                        </span>
                        <span>{question.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Status Panel */}
          {activeQuestion && (
            <div className="neo-card neo-p-6 bg-neo-purple">
              <h3 className="neo-text-2xl neo-font-black neo-mb-4">LIVE STATUS</h3>

              <p className="neo-font-bold neo-mb-2">QUESTION: {activeQuestion.text}</p>

              <div className="neo-mb-4">
                <p className="neo-font-bold neo-mb-2">
                  RESPONSES: {activeQuestion.responses}/{activeQuestion.totalStudents} ({getResponsePercentage()}%)
                </p>
                <div className="neo-progress">
                  <div
                    className="neo-progress-fill bg-neo-green"
                    style={{ width: `${getResponsePercentage()}%` }}
                  ></div>
                </div>
              </div>

              {activeQuestion.type === 'mc' && activeQuestion.options && (
                <div className="neo-mb-4" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeQuestion.options.map((option, index) => {
                    const count = activeQuestion.results[option] || 0;
                    const percentage = getResultPercentage(count);
                    return (
                      <div key={index} className="neo-flex" style={{ alignItems: 'center' }}>
                        <span className="neo-font-bold" style={{ width: '32px' }}>{option}:</span>
                        <div className="neo-progress" style={{ flex: 1, margin: '0 8px' }}>
                          <div
                            className="neo-progress-fill bg-neo-blue"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="neo-font-bold" style={{ width: '80px' }}>
                          {count} ({percentage}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="neo-flex neo-gap-4">
                <button
                  onClick={endQuestion}
                  className="neo-btn bg-neo-red neo-w-full"
                >
                  END QUESTION
                </button>
                <button className="neo-btn bg-neo-yellow neo-w-full">
                  SHOW TO STUDENTS
                </button>
              </div>
            </div>
          )}

          {/* Previous Questions (when no active question) */}
          {!activeQuestion && !showHistory && (
            <div className="neo-card neo-p-6 bg-neo-gray">
              <h3 className="neo-text-2xl neo-font-black neo-mb-4">PREVIOUS QUESTIONS</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {questionHistory.slice(0, 3).map((question, index) => (
                  <div key={question.id} className="neo-card neo-p-4 bg-neo-white">
                    <div className="neo-flex-between">
                      <span className="neo-font-bold">
                        Q{index + 1}: {question.text}
                      </span>
                      <div className="neo-flex neo-gap-2" style={{ fontSize: '14px' }}>
                        <span className="neo-font-bold">
                          {question.responses}/{question.totalStudents}
                        </span>
                        <span>{question.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherClassroom; 