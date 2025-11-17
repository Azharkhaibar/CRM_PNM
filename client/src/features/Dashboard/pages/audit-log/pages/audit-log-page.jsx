
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

export const AuditLog = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLogs, setSelectedLogs] = useState([]);
  const { user: currentUser } = useAuth();

  // Use hooks
  const { auditLogs, total, pagination, loading, error, handleSearch, handleFilter, handlePageChange, clearError, refresh, deleteAuditLog, deleteMultipleAuditLogs } = useAuditLogList();
  const { stats, loading: statsLoading, error: statsError, refreshStats } = useAuditLogStats();
  const { exportToExcel, getUserDisplayName, getUserRoleDisplay, formatTimestamp } = useAuditLog();

  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    action: '',
    module: '',
    search: '',
  });

  const handleSelectLog = (logId) => {
    setSelectedLogs((prev) => (prev.includes(logId) ? prev.filter((id) => id !== logId) : [...prev, logId]));
  };

  const handleSelectAll = () => {
    if (selectedLogs.length === auditLogs.length) {
      setSelectedLogs([]);
    } else {
      setSelectedLogs(auditLogs.map((log) => log.id));
    }
  };

  const handleDeleteSingle = async (logId) => {
    if (confirm('Apakah Anda yakin ingin menghapus log ini?')) {
      try {
        await deleteAuditLog(logId);
        await refresh();
        await refreshStats();
        setSelectedLogs((prev) => prev.filter((id) => id !== logId));
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Gagal menghapus log. Silakan coba lagi.');
      }
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedLogs.length === 0) {
      alert('Pilih setidaknya satu log untuk dihapus');
      return;
    }

    if (confirm(`Apakah Anda yakin ingin menghapus ${selectedLogs.length} log yang dipilih?`)) {
      try {
        await deleteMultipleAuditLogs(selectedLogs);
        await refresh();
        await refreshStats();
        setSelectedLogs([]);
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Gagal menghapus log. Silakan coba lagi.');
      }
    }
  };

  useEffect(() => {
    setSelectedLogs([]);
  }, [auditLogs, pagination.page]);

  const getUserInfo = (log) => {
    if (log.id === auditLogs[0]?.id) {
      console.log('🔍 FULL LOG STRUCTURE:', {
        id: log.id,
        userId: log.userId,
        user: log.user,
        hasUser: !!log.user,
        userKeys: log.user ? Object.keys(log.user) : 'no user',
        module: log.module,
        action: log.action,
        ip: log.ip_address,
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
          return { bg: 'bg-purple-100', text: 'text-purple-600', badge: '👑' };
        case 'SYSTEM':
          return { bg: 'bg-gray-100', text: 'text-gray-600', badge: '⚙️' };
        case 'USER':
          return { bg: 'bg-blue-100', text: 'text-blue-600', badge: '👤' };
        default:
          return { bg: 'bg-gray-100', text: 'text-gray-600', badge: '❓' };
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
          <div className="text-xs text-gray-500 capitalize">{userInfo.roleDisplay}</div>
          {userInfo.userId && <div className="text-xs text-gray-400 mt-1">ID: {userInfo.userId}</div>}
        </div>
      </div>
    );
  };

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

  useEffect(() => {
    if (auditLogs.length > 0 && !loading) {
      const logsWithUser = auditLogs.filter((log) => log.user && log.user.userID);
      const logsWithUserId = auditLogs.filter((log) => log.userId);

      console.log('📊 AUDIT LOGS SUMMARY:', {
        totalLogs: auditLogs.length,
        logsWithUser: logsWithUser.length,
        logsWithUserId: logsWithUserId.length,
        usersFound: [...new Set(logsWithUser.map((log) => log.user?.userID).filter(Boolean))],
        sampleUserLog: logsWithUser[0] || 'No user logs found',
        sampleNonUserLog: auditLogs.find((log) => !log.user) || 'All logs have users',
      });
    }
  }, [auditLogs, loading]);

  return (
    <div className="bg-gray-50 p-6">
      <div className="w-full mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
              <p className="text-gray-600 mt-2">Monitor semua aktivitas sistem secara real-time</p>
            </div>
            <div className="flex gap-3">
  
              {selectedLogs.length > 0 && (
                <button
                  onClick={handleDeleteMultiple}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus ({selectedLogs.length})
                </button>
              )}
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
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-600">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
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
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Hari Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalCount(stats.today)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Minggu Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalCount(stats.week)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Bulan Ini</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalCount(stats.month)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <User className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Module</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.modules?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {statsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <div className="flex gap-2">
                <button onClick={() => setShowFilters(!showFilters)} className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
                </button>
                <button onClick={resetFilters} className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                  Reset
                </button>
              </div>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari deskripsi..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                  <input type="date" value={filters.start_date} onChange={(e) => handleFilterChange('start_date', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Akhir</label>
                  <input type="date" value={filters.end_date} onChange={(e) => handleFilterChange('end_date', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aksi</label>
                  <select value={filters.action} onChange={(e) => handleFilterChange('action', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
                  <select value={filters.module} onChange={(e) => handleFilterChange('module', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="">Semua Module</option>
                    {stats?.modules?.map((module) => (
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

        {selectedLogs.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">{selectedLogs.length} log dipilih</span>
              <button onClick={() => setSelectedLogs([])} className="text-sm text-blue-600 hover:text-blue-800">
                Batalkan pilihan
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Memuat data audit...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                        <input type="checkbox" checked={selectedLogs.length === auditLogs.length && auditLogs.length > 0} onChange={handleSelectAll} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Module</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {auditLogs.map((log) => {
                      const ipAddress = log.ip_address || '-';
                      const timestamp = log.timestamp || '';
                      const isSelected = selectedLogs.includes(log.id);

                      return (
                        <tr key={log.id} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input type="checkbox" checked={isSelected} onChange={() => handleSelectLog(log.id)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <UserDisplay log={log} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-800'}`}>{log.action}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.module}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                            <div className="line-clamp-2">{log.description}</div>
                            {log.endpoint && (
                              <div className="text-xs text-gray-500 mt-1 truncate" title={log.endpoint}>
                                {log.endpoint}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <code className="bg-gray-100 px-1 py-0.5 rounded">{ipAddress}</code>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTimestamp(timestamp)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${log.isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{log.isSuccess ? '✅ Berhasil' : '❌ Gagal'}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button onClick={() => handleDeleteSingle(log.id)} className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors" title="Hapus log">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {auditLogs.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data audit</h3>
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
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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
