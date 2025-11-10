import { useState } from 'react';
import { useUserNotifications } from '../hooks/useUserNotifications';

export const NotificationBell = () => {
  const { unreadCount, notifications, markAsRead } = useUserNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2">
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-sm text-blue-500">
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} onMarkAsRead={markAsRead} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
