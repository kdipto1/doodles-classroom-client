import axiosInstance from '@/api/axios';
import axios from 'axios';
import { getData, getMessage } from '@/api/response';
import type { 
  LoginFormData, 
  RegisterFormData, 
  CreateClassFormData, 
  JoinClassFormData,
  Class, 
  Assignment, 
  DashboardStats,
  User
} from '@/lib/validation';

// Base API service class
class BaseApiService {
  protected async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: unknown
  ): Promise<{ data: T; message: string }> {
    try {
      let response;
      switch (method) {
        case 'GET':
          response = await axiosInstance.get(url);
          break;
        case 'DELETE':
          response = await axiosInstance.delete(url);
          break;
        case 'POST':
          response = await axiosInstance.post(url, data);
          break;
        case 'PUT':
          response = await axiosInstance.put(url, data);
          break;
        case 'PATCH':
          response = await axiosInstance.patch(url, data);
          break;
        default:
          response = await axiosInstance.get(url);
      }
      
      return {
        data: getData<T>(response),
        message: getMessage(response) || 'Operation completed successfully'
      };
    } catch (error: unknown) {
      let errorMessage = 'An unexpected error occurred';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  }

  protected async get<T>(url: string): Promise<{ data: T; message: string }> {
    return this.request<T>('GET', url);
  }

  protected async post<T>(url: string, data?: unknown): Promise<{ data: T; message: string }> {
    return this.request<T>('POST', url, data);
  }

  protected async put<T>(url: string, data?: unknown): Promise<{ data: T; message: string }> {
    return this.request<T>('PUT', url, data);
  }

  protected async delete<T>(url: string): Promise<{ data: T; message: string }> {
    return this.request<T>('DELETE', url);
  }

  protected async patch<T>(url: string, data?: unknown): Promise<{ data: T; message: string }> {
    return this.request<T>('PATCH', url, data);
  }
}

// Authentication service
export class AuthService extends BaseApiService {
  async login(credentials: LoginFormData) {
    return this.post<{
      accessToken: string;
      refreshToken: string;
      role: string;
      name: string;
    }>('/auth/login', credentials);
  }

  async register(userData: RegisterFormData) {
    return this.post<User>('/auth/register', userData);
  }

  async getMe() {
    return this.get<User>('/auth/me');
  }

  async refreshToken() {
    return this.post<{ accessToken: string }>('/auth/refresh-token');
  }
}

// Classroom service
export class ClassroomService extends BaseApiService {
  async createClass(classData: CreateClassFormData) {
    return this.post<Class>('/classes/createClass', classData);
  }

  async joinClass(joinData: JoinClassFormData) {
    return this.post<Class>('/classes/join', joinData);
  }

  async getMyClasses() {
    return this.get<Class[]>('/classes/my');
  }

  async getClassById(id: string) {
    return this.get<Class>(`/classes/${id}`);
  }
}

// Assignment service
export class AssignmentService extends BaseApiService {
  async createAssignment(assignmentData: {
    classId: string;
    title: string;
    description?: string;
    dueDate?: string;
  }) {
    return this.post<Assignment>('/assignments/createAssignment', assignmentData);
  }

  async getAssignmentsByClass(classId: string) {
    return this.get<Assignment[]>(`/assignments/class/${classId}`);
  }

  async getAssignmentById(id: string) {
    return this.get<Assignment>(`/assignments/${id}`);
  }
}

// Submission service
export class SubmissionService extends BaseApiService {
  async submitAssignment(submissionData: {
    assignmentId: string;
    submissionText?: string;
    submissionFile?: string;
  }) {
    return this.post<unknown>('/submissions/submitAssignment', submissionData);
  }

  async getSubmissionsByAssignment(assignmentId: string) {
    return this.get<unknown[]>(`/submissions/assignment/${assignmentId}`);
  }

  async getMySubmission(assignmentId: string) {
    return this.get<unknown>(`/submissions/my/${assignmentId}`);
  }

  async gradeSubmission(submissionId: string, gradeData: {
    marks: number;
    feedback?: string;
  }) {
    return this.patch<unknown>(`/submissions/${submissionId}/grade`, gradeData);
  }
}

// Dashboard service
export class DashboardService extends BaseApiService {
  async getDashboardStats() {
    return this.get<DashboardStats>('/dashboard');
  }
}

// Create service instances
export const authService = new AuthService();
export const classroomService = new ClassroomService();
export const assignmentService = new AssignmentService();
export const submissionService = new SubmissionService();
export const dashboardService = new DashboardService();
