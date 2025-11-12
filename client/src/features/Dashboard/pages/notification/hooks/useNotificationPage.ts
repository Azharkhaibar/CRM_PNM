import { useState, useMemo, useCallback } from 'react';
import { Notification } from '../stores/notification.stores';

interface UseNotificationPageProps {
  notifications: Notification[];
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
}

interface UseNotificationPageReturn {
  // State
  filteredNotifications: Notification[];
  categories: string[];
  filter: string;
  categoryFilter: string;
  searchTerm: string;
  selectedNotifications: string[];
  showSettings: boolean;

  // Setters
  setFilter: (filter: string) => void;
  setCategoryFilter: (category: string) => void;
  setSearchTerm: (searchTerm: string) => void;
  setSelectedNotifications: (selected: string[]) => void;
  setShowSettings: (show: boolean) => void;

  // Actions
  handleMarkAsRead: (id: string) => Promise<void>;
  handleMarkAllAsRead: () => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleBulkDelete: () => Promise<void>;
  handleSelectNotification: (id: string) => void;
  handleSelectAll: () => void;

  // Utilities
  getNotificationIcon: (type: string) => { icon: string; color: string };
  getTypeColor: (type: string) => string;
  formatTime: (date: Date) => string;
}

export const useNotificationPage = ({ notifications, markAsRead, markAllAsRead, removeNotification }: UseNotificationPageProps): UseNotificationPageReturn => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      const matchesFilter = filter === 'all' || (filter === 'unread' && !notif.read) || (filter === 'read' && notif.read);

      const matchesCategory = categoryFilter === 'all' || notif.category === categoryFilter;

      const matchesSearch = searchTerm === '' || notif.title?.toLowerCase().includes(searchTerm.toLowerCase()) || notif.message?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesCategory && matchesSearch;
    });
  }, [notifications, filter, categoryFilter, searchTerm]);

  const categories = useMemo(() => [...new Set(notifications.map((n) => n.category).filter(Boolean))] as string[], [notifications]);

  const getNotificationIcon = useCallback((type: string) => {
    switch (type) {
      case 'success':
        return { icon: 'CheckCircle', color: 'text-green-500' };
      case 'warning':
        return { icon: 'AlertTriangle', color: 'text-yellow-500' };
      case 'error':
        return { icon: 'AlertTriangle', color: 'text-red-500' };
      case 'system':
        return { icon: 'Settings', color: 'text-blue-500' };
      default:
        return { icon: 'Info', color: 'text-blue-500' };
    }
  }, []);

  const getTypeColor = useCallback((type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      case 'system':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  }, []);

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      try {
        await markAsRead(id);
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    },
    [markAsRead]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, [markAllAsRead]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await removeNotification(id);
        setSelectedNotifications((prev) => prev.filter((item) => item !== id));
      } catch (error) {
        console.error('Failed to delete notification:', error);
      }
    },
    [removeNotification]
  );

  const handleBulkDelete = useCallback(async () => {
    try {
      await Promise.all(selectedNotifications.map((id) => removeNotification(id)));
      setSelectedNotifications([]);
    } catch (error) {
      console.error('Failed to delete notifications:', error);
    }
  }, [selectedNotifications, removeNotification]);

  const handleSelectNotification = useCallback((id: string) => {
    setSelectedNotifications((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map((n) => n.id));
    }
  }, [selectedNotifications.length, filteredNotifications]);

  const formatTime = useCallback((date: Date) => {
    if (!date) return 'Unknown';
    const now = new Date();
    const notificationDate = new Date(date);
    const diff = now.getTime() - notificationDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return notificationDate.toLocaleDateString();
  }, []);

  return {
    filteredNotifications,
    categories,
    filter,
    categoryFilter,
    searchTerm,
    selectedNotifications,
    showSettings,
    setFilter,
    setCategoryFilter,
    setSearchTerm,
    setSelectedNotifications,
    setShowSettings,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleDelete,
    handleBulkDelete,
    handleSelectNotification,
    handleSelectAll,
    getNotificationIcon,
    getTypeColor,
    formatTime,
  };
};
