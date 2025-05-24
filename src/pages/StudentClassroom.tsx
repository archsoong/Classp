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
  onLeave: () => void;
}

type StudentState = 'waiting' | 'answering' | 'results';

const StudentClassroom: React.FC<StudentClassroomProps> = ({
  classCode,
  className,
  teacherName,
  studentId,
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

      const randomQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
      setCurrentQuestion(randomQuestion);
      setState('answering');
      setSelectedAnswer('');
      setTextAnswer('');
      setHasSubmitted(false);
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
          '4': { count: 10, percentage: 83 },
          '3': { count: 1, percentage: 8 },
          '2': { count: 1, percentage: 8 },
          '5': { count: 0, percentage: 0 },
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

  const renderWaitingState = () => (
    <div className="neo-card p-8 max-w-md w-full text-center bg-white">
      <h2 className="text-4xl font-black mb-2">{className}</h2>
      <p className="font-bold mb-6">TEACHER: {teacherName}</p>

      <div className="my-8">
        <div className="text-6xl mb-4 animate-pulse">⏳</div>
        <p className="text-xl font-bold">WAITING FOR QUESTION...</p>
      </div>

      <p className="font-bold mb-6">CONNECTED: {connectedStudents} STUDENTS</p>

      <button
        onClick={onLeave}
        className="neo-btn bg-neo-red text-white w-full"
      >
        LEAVE CLASS
      </button>
    </div>
  );

  const renderQuestionState = () => {
    if (!currentQuestion) return null;

    return (
      <div className="neo-card p-8 max-w-md w-full bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">{className}</h2>
          <span className="neo-card bg-neo-yellow px-3 py-1 text-sm font-bold">
            QUESTION {currentQuestion.questionNumber}
          </span>
        </div>

        <p className="text-xl font-bold mb-6">{currentQuestion.text}</p>

        {currentQuestion.type === 'mc' && currentQuestion.options ? (
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`neo-card p-4 flex items-center cursor-pointer transition-colors ${selectedAnswer === option ? 'bg-neo-blue' : 'bg-gray-200'
                  }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="w-4 h-4 mr-3"
                  disabled={hasSubmitted}
                />
                <span className="font-bold">{option}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="mb-6">
            <textarea
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              placeholder="TYPE YOUR ANSWER HERE..."
              className="neo-input min-h-24 bg-gray-100 resize-vertical"
              disabled={hasSubmitted}
              maxLength={200}
            />
            <div className="text-right text-sm mt-1 font-bold">
              {textAnswer.length}/200
            </div>
          </div>
        )}

        <button
          onClick={submitAnswer}
          disabled={hasSubmitted || (!selectedAnswer && !textAnswer.trim())}
          className={`neo-btn w-full text-xl py-3 ${hasSubmitted
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-500 text-white'
            }`}
        >
          {hasSubmitted ? 'SUBMITTED...' : 'SUBMIT ANSWER'}
        </button>
      </div>
    );
  };

  const renderResultsState = () => {
    if (!currentQuestion) return null;

    return (
      <div className="neo-card p-8 max-w-md w-full bg-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">{className}</h2>
          <span className="neo-card bg-neo-yellow px-3 py-1 text-sm font-bold">
            QUESTION {currentQuestion.questionNumber}
          </span>
        </div>

        <p className="text-xl font-bold mb-6">{currentQuestion.text}</p>

        <div className="mb-6">
          <h3 className="font-black mb-3">RESULTS:</h3>
          <div className="space-y-2">
            {Object.entries(results).map(([answer, data]) => (
              <div key={answer} className="flex items-center gap-2">
                <span className="font-bold w-16">{answer}:</span>
                <div className="flex-1 bg-gray-200 border-4 border-black h-8">
                  <div
                    className="bg-green-500 h-full transition-all duration-1000"
                    style={{ width: `${data.percentage}%` }}
                  ></div>
                </div>
                <span className="font-bold w-24">
                  {data.count} ({data.percentage}%)
                  {answer === userAnswer && ' ← YOU'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {isCorrect !== null && (
          <div
            className={`neo-card p-4 text-center mb-6 ${isCorrect ? 'bg-green-200' : 'bg-red-200'
              }`}
          >
            <p className="font-black text-lg">
              {isCorrect ? '✓ YOUR ANSWER WAS CORRECT!' : '✗ YOUR ANSWER WAS INCORRECT'}
            </p>
          </div>
        )}

        <p className="text-center font-bold animate-pulse">
          WAITING FOR NEXT QUESTION...
        </p>
      </div>
    );
  };

  return (
    <div className="neo-page">
      {/* Header */}
      <header className="neo-header">
        <div className="neo-flex" style={{ alignItems: 'center' }}>
          <button onClick={onLeave} className="neo-btn bg-neo-white">
            ← LEAVE
          </button>
          <h2 className="neo-text-2xl neo-font-black">
            {className} ({classCode})
          </h2>
        </div>
        <div className="neo-status">
          <div className="neo-status-dot neo-status-online"></div>
          <span className="neo-font-black">CONNECTED</span>
        </div>
      </header>

      <div className="neo-max-w-4xl" style={{ margin: '0 auto' }}>
        {currentQuestion ? (
          <div className="neo-card neo-p-8 bg-neo-cyan">
            <div className="neo-text-center neo-mb-6">
              <h3 className="neo-text-3xl neo-font-black neo-mb-2">QUESTION</h3>
              <p className="neo-text-xl neo-font-bold">{currentQuestion.text}</p>
            </div>

            {!hasSubmitted ? (
              <>
                {currentQuestion.type === 'mc' && currentQuestion.options ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedAnswer(option)}
                        className={`neo-btn neo-btn-lg neo-text-left ${selectedAnswer === option ? 'bg-neo-yellow' : 'bg-neo-white'
                          }`}
                        style={{ padding: '16px 24px' }}
                      >
                        <span className="neo-font-black">{String.fromCharCode(65 + index)}.</span> {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="neo-mb-6">
                    <textarea
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      placeholder="TYPE YOUR ANSWER HERE..."
                      className="neo-input neo-textarea bg-neo-white"
                      style={{ minHeight: '120px' }}
                    />
                  </div>
                )}

                <button
                  onClick={submitAnswer}
                  disabled={!selectedAnswer && !textAnswer.trim()}
                  className={`neo-btn-lg neo-w-full ${(selectedAnswer || textAnswer.trim()) ? 'bg-neo-green' : 'bg-neo-gray'
                    }`}
                >
                  SUBMIT ANSWER
                </button>
              </>
            ) : (
              <div className="neo-text-center">
                <div className="neo-card neo-p-6 bg-neo-green neo-mb-6">
                  <h4 className="neo-text-2xl neo-font-black neo-mb-2">✓ ANSWER SUBMITTED</h4>
                  <p className="neo-font-bold">
                    Your answer: {userAnswer}
                  </p>
                </div>
                <p className="neo-text-lg neo-font-bold">
                  WAITING FOR OTHER STUDENTS...
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="neo-card neo-p-8 bg-neo-purple neo-text-center">
            <div className="neo-mb-6">
              <div className="neo-pulse" style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#FDE047',
                border: '4px solid #000',
                borderRadius: '50%',
                margin: '0 auto 24px'
              }}></div>
              <h3 className="neo-text-3xl neo-font-black neo-mb-4">WAITING FOR QUESTION</h3>
              <p className="neo-text-lg neo-font-bold">
                Your teacher will publish a question soon...
              </p>
            </div>
          </div>
        )}

        {/* Previous Questions */}
        {previousQuestions.length > 0 && (
          <div className="neo-card neo-p-6 bg-neo-gray" style={{ marginTop: '24px' }}>
            <h3 className="neo-text-2xl neo-font-black neo-mb-4">PREVIOUS QUESTIONS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {previousQuestions.slice(-3).map((question, index) => (
                <div key={question.id} className="neo-card neo-p-4 bg-neo-white">
                  <div className="neo-flex-between">
                    <span className="neo-font-bold">
                      Q{previousQuestions.length - 2 + index}: {question.text}
                    </span>
                    <div className="neo-flex neo-gap-2" style={{ fontSize: '14px' }}>
                      <span className="neo-font-bold">
                        Your answer: {question.yourAnswer}
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
  );
};

export default StudentClassroom; 