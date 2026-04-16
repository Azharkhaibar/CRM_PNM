// audit-log/hooks/audit-log.hooks.ts
import { useState, useCallback } from 'react';
import auditLogServices from '../services/audit-log.services';

interface AdditionalLogData {
  endpoint?: string;
  ipAddress?: string;
  isSuccess?: boolean;
  userId?: number | null;
  metadata?: Record<string, unknown>;
}

interface DeleteMultipleResponse {
  message: string;
  deletedCount: number;
}

interface AuditLogResponse {
  data: any;
  total?: number;
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

// ✅ SESUAIKAN DENGAN STRUCTURE BACKEND
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

interface AuditLogStats {
  today: Array<{ action: string; count: string }>;
  week: Array<{ action: string; count: string }>;
  month: Array<{ action: string; count: string }>;
  modules: string[];
}

export const useAuditLog = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AuditLogResponse | null>(null);

  const createLog = useCallback(
    async (logData: { action: string; module: string; description: string; endpoint?: string; ipAddress?: string; isSuccess?: boolean; userId?: number | null; metadata?: Record<string, unknown> }): Promise<any> => {
      try {
        const result = await auditLogServices.createAuditLog(logData);
        return result;
      } catch (error) {
        console.error('Failed to create audit log:', error);
        return null;
      }
    },
    []
  );

  // Helper functions untuk action yang umum
  const logCreate = useCallback(
    async (module: string, description: string, additionalData: AdditionalLogData = {}): Promise<any> => {
      return createLog({
        action: 'CREATE',
        module: module,
        description,
        ...additionalData,
      });
    },
    [createLog]
  );

  const logUpdate = useCallback(
    async (module: string, description: string, additionalData: AdditionalLogData = {}): Promise<any> => {
      return createLog({
        action: 'UPDATE',
        module: module,
        description,
        ...additionalData,
      });
    },
    [createLog]
  );

  const logDelete = useCallback(
    async (module: string, description: string, additionalData: AdditionalLogData = {}): Promise<any> => {
      return createLog({
        action: 'DELETE',
        module: module,
        description,
        ...additionalData,
      });
    },
    [createLog]
  );

  const logView = useCallback(
    async (module: string, description: string, additionalData: AdditionalLogData = {}): Promise<any> => {
      return createLog({
        action: 'VIEW',
        module: module,
        description,
        ...additionalData,
      });
    },
    [createLog]
  );

  const logExport = useCallback(
    async (module: string, description: string, additionalData: AdditionalLogData = {}): Promise<any> => {
      return createLog({
        action: 'EXPORT',
        module: module,
        description,
        ...additionalData,
      });
    },
    [createLog]
  );

  const logLogin = useCallback(
    async (description: string, additionalData: AdditionalLogData = {}): Promise<any> => {
      return createLog({
        action: 'LOGIN',
        module: 'USER_MANAGEMENT',
        description,
        ...additionalData,
      });
    },
    [createLog]
  );

  const logLogout = useCallback(
    async (description: string, additionalData: AdditionalLogData = {}): Promise<any> => {
      return createLog({
        action: 'LOGOUT',
        module: 'USER_MANAGEMENT',
        description,
        ...additionalData,
      });
    },
    [createLog]
  );

  // Get audit logs dengan filter
  const getAuditLogs = useCallback(async (params: PaginationParams = {}): Promise<AuditLogListResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await auditLogServices.getAuditLogs(params);
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get stats
  const getStats = useCallback(async (): Promise<AuditLogStats> => {
    setLoading(true);
    setError(null);

    try {
      const result = await auditLogServices.getAuditLogStats();
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Export to Excel
  const exportToExcel = useCallback(async (params: PaginationParams = {}): Promise<{ success: boolean; filename: string }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await auditLogServices.exportAuditLogs(params);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // DELETE FUNCTION SECTION

  // ✅ DELETE FUNCTIONS
  const deleteAuditLog = useCallback(async (logId: number): Promise<{ message: string }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await auditLogServices.deleteAuditLog(logId);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMultipleAuditLogs = useCallback(async (logIds: number[]): Promise<DeleteMultipleResponse> => {
    setLoading(true);
    setError(null);

    try {
      if (!logIds || logIds.length === 0) {
        throw new Error('tidak ada log yg dipilih untuk dihapus');
      }
      const result = await auditLogServices.deleteMultipleAuditLogs(logIds);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteByFilter = useCallback(async (filters: { start_date?: string; end_date?: string; action?: string; module?: string }): Promise<DeleteMultipleResponse> => {
    setLoading(true);
    setError(null);

    try {
      const result = await auditLogServices.deleteByFilter(filters);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal menghapus log berdasarkan filter';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAllAuditLogs = useCallback(async (): Promise<DeleteMultipleResponse> => {
    setLoading(true);
    setError(null);

    try {
      if (!window.confirm('Apakah Anda yakin ingin menghapus SEMUA log audit? Tindakan ini tidak dapat dibatalkan!')) {
        throw new Error('Operasi dibatalkan oleh pengguna');
      }

      const result = await auditLogServices.deleteAllAuditLogs();
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Gagal menghapus semua log audit';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Utility function untuk mendapatkan display name dari user
  const getUserDisplayName = useCallback((user: User | null): string => {
    if (!user) return 'System';

    // Gunakan userID sebagai display name
    if (user.userID) {
      return user.userID;
    }

    return `User ${user.user_id}`;
  }, []);

  const getUserRoleDisplay = useCallback((user: User | null): string => {
    if (!user) return 'System';
    return user.role || 'User';
  }, []);

  const formatTimestamp = useCallback((timestamp: string): string => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('id-ID');
  }, []);

  // Clear error
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // Reset state
  const reset = useCallback((): void => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    // State
    loading,
    error,
    data,

    // Helper functions untuk logging
    logCreate,
    logUpdate,
    logDelete,
    logView,
    logExport,
    logLogin,
    logLogout,

    // CRUD Operations
    getAuditLogs,
    getStats,
    exportToExcel,

    // ✅ DELETE OPERATIONS
    deleteAuditLog,
    deleteMultipleAuditLogs,
    deleteByFilter,
    deleteAllAuditLogs,

    // ✅ UTILITY FUNCTIONS
    getUserDisplayName,
    getUserRoleDisplay,
    formatTimestamp,

    // Utility functions
    clearError,
    reset,
  };
};

// Export types untuk digunakan di komponen lain
export type { AdditionalLogData, AuditLogResponse, PaginationParams, AuditLogListResponse, AuditLog, User, AuditLogStats };
