import { motion } from 'framer-motion';
import { Bell, CheckCircle, Trash2, Settings, X, RefreshCw } from 'lucide-react';

export default function NotificationHeader({ darkMode, unreadCount, totalCount, selectedCount, isLoading, showSettings, onMarkAllAsRead, onBulkDelete, onClearSelection, onToggleSettings, onRefresh, backendAvailable = true }) {
  const buttonClass = `px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
  }`;

  const primaryButtonClass = `px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
    darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
  }`;

  const dangerButtonClass = `px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
    darkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
  }`;

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${darkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
          <Bell className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Notifications</h1>
            {!backendAvailable && <span className="text-xs px-2 py-1 bg-yellow-500 text-white rounded-full">Offline</span>}
          </div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            {unreadCount} unread {totalCount > 0 && `of ${totalCount} total`}
            {totalCount === 0 && ' - No notifications'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedCount > 0 ? (
          <>
            <button onClick={onBulkDelete} disabled={isLoading} className={dangerButtonClass}>
              <Trash2 className="w-4 h-4" />
              Delete ({selectedCount}){isLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
            </button>
            <button onClick={onClearSelection} disabled={isLoading} className={buttonClass}>
              <X className="w-4 h-4" />
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={onMarkAllAsRead} disabled={isLoading || unreadCount === 0} className={primaryButtonClass}>
              <CheckCircle className="w-4 h-4" />
              Mark All Read
              {isLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
            </button>
            <button onClick={onRefresh} disabled={isLoading} className={buttonClass}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button onClick={onToggleSettings} className={buttonClass}>
              <Settings className="w-4 h-4" />
              {showSettings ? 'Hide Settings' : 'Settings'}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
