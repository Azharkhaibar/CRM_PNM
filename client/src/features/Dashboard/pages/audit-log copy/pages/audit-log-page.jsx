import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, User, Calendar, Activity, BarChart3, Trash2 } from 'lucide-react';
import { useAuditLogList } from '../hooks/audit-log-list.hooks';
import { useAuditLogStats } from '../hooks/audit-log-stats.hooks';
import { useAuditLog } from '../hooks/audit-log.hooks';
import { useAuth } from '../../../../auth/hooks/useAuth.hook';

const ACTION_COLORS = {
  CREATE: 'bg-green-100 text-green-800',
  UPDATE: 'bg-blue-100 text-blue-800',
  DELETE: 'bg-red-100 text-red-800',
  VIEW: 'bg-gray-100 text-gray-800',
  EXPORT: 'bg-purple-100 text-purple-800',
  LOGIN: 'bg-indigo-100 text-indigo-800',
  LOGOUT: 'bg-orange-100 text-orange-800',
};

// Daftar module hardcode untuk memastikan RAS selalu muncul
const ALL_MODULES = ['RAS', 'INVESTASI', 'PASAR', 'LIKUIDITAS', 'OPERASIONAL', 'HUKUM', 'STRATEJIK', 'KEPATUHAN', 'REPUTASI', 'USER_MANAGEMENT', 'SYSTEM'];

export const AuditLog = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { user: currentUser } = useAuth();

  // Use hooks
  const { auditLogs, total, pagination, loading, error, handleSearch, handleFilter, handlePageChange, clearError, refresh } = useAuditLogList();
  const { stats, loading: statsLoading, error: statsError, refreshStats } = useAuditLogStats();
  const { exportToExcel, getUserDisplayName, getUserRoleDisplay, formatTimestamp } = useAuditLog();

  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    action: '',
    module: '',
    search: '',
  });

  // Debug log structure
  useEffect(() => {
    if (auditLogs.length > 0 && !loading) {
      console.log(
        '🔍 DEBUG - First 5 audit logs:',
        auditLogs.slice(0, 5).map((log) => ({
          id: log.id,
          module: log.module,
          action: log.action,
          description: log.description,
          hasModule: !!log.module,
          moduleType: typeof log.module,
        })),
      );

      // Check for RAS logs specifically
      const rasLogs = auditLogs.filter((log) => log.module === 'RAS');
      console.log('🔍 RAS Logs found:', rasLogs.length);
      if (rasLogs.length > 0) {
        console.log('🔍 Sample RAS Log:', rasLogs[0]);
      }
    }
  }, [auditLogs, loading]);

  // Gabungkan module dari stats dengan hardcoded
  const availableModules = React.useMemo(() => {
    if (!stats || !stats.modules) return ALL_MODULES;

    const modulesFromStats = stats.modules || [];
    const allModules = [...new Set([...modulesFromStats, ...ALL_MODULES])];

    console.log('📋 Available modules:', {
      fromStats: modulesFromStats,
      hardcoded: ALL_MODULES,
      combined: allModules,
      hasRAS: allModules.includes('RAS'),
    });

    return allModules.sort();
  }, [stats]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    if (key === 'search') {
      handleSearch(value);
    } else {
      handleFilter(newFilters);
    }
  };

  const resetFilters = () => {
    const resetFilters = {
      start_date: '',
      end_date: '',
      action: '',
      module: '',
      search: '',
    };
    setFilters(resetFilters);
    handleFilter(resetFilters);
    handleSearch('');
  };

  const handleExport = async () => {
    try {
      await exportToExcel(filters);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Gagal mengekspor data. Silakan coba lagi.');
    }
  };

  const getTotalCount = (statsArray) => {
    if (!statsArray || !Array.isArray(statsArray)) return 0;
    return statsArray.reduce((acc, curr) => acc + parseInt(curr.count || '0', 10), 0);
  };

  const getUserInfo = (log) => {
    // Debug specific log
    if (log.module === 'RAS') {
      console.log('🔍 RAS Log User Info:', {
        id: log.id,
        userId: log.userId,
        user: log.user,
        module: log.module,
        action: log.action,
      });
    }

    if (log.user && log.user.userID) {
      return {
        name: log.user.userID,
        role: log.user.role || 'User',
        displayName: getUserDisplayName(log.user),
        roleDisplay: getUserRoleDisplay(log.user),
        userId: log.user.user_id,
        source: 'user_object',
      };
    }

    if (log.userId) {
      return {
        name: `User ${log.userId}`,
        role: 'User',
        displayName: `User ${log.userId}`,
        roleDisplay: 'User',
        userId: log.userId,
        source: 'user_id',
      };
    }

    if (log.metadata && (log.metadata.userId || log.metadata.userID)) {
      const metaUserId = log.metadata.userId || log.metadata.userID;
      return {
        name: `User ${metaUserId}`,
        role: 'User',
        displayName: `User ${metaUserId}`,
        roleDisplay: 'User',
        userId: metaUserId,
        source: 'metadata',
      };
    }

    const userActions = ['CREATE', 'UPDATE', 'DELETE', 'EXPORT'];
    if (userActions.includes(log.action)) {
      return {
        name: 'Unknown User',
        role: 'User',
        displayName: 'Unknown User 👤',
        roleDisplay: 'User',
        source: 'user_action',
      };
    }

    const systemActions = ['SYSTEM_START', 'AUTO_BACKUP', 'CRON_JOB'];
    const systemModules = ['SYSTEM'];

    if (systemActions.includes(log.action) || systemModules.includes(log.module)) {
      return {
        name: 'System',
        role: 'System',
        displayName: 'System ⚙️',
        roleDisplay: 'System',
        source: 'system',
      };
    }

    if (log.ip_address === '127.0.0.1' || log.ip_address === 'localhost') {
      return {
        name: 'Local System',
        role: 'System',
        displayName: 'Local System ⚙️',
        roleDisplay: 'System',
        source: 'local_ip',
      };
    }

    return {
      name: 'Unknown',
      role: 'Unknown',
      displayName: 'Unknown',
      roleDisplay: 'Unknown',
      source: 'fallback',
    };
  };

  const UserDisplay = ({ log }) => {
    const userInfo = getUserInfo(log);

    const getRoleColor = (role) => {
      switch (role?.toUpperCase()) {
        case 'ADMIN':
          return {
            bg: 'bg-purple-100 text-purple-600',
            text: 'text-purple-600',
            badge: '👑',
          };
        case 'SYSTEM':
          return {
            bg: 'bg-gray-100 text-gray-600',
            text: 'text-gray-600',
            badge: '⚙️',
          };
        case 'USER':
          return {
            bg: 'bg-blue-100 text-blue-600',
            text: 'text-blue-600',
            badge: '👤',
          };
        default:
          return {
            bg: 'bg-gray-100 text-gray-600',
            text: 'text-gray-600',
            badge: '❓',
          };
      }
    };

    const roleColors = getRoleColor(userInfo.role);

    return (
      <div className="flex items-center">
        <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${roleColors.bg}`}>
          <User className={`w-4 h-4 ${roleColors.text}`} />
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
            {userInfo.displayName}
            <span className="text-xs">{roleColors.badge}</span>
          </div>
          <div className="text-xs text-gray-600 capitalize">{userInfo.roleDisplay}</div>
          {userInfo.userId && <div className="text-xs text-gray-500 mt-1">ID: {userInfo.userId}</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="w-full mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
              <p className="text-gray-600 mt-2">Monitor semua aktivitas sistem secara real-time</p>
            </div>
            <div className="flex gap-3">
              <button onClick={refresh} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Activity className="w-4 h-4" />
                Refresh
              </button>
              <button onClick={handleExport} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Download className="w-4 h-4" />
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg border bg-red-50 border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-600">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm mt-1 text-red-700">{error}</p>
                </div>
              </div>
              <button onClick={clearError} className="text-red-600 hover:text-red-800">
                ×
              </button>
            </div>
          </div>
        )}

        {!statsLoading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="rounded-xl p-6 shadow-sm border bg-white border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalCount(stats.today)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-6 shadow-sm border bg-white border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 text-green-600">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Minggu Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalCount(stats.week)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-6 shadow-sm border bg-white border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Bulan Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalCount(stats.month)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl p-6 shadow-sm border bg-white border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Module</p>
                  <p className="text-2xl font-bold text-gray-900">{availableModules.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {statsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl p-6 shadow-sm border bg-white border-gray-200">
                <div className="animate-pulse">
                  <div className="h-4 rounded w-1/2 mb-2 bg-gray-200"></div>
                  <div className="h-6 rounded w-1/3 bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-xl shadow-sm border bg-white border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <div className="flex gap-2">
                <button onClick={() => setShowFilters(!showFilters)} className="inline-flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors bg-white hover:bg-gray-50 border-gray-300 text-gray-700">
                  <Filter className="w-4 h-4" />
                  {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
                </button>
                <button onClick={resetFilters} className="px-3 py-2 rounded-lg transition-colors text-gray-600 hover:text-gray-800 hover:bg-gray-50">
                  Reset
                </button>
              </div>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari deskripsi..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={filters.start_date}
                    onChange={(e) => handleFilterChange('start_date', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Tanggal Akhir</label>
                  <input
                    type="date"
                    value={filters.end_date}
                    onChange={(e) => handleFilterChange('end_date', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Aksi</label>
                  <select
                    value={filters.action}
                    onChange={(e) => handleFilterChange('action', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors bg-white border-gray-300 text-gray-900"
                  >
                    <option value="">Semua Aksi</option>
                    <option value="CREATE">Create</option>
                    <option value="UPDATE">Update</option>
                    <option value="DELETE">Delete</option>
                    <option value="VIEW">View</option>
                    <option value="EXPORT">Export</option>
                    <option value="LOGIN">Login</option>
                    <option value="LOGOUT">Logout</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Module</label>
                  <select
                    value={filters.module}
                    onChange={(e) => handleFilterChange('module', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors bg-white border-gray-300 text-gray-900"
                  >
                    <option value="">Semua Module</option>
                    {availableModules.map((module) => (
                      <option key={module} value={module}>
                        {module}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl shadow-sm border bg-white border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Memuat data audit...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50 border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Aksi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Module</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Deskripsi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Waktu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {auditLogs.map((log) => {
                      const ipAddress = log.ip_address || '-';
                      const timestamp = log.timestamp || '';


                      if (!log.module && log.description.includes('RAS')) {
                        console.warn('⚠️ Log tanpa module:', {
                          id: log.id,
                          description: log.description,
                          action: log.action,
                        });
                      }

                      return (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <UserDisplay log={log} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-800'}`}>{log.action}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`font-medium ${log.module ? 'text-gray-900' : 'text-red-600 italic'}`}>{log.module || '(No Module)'}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                            <div className="line-clamp-2">{log.description}</div>
                            {log.endpoint && (
                              <div className="text-xs mt-1 truncate text-gray-500" title={log.endpoint}>
                                {log.endpoint}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <code className="px-1 py-0.5 rounded bg-gray-100 text-gray-600">{ipAddress}</code>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTimestamp(timestamp)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${log.isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{log.isSuccess ? '✅ Berhasil' : '❌ Gagal'}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {auditLogs.length === 0 && !loading && (
 
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2 text-gray-900">Tidak ada data audit</h3>
                  <p className="text-gray-500">Tidak ada aktivitas yang tercatat untuk filter yang dipilih.</p>
                </div>
              )}

              {auditLogs.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Menampilkan <span className="font-semibold">{(pagination.page - 1) * pagination.limit + 1}</span> - <span className="font-semibold">{Math.min(pagination.page * pagination.limit, total)}</span> dari{' '}
                      <span className="font-semibold">{total}</span> aktivitas
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="px-4 py-2 border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-gray-300 hover:bg-gray-50 text-gray-700"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="px-4 py-2 border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-gray-300 hover:bg-gray-50 text-gray-700"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

