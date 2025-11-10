import { useAuth } from '../../../../auth/hooks/useAuth.hook';
import { useNotificationStore } from '../stores/notification.stores';

export const useUserNotifications = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, addNotification, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();

  const userNotifications = notifications.filter((n) => n.userId === user?.user_id?.toString());

  const userUnreadCount = userNotifications.filter((notif) => !notif.read).length;

  const addUserNotification = (notification: { type: 'info' | 'success' | 'warning' | 'error'; title: string; message: string }) => {
    if (!user?.user_id) return;

    addNotification({
      ...notification,
      userId: user.user_id.toString(), 
    });
  };

  return {
    notifications: userNotifications,
    unreadCount: userUnreadCount,
    addNotification: addUserNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
  };
};
