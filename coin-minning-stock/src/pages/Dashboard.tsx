"use client"

/** @format */

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "../contexts/AuthContex"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import {
  FiDollarSign,
  FiBriefcase,
  FiCreditCard,
  FiSend,
  FiLogOut,
  FiMenu,
  FiX,
  FiRefreshCw,
  FiList,
  FiTrash2,
  FiEye,
} from "react-icons/fi"
import { FaHandshake } from "react-icons/fa6"
import CoinlibWidget from "../components/CoinlibWidget"
import CryptoAddresses from "../components/CryptoAddresses"
import WithdrawalPage from "../components/WithdrawalPage"
import DefaultPlan from "../components/DefaultPlan"
import LogoutModal from "../components/LogoutModal"
import NotificationBell from "../components/NotificationBell"
import DeleteConfirmationModal from "../components/DeleteConfirmationModal"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// Define User type
interface User {
  id: number
  name: string
  email: string
  role: "user" | "admin"
  username: string
  phone_number?: string
  balance: number
  total_withdrawal: number
}

interface Transaction {
  id: number
  type: string
  amount: number
  status: string
  created_at: string
  description?: string
  visible_to_user: boolean
}

interface Notification {
  id: number
  type: string
  title: string
  message: string
  data: any
  is_read: boolean
  created_at: string
}

interface DashboardData {
  user: User
  balance: number
  totalBalance: number
  recent_transactions: Transaction[]
  recent_notifications: Notification[]
  unread_notifications_count: number
}

export default function Dashboard() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [activeNav, setActiveNav] = useState("dashboard")
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // States for managing all data
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([])
  const [allNotifications, setAllNotifications] = useState<Notification[]>([])
  const [showAllNotifications, setShowAllNotifications] = useState(false)
  const [loadingAllTransactions, setLoadingAllTransactions] = useState(false)
  const [loadingAllNotifications, setLoadingAllNotifications] = useState(false)
  const [refreshingTransactions, setRefreshingTransactions] = useState(false)
  const [refreshingNotifications, setRefreshingNotifications] = useState(false)

  // Delete confirmation modal
  const [showDeleteTransactionModal, setShowDeleteTransactionModal] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null)

  // Add these new states for notification deletion
  const [showDeleteNotificationModal, setShowDeleteNotificationModal] = useState(false)
  const [notificationToDelete, setNotificationToDelete] = useState<number | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login")
      return
    }
    fetchDashboardData()
  }, [navigate])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      console.log("Fetching dashboard data...")

      const response = await axios.get<DashboardData>("http://127.0.0.1:8000/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      console.log("Dashboard API Response:", response.data)

      if (!response.data) {
        throw new Error("Empty response from server")
      }

      setDashboardData(response.data)

      if (setUser && response.data.user) {
        setUser(response.data.user)
      }

      setError(null)
    } catch (error: any) {
      console.error("Dashboard data fetch error:", error)

      if (axios.isAxiosError(error)) {
        console.error("API Error Response:", error.response?.data)
        console.error("API Error Status:", error.response?.status)
      }

      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch dashboard data"
      setError(errorMessage)
      toast.error(errorMessage)

      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchAllTransactions = async () => {
    try {
      setLoadingAllTransactions(true)
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await axios.get<{ transactions: Transaction[] }>("http://127.0.0.1:8000/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      setAllTransactions(response.data.transactions)
    } catch (error: any) {
      console.error("Failed to fetch all transactions:", error)
      toast.error("Failed to load all transactions")
    } finally {
      setLoadingAllTransactions(false)
    }
  }

  const fetchAllNotifications = async () => {
    try {
      setLoadingAllNotifications(true)
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await axios.get<{ notifications: Notification[] }>("http://127.0.0.1:8000/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      setAllNotifications(response.data.notifications)
      setShowAllNotifications(true)
    } catch (error: any) {
      console.error("Failed to fetch all notifications:", error)
      toast.error("Failed to load all notifications")
    } finally {
      setLoadingAllNotifications(false)
    }
  }

  const refreshRecentTransactions = async () => {
    try {
      setRefreshingTransactions(true)
      await fetchDashboardData()
      toast.success("Transaction refreshed")
    } catch (error: any) {
      toast.error("Failed to refresh recent transactions")
    } finally {
      setRefreshingTransactions(false)
    }
  }

  const refreshRecentNotifications = async () => {
    try {
      setRefreshingNotifications(true)
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      // Fetch only dashboard data to get recent notifications
      const response = await axios.get<DashboardData>("http://127.0.0.1:8000/api/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.data && dashboardData) {
        // Update only the notifications part of dashboard data
        setDashboardData({
          ...dashboardData,
          recent_notifications: response.data.recent_notifications,
          unread_notifications_count: response.data.unread_notifications_count,
        })
      }

      toast.success("Notifications refreshed")
    } catch (error: any) {
      console.error("Failed to refresh notifications:", error)
      toast.error("Failed to refresh recent notifications")
    } finally {
      setRefreshingNotifications(false)
    }
  }

  const handleDeleteTransaction = async (transactionId: number) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      await axios.delete(`http://127.0.0.1:8000/api/transactions/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      toast.success("Transaction deleted successfully")

      // Update local state
      setAllTransactions(allTransactions.filter((t) => t.id !== transactionId))

      // Refresh dashboard data
      fetchDashboardData()
    } catch (error: any) {
      console.error("Failed to delete transaction:", error)
      toast.error("Failed to delete transaction")
    }
  }

  const confirmDeleteTransaction = (transactionId: number) => {
    setTransactionToDelete(transactionId)
    setShowDeleteTransactionModal(true)
  }

  const handleConfirmDeleteTransaction = async () => {
    if (transactionToDelete) {
      await handleDeleteTransaction(transactionToDelete)
      setShowDeleteTransactionModal(false)
      setTransactionToDelete(null)
    }
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)

      toast.success("Logged out successfully")
      navigate("/login")
    } catch (error: any) {
      console.error("Logout failed:", error)

      const errorMessage = error.response?.data?.message || error.message || "Failed to logout"
      toast.error(errorMessage)

      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
      navigate("/login")
    }
  }

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("No authentication token found")
      }

      await axios.delete(`http://127.0.0.1:8000/api/notifications/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      toast.success("Notification deleted successfully")

      // Update local state
      if (showAllNotifications) {
        setAllNotifications(allNotifications.filter((n) => n.id !== notificationId))
      }

      // Refresh dashboard data to update recent notifications
      await fetchDashboardData()
    } catch (error: any) {
      console.error("Failed to delete notification:", error)
      toast.error("Failed to delete notification")
    }
  }

  const confirmDeleteNotification = (notificationId: number) => {
    setNotificationToDelete(notificationId)
    setShowDeleteNotificationModal(true)
  }

  const handleConfirmDeleteNotification = async () => {
    if (notificationToDelete) {
      await handleDeleteNotification(notificationToDelete)
      setShowDeleteNotificationModal(false)
      setNotificationToDelete(null)
    }
  }

  // Load all transactions when transactions tab is accessed
  useEffect(() => {
    if (activeNav === "transactions" && allTransactions.length === 0) {
      fetchAllTransactions()
    }
  }, [activeNav])

  const renderContent = () => {
    switch (activeNav) {
      case "dashboard":
        return (
          <>
            <CoinlibWidget />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              <div className="bg-gradient-to-br from-[#e4f33d3c] to-[#00565c46] px-5 py-7 rounded-lg shadow-md">
                <h2 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-semibold mb-4">
                  User Information
                </h2>
                {dashboardData?.user && (
                  <>
                    <p className="text-gray-500">
                      <strong className="text-gray-800">Name:</strong> {dashboardData.user.name}
                    </p>
                    <p className="text-gray-500">
                      <strong className="text-gray-800">Email:</strong> {dashboardData.user.email}
                    </p>
                    <p className="text-gray-500">
                      <strong className="text-gray-800">Username:</strong> {dashboardData.user.username}
                    </p>
                    <p className="text-gray-500">
                      <strong className="text-gray-800">Phone Number:</strong> {dashboardData.user.phone_number}
                    </p>
                  </>
                )}
              </div>

              <div className="bg-gradient-to-br from-[#e4f33d3c] to-[#00565c46] px-5 py-7 rounded-lg shadow-md">
                <h2 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-semibold mb-4">
                  Current Balance
                </h2>
                <p className="text-3xl font-bold text-green-600">
                  ${Number(dashboardData?.user?.balance || 0).toFixed(2) || "0.00"}
                </p>
              </div>

              <div className="bg-gradient-to-br from-[#e4f33d3c] to-[#00565c46] px-5 py-7 rounded-lg shadow-md">
                <h2 className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-semibold mb-4">
                  Total Withdrawal
                </h2>
                <p className="text-3xl font-bold text-blue-600">
                  ${Number(dashboardData?.user?.total_withdrawal || 0).toFixed(2) || "0.00"}
                </p>
              </div>
            </div>

            {/* Recent Notifications Section */}
            <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-primary">
                  {showAllNotifications ? "All Notifications" : "Recent Notifications"}
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={refreshRecentNotifications}
                    disabled={refreshingNotifications}
                    className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 disabled:opacity-50"
                  >
                    <FiRefreshCw className={refreshingNotifications ? "animate-spin" : ""} />
                    Refresh
                  </button>
                  {!showAllNotifications ? (
                    <button
                      onClick={fetchAllNotifications}
                      disabled={loadingAllNotifications}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-600 rounded hover:bg-green-200 disabled:opacity-50"
                    >
                      <FiEye />
                      {loadingAllNotifications ? "Loading..." : "View All Notifications"}
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowAllNotifications(false)}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                    >
                      Show Recent
                    </button>
                  )}
                </div>
              </div>

              {(showAllNotifications ? allNotifications : dashboardData?.recent_notifications) &&
              (showAllNotifications ? allNotifications : dashboardData?.recent_notifications)!.length > 0 ? (
                <div className="space-y-4">
                  {(showAllNotifications ? allNotifications : dashboardData?.recent_notifications)!.map(
                    (notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          notification.type === "deposit"
                            ? "border-green-500 bg-green-50"
                            : notification.type === "withdrawal"
                              ? "border-red-500 bg-red-50"
                              : "border-blue-500 bg-blue-50"
                        } ${!notification.is_read ? "ring-2 ring-blue-200" : ""}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                            <p className="text-gray-600 mt-1">{notification.message}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {!notification.is_read && (
                          <div className="mt-2">
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                            <span className="ml-2 text-sm text-blue-600">New</span>
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-center text-gray-500">No notifications found</p>
              )}
            </div>

            {/* Recent Transactions Section */}
            {dashboardData?.recent_transactions && dashboardData.recent_transactions.length > 0 && (
              <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-primary">Recent Transactions</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={refreshRecentTransactions}
                      disabled={refreshingTransactions}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 disabled:opacity-50"
                    >
                      <FiRefreshCw className={refreshingTransactions ? "animate-spin" : ""} />
                      Refresh
                    </button>

                    <button
                      onClick={() => setActiveNav("transactions")}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-600 rounded hover:bg-green-200"
                    >
                      <FiList />
                      View All Transactions
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData.recent_transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap capitalize">{transaction.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={transaction.type === "deposit" ? "text-green-600" : "text-red-600"}>
                              ${Number(transaction.amount).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap capitalize">{transaction.status}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )
      case "transactions":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-primary">All Transactions</h2>
              <button
                onClick={fetchAllTransactions}
                disabled={loadingAllTransactions}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded hover:bg-blue-200 disabled:opacity-50"
              >
                <FiRefreshCw className={loadingAllTransactions ? "animate-spin" : ""} />
                {loadingAllTransactions ? "Loading..." : "Refresh"}
              </button>
            </div>

            {allTransactions && allTransactions.length > 0 ? (
              <div className="w-full">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] divide-y divide-gray-900">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {allTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-100">
                          <td className="px-6 py-4 whitespace-nowrap">{transaction.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap capitalize">{transaction.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={transaction.type === "deposit" ? "text-green-600" : "text-red-600"}>
                              ${Number(transaction.amount).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap capitalize">{transaction.status}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => confirmDeleteTransaction(transaction.id)}
                              className="text-red-600 hover:text-red-900 flex items-center gap-1"
                            >
                              <FiTrash2 size={16} />
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500">No transactions found</p>
            )}
          </div>
        )
      case "transfer":
        return <CryptoAddresses />
      case "withdrawals":
        return (
          <div className="bg-gradient-to-br from-[#00565c4f] to-red-100 p-8 rounded-lg shadow-md">
            <WithdrawalPage />
          </div>
        )
      case "investments":
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Investment Plans</h2>
            <DefaultPlan />
          </div>
        )
      default:
        return <div>Select an option from the sidebar</div>
    }
  }

  const sidebarContent = (
    <nav>
      <div className="mb-10">
        <p className="text-secondary flex py-1 lg:py-0 font-serif text-2xl">
          <span>CMS.</span>
        </p>
      </div>
      <ul className="space-y-2">
        {[
          { name: "dashboard", icon: FiDollarSign, label: "Dashboard" },
          { name: "transactions", icon: FiCreditCard, label: "Transactions" },
          { name: "transfer", icon: FiSend, label: "Deposit" },
          { name: "withdrawals", icon: FiBriefcase, label: "Withdrawals" },
          { name: "investments", icon: FiBriefcase, label: "Investment Plans" },
        ].map((item) => (
          <li key={item.name}>
            <button
              onClick={() => {
                setActiveNav(item.name)
                setIsMobileMenuOpen(false)
              }}
              className={`flex items-center space-x-2 p-2 rounded w-full text-left ${
                activeNav === item.name
                  ? "bg-gradient-to-r from-red-300 to-secondary text-primary"
                  : "hover:bg-gradient-to-r from-red-300 to-secondary hover:text-primary"
              }`}
            >
              <item.icon />
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setShowLogoutModal(true)}
        className="mt-8 flex items-center gap-2 p-2 hover:text-primary hover:bg-gradient-to-r from-red-300 to-secondary rounded w-full"
      >
        <FiLogOut />
        <span>Logout</span>
      </button>
    </nav>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex bg-[#00565c1f] min-h-screen">
      {/* Desktop and tablet sidebar */}
      <aside className="hidden lg:block bg-primary text-white w-64 min-h-screen p-8 pl-4 fixed left-0 top-0 bottom-0 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 right-4 z-20 p-2 bg-primary text-white rounded"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <aside className="lg:hidden fixed inset-0 bg-primary text-white w-full h-full z-10 p-8 pl-4 overflow-y-auto">
          {sidebarContent}
        </aside>
      )}

      {/* Main content */}
      <main className="flex-1 p-8 lg:ml-64 overflow-x-auto">
        <div className="mb-10 flex justify-between items-end mr-5">
          <div>
            <h1 className="text-base lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-1">
              User Mining Dashboard
            </h1>
            {dashboardData?.user && (
              <div className="flex gap-1 items-center ml-2">
                <FaHandshake className="w-9 h-9 text-gray-600" />
                <p className="text-gray-600 font-semibold text-sm lg:text-xl">
                  <span>Welcome back, </span>
                  {dashboardData.user.name}! Your mining dashboard at a glance
                </p>
              </div>
            )}
          </div>

          {/* Notification Bell */}
          {dashboardData && (
            <NotificationBell
              unreadCount={dashboardData.unread_notifications_count || 0}
              onNotificationUpdate={fetchDashboardData}
            />
          )}
        </div>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {renderContent()}
      </main>

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogout} />

      <DeleteConfirmationModal
        isOpen={showDeleteTransactionModal}
        onClose={() => setShowDeleteTransactionModal(false)}
        onConfirm={handleConfirmDeleteTransaction}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        itemType="transaction"
      />

	  <DeleteConfirmationModal
        isOpen={showDeleteNotificationModal}
        onClose={() => setShowDeleteNotificationModal(false)}
        onConfirm={handleConfirmDeleteNotification}
        title="Delete Notification"
        description="Are you sure you want to delete this notification? This action cannot be undone."
        itemType="notification"
      />
    </div>
  )
}
