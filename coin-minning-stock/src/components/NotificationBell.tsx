"use client"

/** @format */

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { FiBell } from "react-icons/fi"
import { toast } from "react-toastify"

interface Notification {
  id: number
  type: string
  title: string
  message: string
  data: any
  is_read: boolean
  created_at: string
}

interface NotificationBellProps {
  unreadCount: number
  onNotificationUpdate: () => void
}

const NotificationBell: React.FC<NotificationBellProps> = ({ unreadCount, onNotificationUpdate }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      if (!token) return

      const response = await axios.get("http://127.0.0.1:8000/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      setNotifications(response.data.notifications)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) return

      await axios.post(
        `http://127.0.0.1:8000/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      )

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === notificationId ? { ...notif, is_read: true } : notif)),
      )

      onNotificationUpdate()
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) return

      await axios.post(
        "http://127.0.0.1:8000/api/notifications/mark-all-read",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      )

      // Update local state
      setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })))

      onNotificationUpdate()
      toast.success("All notifications marked as read")
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
      toast.error("Failed to mark all notifications as read")
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return "💰"
      case "withdrawal":
        return "💸"
      case "transaction":
        return "📊"
      default:
        return "📢"
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-primary transition-colors"
      >
        <FiBell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="text-sm text-primary hover:underline">
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                    !notification.is_read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => {
                    if (!notification.is_read) {
                      markAsRead(notification.id)
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">{notification.title}</p>
                        <span className="text-xs text-gray-500">{formatTimeAgo(notification.created_at)}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      {!notification.is_read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>}
    </div>
  )
}

export default NotificationBell
