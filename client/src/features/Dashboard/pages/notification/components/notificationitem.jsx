import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, Settings, X } from 'lucide-react';

const IconComponent = ({ iconName, className }) => {
  const icons = {
    CheckCircle,
    AlertTriangle,
    Info,
    Settings,
  };

  const Icon = icons[iconName];
  return Icon ? <Icon className={className} /> : <Info className={className} />;
};

export default function NotificationItem({ notification, index, darkMode, isSelected, getNotificationIcon, getTypeColor, formatTime, onSelect, onMarkAsRead, onDelete }) {
  const cardClass = `rounded-2xl border transition-all duration-300 cursor-pointer ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} ${
    isSelected
      ? darkMode
        ? 'ring-2 ring-blue-500 bg-blue-900/20'
        : 'ring-2 ring-blue-500 bg-blue-50'
      : notification.read
      ? darkMode
        ? 'opacity-70 hover:opacity-100'
        : 'opacity-80 hover:opacity-100'
      : darkMode
      ? 'ring-1 ring-blue-400/30 bg-blue-900/10'
      : 'ring-1 ring-blue-200 bg-blue-50/50'
  }`;

  const { icon, color } = getNotificationIcon(notification.type);

  const handleMarkAsRead = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('📝 Marking notification as read:', notification.id);
    onMarkAsRead(notification.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const confirmDelete = window.confirm(`Are you sure you want to delete this notification?\n\n"${notification.title}"`);

    if (confirmDelete) {
      console.log('🗑️ Deleting notification:', notification.id);
      onDelete(notification.id);
    }
  };

  const handleSelect = (e) => {
    if (e.target.type === 'checkbox') {
      console.log('🔘 Selecting notification:', notification.id, 'checked:', e.target.checked);
      onSelect(notification.id, e.target.checked);
    }
  };

  const handleCardClick = (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.type === 'checkbox') {
      return;
    }

    console.log('🟦 Toggling notification selection:', notification.id);
    onSelect(notification.id, !isSelected);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.9 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cardClass}
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            onClick={(e) => e.stopPropagation()} // Prevent card click ketika checkbox diklik
            className="mt-1.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer"
          />
          <div className="flex-shrink-0 mt-0.5">
            <IconComponent iconName={icon} className={`w-5 h-5 ${color}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`font-semibold text-base leading-tight ${!notification.read ? 'font-bold' : ''}`}>{notification.title}</h3>
                {notification.category && <span className={`text-xs px-2 py-1 rounded-full border ${getTypeColor(notification.type)}`}>{notification.category}</span>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatTime(notification.timestamp)}</span>
                {!notification.read && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>}
              </div>
            </div>

            <p className={`mb-3 text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{notification.message}</p>

            {notification.metadata && Object.keys(notification.metadata).length > 0 && (
              <div className="mb-3 p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                <details className="text-xs">
                  <summary className="cursor-pointer font-medium">📊 Additional Details ({Object.keys(notification.metadata).length})</summary>
                  <div className="mt-2 space-y-1">
                    {Object.entries(notification.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                        <span className="text-gray-600 dark:text-gray-400">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}

            <div className="flex items-center gap-2">
              {!notification.read && (
                <button
                  onClick={handleMarkAsRead}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={handleDelete}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-1 ${
                  darkMode ? 'bg-red-900/50 hover:bg-red-800 text-red-300 hover:text-white' : 'bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-900'
                }`}
              >
                <X className="w-3 h-3" />
                Delete
              </button>

              {/* Status badges */}
              {notification.metadata?.is_fallback && <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-700'}`}>Local</span>}
              {notification.metadata?.activity_type && <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>{notification.metadata.activity_type}</span>}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
