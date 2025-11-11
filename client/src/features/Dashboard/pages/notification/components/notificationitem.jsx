import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, Settings } from 'lucide-react';

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
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <input type="checkbox" checked={isSelected} onChange={onSelect} className="mt-1.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2" />

          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <IconComponent iconName={icon} className={`w-5 h-5 ${color}`} />
          </div>

          {/* Content */}
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

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!notification.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead();
                  }}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                  darkMode ? 'bg-red-900/50 hover:bg-red-800 text-red-300 hover:text-white' : 'bg-red-100 hover:bg-red-200 text-red-700 hover:text-red-900'
                }`}
              >
                Delete
              </button>

              {/* Metadata badge jika ada */}
              {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                <span className={`text-xs px-2 py-1 rounded ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>+{Object.keys(notification.metadata).length} details</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
