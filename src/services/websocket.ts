import {io, Socket} from "socket.io-client";

export type SocketEvent =
  | "class_update"
  | "question_published"
  | "question_ended"
  | "student_joined"
  | "student_left"
  | "answer_submitted"
  | "results_updated";

export interface SocketData {
  classId?: string;
  questionId?: string;
  studentId?: string;
  data?: unknown;
}

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;

  private getWebSocketUrl(): string {
    return import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
  }

  connect(token?: string): Promise<void> {
    if (this.socket?.connected || this.isConnecting) {
      return Promise.resolve();
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        this.socket = io(this.getWebSocketUrl(), {
          auth: token ? {token} : undefined,
          transports: ["websocket", "polling"],
          timeout: 10000,
        });

        this.socket.on("connect", () => {
          console.log("WebSocket connected");
          this.reconnectAttempts = 0;
          this.isConnecting = false;
          resolve();
        });

        this.socket.on("connect_error", (error) => {
          console.error("WebSocket connection error:", error);
          this.isConnecting = false;
          this.handleReconnect();
          reject(error);
        });

        this.socket.on("disconnect", (reason) => {
          console.log("WebSocket disconnected:", reason);
          if (reason === "io server disconnect") {
            this.handleReconnect();
          }
        });

        this.socket.on("reconnect", () => {
          console.log("WebSocket reconnected");
          this.reconnectAttempts = 0;
        });
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff

      setTimeout(() => {
        console.log(
          `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
        );
        this.connect();
      }, delay);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.reconnectAttempts = 0;
    this.isConnecting = false;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  joinRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit("join_room", {roomId});
    }
  }

  leaveRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit("leave_room", {roomId});
    }
  }

  emit(event: string, data: unknown) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  on(event: SocketEvent | string, callback: (data: unknown) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: SocketEvent | string, callback?: (data: unknown) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.removeAllListeners(event);
      }
    }
  }

  // Teacher-specific methods
  publishQuestion(classId: string, questionData: unknown) {
    this.emit("publish_question", {classId, questionData});
  }

  endQuestion(classId: string, questionId: string) {
    this.emit("end_question", {classId, questionId});
  }

  updateClassStatus(classId: string, status: string) {
    this.emit("update_class_status", {classId, status});
  }

  // Student-specific methods
  submitAnswer(questionId: string, answer: unknown, studentInfo: unknown) {
    this.emit("submit_answer", {questionId, answer, studentInfo});
  }

  // Common event listeners
  onClassUpdate(callback: (data: unknown) => void) {
    this.on("class_update", callback);
  }

  onQuestionPublished(callback: (data: unknown) => void) {
    this.on("question_published", callback);
  }

  onQuestionEnded(callback: (data: unknown) => void) {
    this.on("question_ended", callback);
  }

  onStudentJoined(callback: (data: unknown) => void) {
    this.on("student_joined", callback);
  }

  onStudentLeft(callback: (data: unknown) => void) {
    this.on("student_left", callback);
  }

  onAnswerSubmitted(callback: (data: unknown) => void) {
    this.on("answer_submitted", callback);
  }

  onResultsUpdated(callback: (data: unknown) => void) {
    this.on("results_updated", callback);
  }

  // Cleanup method to remove all listeners
  cleanup() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export const websocketService = new WebSocketService();
