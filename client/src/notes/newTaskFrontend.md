stores/notificationstores.ts

// stores/notificationStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Notification {
  id: string
  userId: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  timestamp: Date
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  getNotificationsByUser: (userId: string) => Notification[]
  getUnreadByUser: (userId: string) => number
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          read: false
        }
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1
        }))
      },
      
      markAsRead: (id: string) => {
        set((state) => ({
          notifications: state.notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }))
      },
      
      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(notif => ({ ...notif, read: true })),
          unreadCount: 0
        }))
      },
      
      removeNotification: (id: string) => {
        set((state) => {
          const notificationToRemove = state.notifications.find(n => n.id === id)
          return {
            notifications: state.notifications.filter(notif => notif.id !== id),
            unreadCount: notificationToRemove && !notificationToRemove.read 
              ? state.unreadCount - 1 
              : state.unreadCount
          }
        })
      },
      
      clearAll: () => {
        set({ notifications: [], unreadCount: 0 })
      },
      
      getNotificationsByUser: (userId: string) => {
        return get().notifications.filter(notif => notif.userId === userId)
      },
      
      getUnreadByUser: (userId: string) => {
        return get().notifications.filter(notif => 
          notif.userId === userId && !notif.read
        ).length
      }
    }),
    {
      name: 'notification-storage'
    }
  )
)

## ---------------------------------------------------------------------------

hook/useUserNotification.ts

// hooks/useUserNotifications.ts
import { useNotificationStore } from '../stores/notificationStore'
import { useAuth } from './useAuth' // Your auth hook

export const useUserNotifications = () => {
  const { user } = useAuth()
  const {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification
  } = useNotificationStore()

  const userNotifications = notifications.filter(
    notif => notif.userId === user?.id
  )

  const userUnreadCount = userNotifications.filter(notif => !notif.read).length

  const addUserNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'userId'>) => {
    if (!user) return
    
    addNotification({
      ...notification,
      userId: user.id
    })
  }

  return {
    notifications: userNotifications,
    unreadCount: userUnreadCount,
    addNotification: addUserNotification,
    markAsRead,
    markAllAsRead,
    removeNotification
  }
}

## -------------------------------------------------------------------

service/notificationservices.ts

// services/notificationService.ts
import { useNotificationStore } from '../stores/notificationStore'

export class NotificationService {
  static initializeRealTimeListeners(userId: string) {
    // WebSocket atau SSE connection
    const eventSource = new EventSource(`/api/notifications/stream?userId=${userId}`)
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      useNotificationStore.getState().addNotification({
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message
      })
    }

    return () => eventSource.close()
  }

  static async fetchUserNotifications(userId: string) {
    const response = await fetch(`/api/notifications/${userId}`)
    return response.json()
  }
}

## ----------------------------------------------------------------

component/notifificationbell.jsx

// components/NotificationBell.tsx
import { useUserNotifications } from '../hooks/useUserNotifications'

export const NotificationBell = () => {
  const { unreadCount, notifications, markAsRead } = useUserNotifications()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-sm text-blue-500"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.map(notification => (
              <NotificationItem 
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}