import type {
  AuthResponse,
  CreateClassRequest,
  CreateClassResponse,
  JoinClassRequest,
  JoinClassResponse,
  CreateQuestionRequest,
  SubmitAnswerRequest,
  Class,
  Question,
  Student,
} from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("authToken");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("authToken", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("authToken");
  }

  async login(teacherId: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({teacherId}),
    });

    if (response.success && response.token) {
      this.setToken(response.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  async getTeacherClasses(): Promise<Class[]> {
    return this.request<Class[]>("/classes");
  }

  async createClass(data: CreateClassRequest): Promise<CreateClassResponse> {
    return this.request<CreateClassResponse>("/classes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getClass(classId: string): Promise<Class> {
    return this.request<Class>(`/classes/${classId}`);
  }

  async updateClassStatus(
    classId: string,
    status: "preparing" | "active" | "ended"
  ): Promise<Class> {
    return this.request<Class>(`/classes/${classId}/status`, {
      method: "PUT",
      body: JSON.stringify({status}),
    });
  }

  async deleteClass(classId: string): Promise<void> {
    await this.request(`/classes/${classId}`, {
      method: "DELETE",
    });
  }

  async joinClass(data: JoinClassRequest): Promise<JoinClassResponse> {
    return this.request<JoinClassResponse>("/classes/join", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getClassStudents(classId: string): Promise<Student[]> {
    return this.request<Student[]>(`/classes/${classId}/students`);
  }

  async createQuestion(data: CreateQuestionRequest): Promise<Question> {
    return this.request<Question>("/questions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getClassQuestions(classId: string): Promise<Question[]> {
    return this.request<Question[]>(`/classes/${classId}/questions`);
  }

  async activateQuestion(questionId: string): Promise<Question> {
    return this.request<Question>(`/questions/${questionId}/activate`, {
      method: "PUT",
    });
  }

  async deactivateQuestion(questionId: string): Promise<Question> {
    return this.request<Question>(`/questions/${questionId}/deactivate`, {
      method: "PUT",
    });
  }

  async submitAnswer(data: SubmitAnswerRequest): Promise<void> {
    await this.request("/responses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getQuestionResponses(questionId: string): Promise<unknown[]> {
    return this.request<unknown[]>(`/questions/${questionId}/responses`);
  }
}

export const apiService = new ApiService();
