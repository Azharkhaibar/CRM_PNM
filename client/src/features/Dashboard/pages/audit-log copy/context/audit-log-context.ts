// audit-log/context/audit-log-context.ts  ← TETAP .ts TAPI PAKAI React.createElement
import React, { createContext, useContext, ReactNode } from 'react';
import { useAuditLog } from '../hooks/audit-log.hooks';

// Definisikan interface untuk context value
interface AuditLogContextType {
  logCreate: (module: string, description: string, additionalData?: any) => Promise<any>;
  logUpdate: (module: string, description: string, additionalData?: any) => Promise<any>;
  logDelete: (module: string, description: string, additionalData?: any) => Promise<any>;
  logView: (module: string, description: string, additionalData?: any) => Promise<any>;
  logExport: (module: string, description: string, additionalData?: any) => Promise<any>;
  logLogin: (description: string, additionalData?: any) => Promise<any>;
  logLogout: (description: string, additionalData?: any) => Promise<any>;
  getAuditLogs: (params?: any) => Promise<any>;
  getStats: () => Promise<any>;
  exportToExcel: (params?: any) => Promise<any>;
  clearError: () => void;
  reset: () => void;
  loading: boolean;
  error: string | null;
  data: any;
}

// Buat context dengan default value undefined
const AuditLogContext = createContext<AuditLogContextType | undefined>(undefined);

// Custom hook untuk menggunakan context
export const useAuditLogContext = (): AuditLogContextType => {
  const context = useContext(AuditLogContext);
  if (!context) {
    throw new Error('useAuditLogContext must be used within AuditLogProvider');
  }
  return context;
};

// Props interface untuk provider
interface AuditLogProviderProps {
  children: ReactNode;
}

// Provider component tanpa JSX
export const AuditLogProvider: React.FC<AuditLogProviderProps> = ({ children }) => {
  const auditLog = useAuditLog();

  return React.createElement(AuditLogContext.Provider, { value: auditLog }, children);
};

export default AuditLogContext;
