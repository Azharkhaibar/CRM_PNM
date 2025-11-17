// audit-log/services/audit-log.services.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:5530/api/v1';

interface AuditLogData {
  action: string;
  module: string;
  description: string;
  endpoint?: string;
  ipAddress?: string;
  isSuccess?: boolean;
  userId?: number | null;
  metadata?: Record<string, unknown>;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  module?: string;
  start_date?: string;
  end_date?: string;
}

interface User {
  user_id: number;
  userID: string;
  role: string;
  gender: string;
}

interface AuditLog {
  id: number;
  userId: number | null;
  user: User | null;
  action: string;
  module: string;
  description: string;
  endpoint: string | null;
  ip_address: string;
  isSuccess: boolean;
  timestamp: string;
  metadata: any;
}

interface AuditLogListResponse {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface DeleteMultipleResponse {
  message: string;
  deletedCount: number;
}

interface AuditLogStats {
  today: Array<{ action: string; count: string }>;
  week: Array<{ action: string; count: string }>;
  month: Array<{ action: string; count: string }>;
  modules: string[];
}

class AuditLogService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = localStorage.getItem('authToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );
  }

  async createAuditLog(auditLogData: AuditLogData): Promise<any> {
    try {
      const userJson = localStorage.getItem('user');
      let userId: number | null = null;

      if (userJson) {
        try {
          const userData = JSON.parse(userJson);
          userId = userData.user_id || userData.id || userData.userId;
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
        }
      }

      const clientIP = await this.getClientIP();

      const description = auditLogData.description && auditLogData.description !== 'No description provided' ? auditLogData.description : `${auditLogData.action} ${auditLogData.module}`;

      const payload = {
        action: auditLogData.action,
        module: auditLogData.module,
        description: description,
        endpoint: auditLogData.endpoint || window.location.pathname,
        ip_address: auditLogData.ipAddress || clientIP,
        isSuccess: auditLogData.isSuccess ?? true,
        userId: auditLogData.userId ?? userId,
        metadata: auditLogData.metadata && Object.keys(auditLogData.metadata).length > 0 ? auditLogData.metadata : null,
      };

      console.log('📝 Creating audit log:', payload); 

      const response = await this.api.post('/audit-logs', payload);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create audit log:', error);
      return null;
    }
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json', {
        signal: AbortSignal.timeout(5000),
        mode: 'cors',
      });

      if (response.ok) {
        const data = await response.json();
        return data.ip;
      }
      return 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  async getAuditLogs(params: PaginationParams = {}): Promise<AuditLogListResponse> {
    try {
      const response = await this.api.get('/audit-logs', { params });

      const responseData = response.data;

      const normalizedResponse: AuditLogListResponse = {
        data: responseData.data || [],
        total: responseData.total || 0,
        page: responseData.page || params.page || 1,
        limit: responseData.limit || params.limit || 20,
        totalPages: responseData.totalPages || Math.ceil((responseData.total || 0) / (params.limit || 20)),
      };

      return normalizedResponse;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getAuditLogStats(): Promise<AuditLogStats> {
    try {
      const response = await this.api.get('/audit-logs/stats');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async exportAuditLogs(params: PaginationParams = {}): Promise<{ success: boolean; filename: string }> {
    try {
      const response = await this.api.get('/audit-logs/export', {
        params,
        responseType: 'blob',
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers['content-disposition'];
      let filename = `audit-logs-${new Date().toISOString().split('T')[0]}.xlsx`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true, filename };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteAuditLog(logId: number): Promise<{ message: string }> {
    try {
      const response = await this.api.delete(`/audit-logs/${logId}`);
      return response.data;
    } catch (err: any) {
      throw this.handleError(err);
    }
  }

  async deleteMultipleAuditLogs(logsIds: number[]): Promise<DeleteMultipleResponse> {
    try {
      const responseDelete = await this.api.delete('/audit-logs/batch/delete', {
        data: { ids: logsIds },
      });
      return responseDelete.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteByFilter(filters: { start_date?: string; end_date?: string; action?: string; module?: string }): Promise<DeleteMultipleResponse> {
    try {
      const response = await this.api.delete('/audit-logs/filter/delete', {
        params: filters,
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async deleteAllAuditLogs(): Promise<DeleteMultipleResponse> {
    try {
      const response = await this.api.delete('/audit-logs/all/delete');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const status = error.response.status;
        const serverMessage = error.response.data?.message || error.response.data?.error;

        switch (status) {
          case 400:
            return new Error(serverMessage || 'Permintaan tidak valid');
          case 401:
            return new Error('Sesi telah berakhir, silakan login kembali');
          case 403:
            return new Error('Anda tidak memiliki akses');
          case 404:
            return new Error('Data tidak ditemukan');
          case 500:
            return new Error(serverMessage || 'Terjadi kesalahan pada server');
          default:
            return new Error(serverMessage || `Terjadi kesalahan (${status})`);
        }
      } else if (error.request) {
        return new Error('Tidak dapat terhubung ke server');
      } else {
        return new Error(error.message || 'Terjadi kesalahan dalam mengirim permintaan');
      }
    } else if (error instanceof Error) {
      return error;
    } else {
      return new Error('Terjadi kesalahan yang tidak diketahui');
    }
  }
}

export default new AuditLogService();
