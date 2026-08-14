import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "system";
  createdAt: string; // ISO timestamp
  read: boolean;
}

interface NotificationStore {
  notifications: NotificationItem[];
  addNotification: (
    notification: Omit<NotificationItem, "id" | "createdAt" | "read">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "init-welcome",
    title: "Welcome to Ryuk 👋",
    message: "Your real-time bookmark and developer workspace is initialized.",
    type: "system",
    createdAt: new Date().toISOString(),
    read: false,
  },
];

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: initialNotifications,

      addNotification: (n) =>
        set((state) => ({
          notifications: [
            {
              ...n,
              id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...state.notifications.slice(0, 49), // keep max 50 recent notifications
          ],
        })),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            read: true,
          })),
        })),

      clearAll: () => set({ notifications: [] }),
    }),
    {
      name: "ryuk-notifications-storage-v1",
    }
  )
);

export default useNotificationStore;
