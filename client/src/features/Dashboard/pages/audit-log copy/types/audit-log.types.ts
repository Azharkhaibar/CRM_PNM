// audit-log/types/audit-log.types.ts
export interface AuditLog {
  id: number;
  userId: number | null;
  user: {
    id: number;
    name: string;
    username?: string;
    email?: string;
    role?: string;
  } | null;
  action: string;
  module: string;
  description: string;
  endpoint: string | null;
  ip_address: string | null;
  isSuccess: boolean;
  timestamp: string;
  metadata: Record<string, unknown> | null;
}

export interface AuditLogListResponse {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  module?: string;
  start_date?: string;
  end_date?: string;
  userId?: number;
}

export interface AuditLogStats {
  today: Array<{ action: string; count: string }>;
  week: Array<{ action: string; count: string }>;
  month: Array<{ action: string; count: string }>;
  modules: string[];
}

export interface AuditLogParams {
  page?: number;
  limit?: number;
  search?: string;
  filters?: Record<string, any>;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}
