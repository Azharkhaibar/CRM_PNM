import { useNotificationStore } from '../stores/notification.stores';
export class NotificationService {
  static initializeRealTimeListeners(userId: string) {
    const eventSource = new EventSource(`/api/notifications/stream?userId=${userId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      useNotificationStore.getState().addNotification({
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
      });
    };

    return () => eventSource.close();
  }

  static async fetchUserNotifications(userId: string) {
    const response = await fetch(`/api/notifications/${userId}`);
    return response.json();
  }
}
