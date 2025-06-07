import React, { useState, useEffect } from 'react';

interface Question {
  id: string;
  text: string;
  type: 'mc' | 'text';
  options?: string[];
  questionNumber: number;
}

interface PreviousQuestion {
  id: string;
  text: string;
  yourAnswer: string;
  timestamp: string;
}

interface StudentClassroomProps {
  classCode: string;
  className: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  onLeave: () => void;
}

type StudentState = 'waiting' | 'answering' | 'results';

const StudentClassroom: React.FC<StudentClassroomProps> = ({
  classCode,
  className,
  teacherName,
  studentId,
  studentName,
  onLeave,
}) => {
  const [state, setState] = useState<StudentState>('waiting');
  const [connectedStudents] = useState(15);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [results, setResults] = useState<{ [key: string]: { count: number; percentage: number } }>({});
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [previousQuestions, setPreviousQuestions] = useState<PreviousQuestion[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  // Simulate receiving questions from teacher
  useEffect(() => {
    const simulateQuestion = () => {
      const sampleQuestions = [
        {
          id: '1',
          text: 'What is 2+2?',
          type: 'mc' as const,
          options: ['2', '3', '4', '5'],
          questionNumber: 1,
        },
        {
          id: '2',
          text: 'What is the capital of France?',
          type: 'text' as const,
          questionNumber: 2,
        },
        {
          id: '3',
          text: 'Which planet is closest to the Sun?',
          type: 'mc' as const,
          options: ['Venus', 'Mercury', 'Earth', 'Mars'],
          questionNumber: 3,
        },
      ];

      const randomIndex = Math.floor(Math.random() * sampleQuestions.length);
      const randomQuestion = sampleQuestions[randomIndex];
      if (randomQuestion) {
        setCurrentQuestion(randomQuestion);
        setState('answering');
        setSelectedAnswer('');
        setTextAnswer('');
        setHasSubmitted(false);
      }
    };

    // Simulate receiving a question after 3 seconds if waiting
    if (state === 'waiting') {
      const timeout = setTimeout(simulateQuestion, 3000);
      return () => clearTimeout(timeout);
    }
  }, [state]);

  const submitAnswer = () => {
    if (!currentQuestion) return;

    const answer = currentQuestion.type === 'mc' ? selectedAnswer : textAnswer;
    if (!answer.trim()) {
      alert('Please select or enter an answer');
      return;
    }

    setUserAnswer(answer);
    setHasSubmitted(true);

    // Simulate processing and showing results after 2 seconds
    setTimeout(() => {
      // Simulate results data
      if (currentQuestion.type === 'mc') {
        const mockResults = {
          '4': { count: 10, percentage: 67 },
          '3': { count: 3, percentage: 20 },
          '2': { count: 1, percentage: 7 },
          '5': { count: 1, percentage: 7 },
        };
        setResults(mockResults);
        setIsCorrect(answer === '4'); // Assuming '4' is correct for demo
      } else {
        const mockResults = {
          'Paris': { count: 12, percentage: 80 },
          'London': { count: 2, percentage: 13 },
          'Berlin': { count: 1, percentage: 7 },
        };
        setResults(mockResults);
        setIsCorrect(answer.toLowerCase().includes('paris'));
      }

      setState('results');

      // Return to waiting after 5 seconds
      setTimeout(() => {
        // Add current question to previous questions
        if (currentQuestion) {
          const newPreviousQuestion: PreviousQuestion = {
            id: currentQuestion.id,
            text: currentQuestion.text,
            yourAnswer: answer,
            timestamp: new Date().toLocaleTimeString()
          };
          setPreviousQuestions(prev => [...prev, newPreviousQuestion]);
        }

        setState('waiting');
        setCurrentQuestion(null);
        setIsCorrect(null);
        setResults({});
        setUserAnswer('');
      }, 5000);
    }, 2000);
  };

  const updateAnswer = () => {
    if (!currentQuestion || !hasSubmitted) return;
    
    const answer = currentQuestion.type === 'mc' ? selectedAnswer : textAnswer;
    if (!answer.trim()) {
      alert('Please select or enter an answer');
      return;
    }

    setUserAnswer(answer);
    // In real app, this would send update to server
    alert('Answer updated!');
  };

  const renderHeader = () => (
    <div className="neo-mb-4 neo-card-sm neo-p-4 bg-neo-light-purple" style={{ border: '4px solid black', boxShadow: '4px 4px 0px 0px rgba(0, 0, 0, 1)' }}>
      <div className="neo-flex-between neo-mb-2">
        <span className="neo-font-bold" style={{ fontSize: '14px' }}>Class: {className}</span>
        <span className="neo-font-bold" style={{ fontSize: '14px' }}>Hi, {studentName}</span>
      </div>
      <div className="neo-flex-between">
        <span style={{ fontSize: '12px' }}>Code: {classCode}</span>
        <div className="neo-status">
          <div className={`neo-status-dot ${isConnected ? 'neo-status-online' : 'neo-status-offline'}`}></div>
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{isConnected ? '🟢 Connected' : '🔴 Disconnected'}</span>
        </div>
      </div>
    </div>
  );

  const renderWaitingState = () => (
    <div className="neo-container">
      <div className="neo-card neo-p-8 neo-max-w-md neo-w-full bg-neo-surface" style={{ maxWidth: '600px' }}>
        {renderHeader()}
        
        <div className="neo-text-center neo-mb-6">
          <div className="neo-pulse" style={{ fontSize: '80px', marginBottom: '16px' }}>⏳</div>
          <h2 className="neo-text-2xl neo-font-black neo-mb-4">Waiting for question...</h2>
          <p className="neo-font-bold">Your teacher will start soon</p>
        </div>

        <div className="neo-text-center neo-mb-6 neo-card-sm neo-p-4 bg-neo-info">
          <p className="neo-font-bold">{connectedStudents} students connected</p>
        </div>

        <button
          onClick={onLeave}
          className="neo-btn neo-btn-error neo-w-full"
        >
          Leave Class
        </button>
      </div>
    </div>
  );

  const renderQuestionState = () => {
    if (!currentQuestion) return null;

    return (
      <div className="neo-container">
        <div className="neo-card neo-p-8 neo-max-w-md neo-w-full bg-neo-surface" style={{ maxWidth: '600px' }}>
          {renderHeader()}
          
          <div className="neo-card neo-p-6 bg-neo-accent2 neo-mb-6">
            <div className="neo-mb-4">
              <h2 className="neo-text-2xl neo-font-black">Question {currentQuestion.questionNumber}</h2>
            </div>

            <p className="neo-text-xl neo-font-bold neo-mb-6">{currentQuestion.text}</p>

            {currentQuestion.type === 'mc' && currentQuestion.options ? (
              <div className="neo-radio-group neo-mb-6">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`neo-radio-option ${selectedAnswer === option ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      className="neo-radio-input"
                      disabled={hasSubmitted}
                    />
                    <span className="neo-font-bold">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="neo-mb-6">
                <textarea
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="neo-input neo-textarea bg-neo-light-mint"
                  disabled={hasSubmitted}
                  maxLength={200}
                  style={{ textTransform: 'none' }}
                />
                <div className="neo-text-center neo-mt-2" style={{ fontSize: '12px', fontWeight: 'bold' }}>
                  {textAnswer.length}/200
                </div>
              </div>
            )}

            <div className="neo-flex neo-gap-4">
              {!hasSubmitted ? (
                <button
                  onClick={submitAnswer}
                  className="neo-btn neo-btn-primary neo-w-full"
                >
                  Submit Answer
                </button>
              ) : (
                <>
                  <button
                    onClick={updateAnswer}
                    className="neo-btn neo-btn-warning neo-w-full"
                  >
                    Update Answer
                  </button>
                  <div className="neo-card-sm neo-p-2 bg-neo-success neo-font-black" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', color: 'white' }}>
                    ✓ Answer Submitted
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderResultsState = () => {
    if (!currentQuestion) return null;

    return (
      <div className="neo-container">
        <div className="neo-card neo-p-8 neo-max-w-md neo-w-full bg-neo-surface" style={{ maxWidth: '600px' }}>
          {renderHeader()}
          
          <div className="neo-card neo-p-6 bg-neo-light-blue neo-mb-6">
            <h2 className="neo-text-2xl neo-font-black neo-mb-4">Results</h2>

            {currentQuestion.type === 'mc' && currentQuestion.options ? (
              <div className="neo-mb-6">
                {currentQuestion.options.map((option, index) => {
                  const result = results[option] || { count: 0, percentage: 0 };
                  const isUserAnswer = userAnswer === option;
                  
                  return (
                    <div key={index} className="neo-mb-4">
                      <div className="neo-flex-between neo-mb-2">
                        <span className={`neo-font-bold ${isUserAnswer ? 'neo-text-xl' : ''}`}>
                          {option} {isUserAnswer ? '(Your answer)' : ''}
                        </span>
                        <span className="neo-font-bold">{result.count} votes ({result.percentage}%)</span>
                      </div>
                      <div className="neo-progress">
                        <div 
                          className="neo-progress-fill" 
                          style={{ 
                            width: `${result.percentage}%`,
                            backgroundColor: isUserAnswer ? '#9723C9' : '#B5D2AD'
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="neo-mb-6">
                <h3 className="neo-font-bold neo-mb-4">Anonymous Answers:</h3>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {Object.entries(results).map(([answer, data], index) => (
                    <div key={index} className={`neo-card-sm neo-p-4 neo-mb-2 ${answer === userAnswer ? 'bg-neo-primary' : 'bg-neo-muted'}`}>
                      <span className="neo-font-bold" style={{ color: answer === userAnswer ? 'white' : 'black' }}>
                        "{answer}" {answer === userAnswer ? '(Your answer)' : ''} - {data.count} students
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="neo-text-center neo-mb-4 neo-card-sm neo-p-4 bg-neo-accent1">
              <p className="neo-text-xl neo-font-black">{Object.values(results).reduce((sum, r) => sum + r.count, 0)} students responded</p>
              <p className="neo-font-bold">Waiting for next question...</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderErrorState = () => (
    <div className="neo-container">
      <div className="neo-card neo-p-8 neo-max-w-md neo-w-full bg-neo-surface" style={{ maxWidth: '600px' }}>
        {renderHeader()}
        
        <div className="neo-text-center neo-mb-6">
          <div style={{ fontSize: '80px', marginBottom: '16px' }}>🔴</div>
          <h2 className="neo-text-2xl neo-font-black neo-mb-4">Connection Lost</h2>
          <p className="neo-font-bold">Unable to connect to the class</p>
        </div>

        <button
          onClick={() => setIsConnected(true)}
          className="neo-btn neo-btn-info neo-w-full"
        >
          Reconnect
        </button>
      </div>
    </div>
  );

  // Main render logic
  if (!isConnected) {
    return renderErrorState();
  }

  switch (state) {
    case 'waiting':
      return renderWaitingState();
    case 'answering':
      return renderQuestionState();
    case 'results':
      return renderResultsState();
    default:
      return renderWaitingState();
  }
};

export default StudentClassroom; 