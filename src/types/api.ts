export interface Teacher {
  id: string;
  name?: string;
  email?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  teacher?: Teacher;
  token?: string;
  message?: string;
}

export interface Class {
  id: string;
  teacherId: string;
  className: string;
  code: string;
  status: 'preparing' | 'active' | 'ended';
  currentQuestion?: Question;
  participantCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  classId: string;
  type: 'multiple_choice' | 'short_answer';
  content: string;
  options?: string[];
  timeLimit?: number;
  isActive: boolean;
  responses?: QuestionResponse[];
  createdAt: string;
}

export interface QuestionResponse {
  studentId: string;
  studentName: string;
  answer: string | number;
  submittedAt: string;
}

export interface Student {
  id: string;
  classId: string;
  name: string;
  studentId: string;
  joinedAt: string;
}

export interface CreateClassRequest {
  className: string;
}

export interface CreateClassResponse {
  success: boolean;
  class?: Class;
  message?: string;
}

export interface JoinClassRequest {
  code: string;
  studentName: string;
  studentId: string;
}

export interface JoinClassResponse {
  success: boolean;
  class?: Class;
  student?: Student;
  message?: string;
}

export interface CreateQuestionRequest {
  classId: string;
  type: 'multiple_choice' | 'short_answer';
  content: string;
  options?: string[];
  timeLimit?: number;
}

export interface SubmitAnswerRequest {
  questionId: string;
  answer: string | number;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}