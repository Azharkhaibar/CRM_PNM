import { motion } from 'framer-motion';
import { Bell, CheckCircle, Trash2, Settings, X, RefreshCw, Wifi, WifiOff } from 'lucide-react';

export default function NotificationHeader({
  darkMode,
  unreadCount,
  totalCount,
  selectedCount,
  isLoading,
  showSettings,
  onMarkAllAsRead,
  onBulkDelete,
  onClearSelection,
  onToggleSettings,
  onRefresh,
  backendAvailable = true,
  syncStatus = 'idle', // 'idle', 'syncing', 'success', 'error'
}) {
  const buttonClass = `px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
  }`;

  const primaryButtonClass = `px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
    darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
  }`;

  const dangerButtonClass = `px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
    darkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
  }`;

  const successButtonClass = `px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
    darkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
  }`;

  const handleMarkAllAsRead = () => {
    if (isLoading || unreadCount === 0) return;
    console.log('📝 Marking all notifications as read...');
    onMarkAllAsRead();
  };

  const handleBulkDelete = () => {
    if (isLoading || selectedCount === 0) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedCount} notification${selectedCount > 1 ? 's' : ''}?`);

    if (confirmDelete) {
      console.log('🗑️ Bulk deleting notifications:', selectedCount);
      onBulkDelete();
    }
  };

  const handleRefresh = () => {
    if (isLoading) return;
    console.log('🔄 Refreshing notifications...');
    onRefresh();
  };

  const handleToggleSettings = () => {
    console.log('⚙️ Toggling settings panel...');
    onToggleSettings();
  };

  const handleClearSelection = () => {
    console.log('❌ Clearing selection...');
    onClearSelection();
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${darkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
          <Bell className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold">Notifications</h1>
            <div className="flex items-center gap-2">
              {!backendAvailable && (
                <span className="text-xs px-2 py-1 bg-yellow-500 text-white rounded-full flex items-center gap-1">
                  <WifiOff className="w-3 h-3" />
                  Offline
                </span>
              )}
              {backendAvailable && syncStatus === 'syncing' && (
                <span className="text-xs px-2 py-1 bg-blue-500 text-white rounded-full flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Syncing
                </span>
              )}
              {backendAvailable && syncStatus === 'error' && (
                <span className="text-xs px-2 py-1 bg-red-500 text-white rounded-full flex items-center gap-1">
                  <WifiOff className="w-3 h-3" />
                  Sync Failed
                </span>
              )}
              {backendAvailable && syncStatus === 'success' && (
                <span className="text-xs px-2 py-1 bg-green-500 text-white rounded-full flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  Synced
                </span>
              )}
            </div>
          </div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            {unreadCount > 0 ? (
              <>
                <span className="font-semibold">{unreadCount} unread</span>
                {totalCount > 0 && ` of ${totalCount} total`}
              </>
            ) : totalCount > 0 ? (
              `All ${totalCount} notifications read`
            ) : (
              'No notifications'
            )}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedCount > 0 ? (
          <>
            <button onClick={handleBulkDelete} disabled={isLoading} className={dangerButtonClass} title={`Delete ${selectedCount} selected notification${selectedCount > 1 ? 's' : ''}`}>
              <Trash2 className="w-4 h-4" />
              Delete ({selectedCount}){isLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
            </button>
            <button onClick={handleClearSelection} disabled={isLoading} className={buttonClass} title="Clear selection">
              <X className="w-4 h-4" />
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={handleMarkAllAsRead} disabled={isLoading || unreadCount === 0} className={primaryButtonClass} title={unreadCount === 0 ? 'All notifications are already read' : 'Mark all notifications as read'}>
              <CheckCircle className="w-4 h-4" />
              Mark All Read
              {isLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
            </button>
            <button onClick={handleRefresh} disabled={isLoading || syncStatus === 'syncing'} className={buttonClass} title="Refresh notifications from server">
              <RefreshCw className={`w-4 h-4 ${isLoading || syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              {syncStatus === 'syncing' ? 'Syncing...' : 'Refresh'}
            </button>
            <button onClick={handleToggleSettings} className={showSettings ? successButtonClass : buttonClass} title={showSettings ? 'Hide settings' : 'Show settings'}>
              <Settings className="w-4 h-4" />
              {showSettings ? 'Hide Settings' : 'Settings'}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
