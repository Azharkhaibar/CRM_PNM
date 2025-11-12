// src/features/Dashboard/pages/notification/provider/notification.provider.jsx
import React, { createContext, useContext } from 'react';
import { useUserNotifications } from '../hooks/notification.hook';
const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const notificationApi = useUserNotifications(); // run once per provider mount
  return <NotificationContext.Provider value={notificationApi}>{children}</NotificationContext.Provider>;
};

export const useNotificationContext = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotificationContext must be used within a NotificationProvider');
  return ctx;
};
