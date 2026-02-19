import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, AlertTriangle, X, Search, Trash2, Settings, RefreshCw, LogIn, LogOut, User, Calendar, BarChart3, Shield } from 'lucide-react';
import { useNotifications } from '../hooks/notification.hook';
import { useDarkMode } from '../../../../../shared/components/Darkmodecontext';
import NotificationHeader from '../components/notificationheader';
import NotificationFilters from '../components/notificationfilter';
import NotificationList from '../components/notificationlist';
import NotificationSettings from '../components/notificationsetting';
import { useEffect, useState, useCallback, useMemo } from 'react';

export default function NotificationPage() {
  const { darkMode } = useDarkMode();
  const [syncStatus, setSyncStatus] = useState('idle');
  const [showSettings, setShowSettings] = useState(false);

  // ✅ Gunakan hook yang baru
  const {
    // Data
    notifications,
    unreadCount,
    isLoading,
    error,
    loginLogoutNotifications,
    activityStats,

    // Filtered Data
    filteredNotifications,
    categories,
    filter,
    categoryFilter,
    searchTerm,
    selectedNotifications,

    // Stats
    stats,

    // Actions
    markAsRead,
    markAllAsRead,
    removeNotification,
    refreshNotifications,

    // UI Setters
    setFilter,
    setCategoryFilter,
    setSearchTerm,
    setSelectedNotifications,

    // Bulk Actions
    handleBulkDelete,
    handleSelectNotification,
    handleSelectAll,

    // Utilities
    formatTime,
    getTypeColor,
    getNotificationIcon,

    // Debug
    debugState,
  } = useNotifications();

  const containerClass = `min-h-screen p-6 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900'}`;

  const handleRefreshWithStatus = useCallback(async () => {
    if (syncStatus === 'syncing') return;

    setSyncStatus('syncing');
    try {
      await refreshNotifications();
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      console.error('❌ Refresh failed:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 5000);
    }
  }, [refreshNotifications, syncStatus]);

  // Auto-refresh on mount
  useEffect(() => {
    if (notifications.length === 0 && !isLoading) {
      handleRefreshWithStatus();
    }
  }, [notifications.length, isLoading, handleRefreshWithStatus]);

  // Bulk delete handler
  const handleBulkDeleteWithSync = useCallback(async () => {
    if (selectedNotifications.length === 0) {
      console.warn('⚠️ No notifications selected for bulk delete');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedNotifications.length} notification${selectedNotifications.length > 1 ? 's' : ''}?`);

    if (!confirmDelete) {
      console.log('❌ Bulk delete cancelled by user');
      return;
    }

    try {
      console.log('🗑️ Starting bulk delete of', selectedNotifications.length, 'notifications');
      await handleBulkDelete();
      console.log('✅ Bulk delete completed successfully');
    } catch (error) {
      console.error('❌ Bulk delete failed:', error);
      alert('Failed to delete some notifications. Please try again.');
    }
  }, [selectedNotifications.length, handleBulkDelete]);

  const handleSelectAllFiltered = useCallback(() => {
    handleSelectAll();
  }, [handleSelectAll]);

  const handleClearSelection = useCallback(() => {
    setSelectedNotifications([]);
  }, [setSelectedNotifications]);

  const handleMarkAllAsReadWithSync = useCallback(async () => {
    if (unreadCount === 0) return;

    try {
      await markAllAsRead();
    } catch (error) {
      console.error('❌ Failed to mark all notifications as read:', error);
      alert('Failed to mark all as read');
    }
  }, [markAllAsRead, unreadCount]);

  // Safe activity stats
  const safeActivityStats = useMemo(
    () => ({
      totalActivities: activityStats?.totalActivities || 0,
      todayActivities: activityStats?.todayActivities || 0,
      last7DaysActivities: activityStats?.last7DaysActivities || 0,
      loginActivities: activityStats?.loginActivities || 0,
      logoutActivities: activityStats?.logoutActivities || 0,
      lastActivity: activityStats?.lastActivity || null,
    }),
    [activityStats]
  );

  // Loading state
  if (isLoading && notifications.length === 0) {
    return (
      <div className={containerClass}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading your notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <div className="mx-auto max-w-10xl">
        {/* Sync Status Messages */}
        <AnimatePresence>
          {syncStatus === 'syncing' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
            >
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Syncing notifications with server...</span>
              </div>
            </motion.div>
          )}

          {syncStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg dark:bg-green-900/20 dark:border-green-800 dark:text-green-300"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Notifications synced successfully!</span>
              </div>
            </motion.div>
          )}

          {syncStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Failed to sync notifications. Using local data.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Header */}
        <NotificationHeader
          darkMode={darkMode}
          unreadCount={unreadCount}
          totalCount={notifications.length}
          selectedCount={selectedNotifications.length}
          isLoading={isLoading}
          showSettings={showSettings}
          onMarkAllAsRead={handleMarkAllAsReadWithSync}
          onBulkDelete={handleBulkDeleteWithSync}
          onClearSelection={handleClearSelection}
          onToggleSettings={() => setShowSettings(!showSettings)}
          onRefresh={handleRefreshWithStatus}
          syncStatus={syncStatus}
          backendAvailable={syncStatus !== 'error'}
        />

        {/* Error Display */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Activity Dashboard */}
        {safeActivityStats.totalActivities > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-2xl border transition-colors duration-300 p-6 mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              <h2 className="text-xl font-semibold">Security Activity Dashboard</h2>
              <div className="flex-1"></div>
              <div className={`text-sm px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>Last sync: {formatTime(new Date())}</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {/* Total Activities */}
              <div className={`p-4 rounded-lg border transition-colors duration-200 ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-center gap-3">
                  <LogIn className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <div>
                    <div className="text-2xl font-bold">{safeActivityStats.totalActivities}</div>
                    <div className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Total Activities</div>
                  </div>
                </div>
              </div>

              {/* Today's Activities */}
              <div className={`p-4 rounded-lg border transition-colors duration-200 ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-center gap-3">
                  <Calendar className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  <div>
                    <div className="text-2xl font-bold">{safeActivityStats.todayActivities}</div>
                    <div className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Today</div>
                  </div>
                </div>
              </div>

              {/* Last 7 Days */}
              <div className={`p-4 rounded-lg border transition-colors duration-200 ${darkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'}`}>
                <div className="flex items-center gap-3">
                  <BarChart3 className={`w-8 h-8 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  <div>
                    <div className="text-2xl font-bold">{safeActivityStats.last7DaysActivities}</div>
                    <div className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>Last 7 Days</div>
                  </div>
                </div>
              </div>

              {/* Logins */}
              <div className={`p-4 rounded-lg border transition-colors duration-200 ${darkMode ? 'bg-orange-900/20 border-orange-800' : 'bg-orange-50 border-orange-200'}`}>
                <div className="flex items-center gap-3">
                  <User className={`w-8 h-8 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                  <div>
                    <div className="text-2xl font-bold">{safeActivityStats.loginActivities}</div>
                    <div className={`text-sm ${darkMode ? 'text-orange-300' : 'text-orange-700'}`}>Logins</div>
                  </div>
                </div>
              </div>

              {/* Logouts */}
              <div className={`p-4 rounded-lg border transition-colors duration-200 ${darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-3">
                  <LogOut className={`w-8 h-8 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
                  <div>
                    <div className="text-2xl font-bold">{safeActivityStats.logoutActivities}</div>
                    <div className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>Logouts</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Recent Security Activities</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>{loginLogoutNotifications.length} activities</span>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                <AnimatePresence>
                  {loginLogoutNotifications.slice(0, 5).map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${darkMode ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700' : 'bg-gray-50 border-gray-200 hover:bg-white'} ${
                        !notification.read ? (darkMode ? 'ring-1 ring-green-400/30' : 'ring-1 ring-green-200') : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {notification.type === 'success' ? <LogIn className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} /> : <LogOut className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{notification.title}</span>
                              <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>{notification.metadata?.activity_type || 'activity'}</span>
                              {notification.metadata?.is_fallback && <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-700'}`}>Local</span>}
                            </div>
                            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{notification.message}</p>
                            {notification.metadata && (
                              <div className="flex gap-2 mt-2 flex-wrap">
                                {notification.metadata.ip_address && <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>IP: {notification.metadata.ip_address}</span>}
                                <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                                  {new Date(notification.metadata.login_time || notification.metadata.logout_time || notification.timestamp).toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatTime(notification.timestamp)}</span>
                          {!notification.read && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {loginLogoutNotifications.length > 5 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setCategoryFilter('security')}
                    className={`text-sm px-4 py-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                  >
                    View All {loginLogoutNotifications.length} Security Activities
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Settings Panel */}
        <AnimatePresence>{showSettings && <NotificationSettings darkMode={darkMode} onClose={() => setShowSettings(false)} />}</AnimatePresence>

        {/* Filters */}
        <NotificationFilters
          darkMode={darkMode}
          searchTerm={searchTerm}
          filter={filter}
          categoryFilter={categoryFilter}
          categories={categories}
          selectedNotifications={selectedNotifications}
          filteredNotifications={filteredNotifications}
          onSearchChange={setSearchTerm}
          onFilterChange={setFilter}
          onCategoryFilterChange={setCategoryFilter}
          onSelectAll={handleSelectAllFiltered}
          onCategoryClick={setCategoryFilter}
          onClearFilters={() => {
            setSearchTerm('');
            setFilter('all');
            setCategoryFilter('all');
          }}
        />

        {/* Notification List */}
        <NotificationList
          darkMode={darkMode}
          notifications={filteredNotifications}
          selectedNotifications={selectedNotifications}
          getNotificationIcon={getNotificationIcon}
          getTypeColor={getTypeColor}
          formatTime={formatTime}
          onSelectNotification={handleSelectNotification}
          onMarkAsRead={markAsRead}
          onDelete={removeNotification}
          isLoading={isLoading}
          onRefresh={handleRefreshWithStatus}
          isRefreshing={syncStatus === 'syncing'}
        />

        {/* Footer Sync Button */}
        {filteredNotifications.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex justify-center mt-8">
            <button
              onClick={handleRefreshWithStatus}
              disabled={syncStatus === 'syncing'}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white disabled:bg-gray-800 disabled:text-gray-500' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:bg-gray-100 disabled:text-gray-400'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Notifications'}
            </button>
          </motion.div>
        )}

        {/* Empty State for Security Activities */}
        {safeActivityStats.totalActivities === 0 && loginLogoutNotifications.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl border transition-colors duration-300 p-8 text-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <Shield className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className="text-xl font-semibold mb-2">No Security Activities Yet</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Your login and logout activities will appear here once you start using the system.</p>
            <button onClick={handleRefreshWithStatus} className={`mt-4 px-4 py-2 rounded-lg font-medium transition-all ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
              Check for Activities
            </button>
          </motion.div>
        )}

        {/* Debug Info (Development Only) */}
        {import.meta.env.DEV && (
          <div className={`mt-8 p-4 rounded-lg text-xs ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
            <div>
              Total: {notifications.length} | Unread: {unreadCount} | Filtered: {filteredNotifications.length}
            </div>
            <div>
              Security Activities: {loginLogoutNotifications.length} | Sync: {syncStatus}
            </div>
            <div>
              Selected: {selectedNotifications.length} | Stats: Total {stats.total} | Unread {stats.unread} | Read {stats.read}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
