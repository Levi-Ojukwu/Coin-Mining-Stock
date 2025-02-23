"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import  toast  from "sooner"
import { useAuth } from "../../contexts/Authcontex"
import LogoutModal from "../../components/LogoutModal"
import { Button } from "../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"

// Types
interface User {
  id: number
  name: string
  email: string
  balance: number
  total_withdrawal: number
  transactions?: Transaction[]
}

interface Transaction {
  id: number
  user_id: number
  type: string
  amount: number
  status: string
  created_at: string
}

interface DashboardData {
  total_users: number
  total_balance: number
  total_withdrawals: number
  recent_users: User[]
  transactions: Transaction[]
}

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [updateAmount, setUpdateAmount] = useState("")
  const [transactionType, setTransactionType] = useState("deposit")
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // useEffect(() => {
  //   const token = localStorage.getItem("admin_token")
  //   if (!token) {
  //     navigate("/admin/login")
  //     return
  //   }

  //   fetchDashboardData()
  // }, [navigate])

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin/login")
      return
    }
    fetchDashboardData()
  }, [user, navigate])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      // const response = await axios.get("http://127.0.0.1:8000/api/admin/dashboard", {
      //   headers: { Authorization: `Bearer ${token}` },
      // })

      const response = await axios.get<{ message: string; data: DashboardData }>(
        "http://127.0.0.1:8000/api/admin/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      setDashboardData(response.data.data)
      setError(null)
      // setUsers(response.data.data.recent_users)
      // setTransactions(response.data.data.transactions || [])
      // setLoading(false)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
      setError("Failed to fetch dashboard data")
      toast.error("Failed to fetch dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBalance = async (userId: number) => {
    try {
      const token = localStorage.getItem("admin_token")
      await axios.post(
        `http://127.0.0.1:8000/api/admin/users/${userId}/update-balance`,
        {
          amount: Number.parseFloat(updateAmount),
          type: transactionType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      setShowUpdateModal(false)
      setUpdateAmount("")
      fetchDashboardData()
      setError(null)
    } catch (error) {
      console.error("Failed to update balance:", error)
      setError("Failed to update balance")
    }
  }

  const handleAddTransaction = async (userId: number) => {
    try {
      const token = localStorage.getItem("admin_token")
      await axios.post(
        `http://127.0.0.1:8000/api/admin/transactions`,
        {
          user_id: userId,
          type: transactionType,
          amount: Number.parseFloat(updateAmount),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      setShowTransactionModal(false)
      setUpdateAmount("")
      fetchDashboardData()
      setError(null)
    } catch (error) {
      console.error("Failed to add transaction:", error)
      setError("Failed to add transaction")
    }
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.post(
        "http://127.0.0.1:8000/api/admin/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      toast.success("Logged out successfully")
      navigate("/admin/login")
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Failed to logout")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    // <div className="min-h-screen bg-gray-100">
    //   {/* Navigation */}
    //   <nav className="bg-white shadow-md">
    //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //       <div className="flex justify-between h-16">
    //         <div className="flex items-center">
    //           <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
    //         </div>
    //         <div className="flex items-center">
    //           <button
    //             onClick={handleLogout}
    //             className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    //           >
    //             Logout
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </nav>

    //   <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    //     {error && <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">{error}</div>}

    //     {/* Summary Cards */}
    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    //       <div className="bg-white overflow-hidden shadow-sm rounded-lg">
    //         <div className="p-6">
    //           <div className="text-sm font-medium text-gray-500">Total Users</div>
    //           <div className="mt-2 text-3xl font-semibold text-gray-900">{dashboardData?.total_users}</div>
    //         </div>
    //       </div>
    //       <div className="bg-white overflow-hidden shadow-sm rounded-lg">
    //         <div className="p-6">
    //           <div className="text-sm font-medium text-gray-500">Total Balance</div>
    //           <div className="mt-2 text-3xl font-semibold text-gray-900">
    //             {/* ${dashboardData?.total_balance.toFixed(2)} */}
    //           </div>
    //         </div>
    //       </div>
    //       <div className="bg-white overflow-hidden shadow-sm rounded-lg">
    //         <div className="p-6">
    //           <div className="text-sm font-medium text-gray-500">Total Withdrawals</div>
    //           <div className="mt-2 text-3xl font-semibold text-gray-900">
    //             {/* ${dashboardData?.total_withdrawals.toFixed(2)} */}
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     {/* Users Table */}
    //     <div className="bg-white shadow-md rounded-lg mb-8 overflow-hidden">
    //       <div className="px-4 py-5 sm:px-6">
    //         <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
    //       </div>
    //       <div className="overflow-x-auto">
    //         <table className="min-w-full divide-y divide-gray-200">
    //           <thead className="bg-gray-50">
    //             <tr>
    //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                 Name
    //               </th>
    //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                 Email
    //               </th>
    //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                 Balance
    //               </th>
    //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                 Total Withdrawal
    //               </th>
    //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                 Actions
    //               </th>
    //             </tr>
    //           </thead>
    //           <tbody className="bg-white divide-y divide-gray-200">
    //             {users.map((user) => (
    //               <tr key={user.id}>
    //                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
    //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
    //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"></td>
    //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      
    //                 </td>
    //                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
    //                   <button
    //                     onClick={() => {
    //                       setSelectedUser(user)
    //                       setShowUpdateModal(true)
    //                     }}
    //                     className="text-blue-600 hover:text-blue-900 mr-4"
    //                   >
    //                     Update Balance
    //                   </button>
    //                   <button
    //                     onClick={() => {
    //                       setSelectedUser(user)
    //                       setShowTransactionModal(true)
    //                     }}
    //                     className="text-green-600 hover:text-green-900"
    //                   >
    //                     Add Transaction
    //                   </button>
    //                 </td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //       </div>
    //     </div>

    //     {/* Transactions Table */}
    //     <div className="bg-white shadow-md rounded-lg overflow-hidden">
    //       <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
    //         <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
    //         <button
    //           onClick={fetchDashboardData}
    //           className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
    //         >
    //           Refresh
    //         </button>
    //       </div>
    //       <div className="overflow-x-auto">
    //         <table className="min-w-full divide-y divide-gray-200">
    //           <thead className="bg-gray-50">
    //             <tr>
    //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                 Transaction ID
    //               </th>
    //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                 User
    //               </th>
    //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                 Type
    //               </th>
    //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                 Amount
    //               </th>
    //               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                 Date
    //               </th>
    //             </tr>
    //           </thead>
    //           <tbody className="bg-white divide-y divide-gray-200">
    //             {transactions.map((transaction) => (
    //               <tr key={transaction.id}>
    //                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
    //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    //                   {users.find((user) => user.id === transaction.user_id)?.name || "Unknown"}
    //                 </td>
    //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{transaction.type}</td>
    //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
    //                   ${transaction.amount.toFixed(2)}
    //                 </td>
    //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    //                   {new Date(transaction.created_at).toLocaleDateString()}
    //                 </td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //       </div>
    //     </div>
    //   </main>

    //   {/* Update Balance Modal */}
    //   {showUpdateModal && (
    //     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
    //       <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
    //         <div className="mt-3">
    //           <h3 className="text-lg font-medium text-gray-900">Update User Balance</h3>
    //           <div className="mt-2 space-y-4">
    //             <div>
    //               <label className="block text-sm font-medium text-gray-700">Amount</label>
    //               <input
    //                 type="number"
    //                 value={updateAmount}
    //                 onChange={(e) => setUpdateAmount(e.target.value)}
    //                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    //               />
    //             </div>
    //             <div>
    //               <label className="block text-sm font-medium text-gray-700">Type</label>
    //               <select
    //                 value={transactionType}
    //                 onChange={(e) => setTransactionType(e.target.value)}
    //                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    //               >
    //                 <option value="deposit">Deposit</option>
    //                 <option value="withdrawal">Withdrawal</option>
    //               </select>
    //             </div>
    //             <div className="flex justify-end space-x-3">
    //               <button
    //                 onClick={() => setShowUpdateModal(false)}
    //                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
    //               >
    //                 Cancel
    //               </button>
    //               <button
    //                 onClick={() => selectedUser && handleUpdateBalance(selectedUser.id)}
    //                 className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
    //               >
    //                 Update Balance
    //               </button>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )}

    //   {/* Add Transaction Modal */}
    //   {showTransactionModal && (
    //     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
    //       <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
    //         <div className="mt-3">
    //           <h3 className="text-lg font-medium text-gray-900">Add Transaction</h3>
    //           <div className="mt-2 space-y-4">
    //             <div>
    //               <label className="block text-sm font-medium text-gray-700">Amount</label>
    //               <input
    //                 type="number"
    //                 value={updateAmount}
    //                 onChange={(e) => setUpdateAmount(e.target.value)}
    //                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    //               />
    //             </div>
    //             <div>
    //               <label className="block text-sm font-medium text-gray-700">Type</label>
    //               <select
    //                 value={transactionType}
    //                 onChange={(e) => setTransactionType(e.target.value)}
    //                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    //               >
    //                 <option value="deposit">Deposit</option>
    //                 <option value="withdrawal">Withdrawal</option>
    //                 <option value="transfer">Transfer</option>
    //               </select>
    //             </div>
    //             <div className="flex justify-end space-x-3">
    //               <button
    //                 onClick={() => setShowTransactionModal(false)}
    //                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
    //               >
    //                 Cancel
    //               </button>
    //               <button
    //                 onClick={() => selectedUser && handleAddTransaction(selectedUser.id)}
    //                 className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
    //               >
    //                 Add Transaction
    //               </button>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>

    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <Button variant="outline" onClick={() => setShowLogoutModal(true)}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
            <div className="text-sm font-medium text-gray-500">Total Users</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">{dashboardData?.total_users || 0}</div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
            <div className="text-sm font-medium text-gray-500">Total Balance</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">
              ${dashboardData?.total_balance.toFixed(2) || "0.00"}
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
            <div className="text-sm font-medium text-gray-500">Total Withdrawals</div>
            <div className="mt-2 text-3xl font-semibold text-gray-900">
              ${dashboardData?.total_withdrawals.toFixed(2) || "0.00"}
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Total Withdrawal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardData?.recent_users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>${user.balance.toFixed(2)}</TableCell>
                  <TableCell>${user.total_withdrawal.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="bg-white shadow-md rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <Button variant="outline" onClick={fetchDashboardData}>
              Refresh
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardData?.transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>
                    {dashboardData.recent_users.find((user) => user.id === transaction.user_id)?.name || "Unknown"}
                  </TableCell>
                  <TableCell className="capitalize">{transaction.type}</TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell className="capitalize">{transaction.status}</TableCell>
                  <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Admin Logout"
        description="Are you sure you want to logout from the admin dashboard?"
      />
    </div>
  )
}

export default AdminDashboard

