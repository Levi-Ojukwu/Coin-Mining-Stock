/** @format */

//

/** @format */

"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FC } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { useAuth } from "../../contexts/AuthContex";
import LogoutModal from "../../components/LogoutModal";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModal";
import UpdateUserModal from "../../components/UpdateUserModal";
import { Button } from "../../components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../components/ui/table";
import { ChevronLeft, Users, RefreshCw, List, Eye } from "lucide-react";
import AdminNotificationBell from "../../components/AdminNotificationBell";

// Types
interface User {
	id: number;
	name: string;
	email: string;
	phone_number: number;
	balance: number;
	total_withdrawal: number;
	transactions?: Transaction[];
}

interface Transaction {
	id: number;
	user_id: number;
	type: string;
	amount: number;
	status: string;
	created_at: string;
	visible_to_user: boolean;
	user: {
		id: number;
		name: string;
		email: string;
	};
}

interface Notification {
	id: number;
	user_id?: number;
	type: string;
	title: string;
	message: string;
	data: any;
	is_read: boolean;
	created_at: string;
	user?: {
		id: number;
		name: string;
		email: string;
	};
}

interface DashboardData {
	total_users: number;
	total_balance: number;
	total_withdrawals: number;
	recent_users: User[];
	recent_transactions: Transaction[];
	recent_notifications: Notification[];
	admin_stats: {
		current_count: number;
		max_allowed: number;
		slots_available: number;
	};
	admin_unread_notifications_count?: number; // optional
}

const API_BASE = "http://127.0.0.1:8000/api";

const AdminDashboard: FC = () => {
	const navigate = useNavigate();
	// const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(
		null,
	);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const [allUsers, setAllUsers] = useState<User[]>([]);
	const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
	const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
	const [showAllUsers, setShowAllUsers] = useState(false);
	const [showAllTransactions, setShowAllTransactions] = useState(false);
	const [showAllNotifications, setShowAllNotifications] = useState(false);
	const [loadingAllUsers, setLoadingAllUsers] = useState(false);
	const [loadingAllTransactions, setLoadingAllTransactions] = useState(false);
	const [loadingAllNotifications, setLoadingAllNotifications] = useState(false);
	const [refreshingUsers, setRefreshingUsers] = useState(false);
	const [refreshingTransactions, setRefreshingTransactions] = useState(false);
	const [refreshingNotifications, setRefreshingNotifications] = useState(false);
	const [adminUnreadCount, setAdminUnreadCount] = useState(0);

	// Delete confirmation modals
	const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
	const [userToDelete, setUserToDelete] = useState<number | null>(null);
	const [showDeleteTransactionModal, setShowDeleteTransactionModal] =
		useState(false);
	const [transactionToDelete, setTransactionToDelete] = useState<number | null>(
		null,
	);

	useEffect(() => {
		const token = localStorage.getItem("admin_token");

		if (!token) {
			navigate("/admin/login");
			return;
		}

		fetchDashboardData();
		fetchRecentNotifications();
	}, [navigate]);

	const fetchDashboardData = async () => {
		try {
			setLoading(true);
			setError(null);

			const token = localStorage.getItem("admin_token");

			if (!token) {
				throw new Error("No authentication token found");
			}

			const response = await axios.get<{ message?: string; data?: any }>(
				`${API_BASE}/admin/dashboard`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: "application/json",
					},
				},
			);

			if (!response.data || !response.data.data) {
				throw new Error("Invalid response format from server");
			}

			const data = response.data.data as DashboardData;
			setDashboardData(data);

			// backend might return either admin_unread_notifications_count or data.unread_count
			const unreadFromDashboard =
				(data?.admin_unread_notifications_count as number) ||
				(response.data.data?.unread_count as number) ||
				0;
			setAdminUnreadCount(unreadFromDashboard);
			setError(null);
		} catch (err: any) {
			console.error("Dashboard fetch error:", err);
			const errorMessage =
				err.response?.data?.error ||
				err.message ||
				"Failed to load dashboard data";
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const fetchAllUsers = async () => {
		try {
			setLoadingAllUsers(true);
			const token = localStorage.getItem("admin_token");

			if (!token) {
				throw new Error("No authentication token found");
			}

			const response = await axios.get(`${API_BASE}/admin/users`, {
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/json",
				},
			});

			if (!response.data || !response.data.users) {
				throw new Error("Invalid response format from server");
			}

			setAllUsers(response.data.users);
			setShowAllUsers(true);
		} catch (err: any) {
			console.error("Failed to fetch all users:", err);
			const errorMessage =
				err.response?.data?.error || err.message || "Failed to load all users";
			toast.error(errorMessage);
		} finally {
			setLoadingAllUsers(false);
		}
	};

	const fetchAllTransactions = async () => {
		try {
			setLoadingAllTransactions(true);
			const token = localStorage.getItem("admin_token");

			if (!token) {
				throw new Error("No authentication token found");
			}

			const response = await axios.get(`${API_BASE}/admin/transactions`, {
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/json",
				},
			});

			if (!response.data || !response.data.transactions) {
				throw new Error("Invalid response format from server");
			}

			setAllTransactions(response.data.transactions);
			setShowAllTransactions(true);
		} catch (err: any) {
			console.error("Failed to fetch all transactions:", err);
			const errorMessage =
				err.response?.data?.error ||
				err.message ||
				"Failed to load all transactions";
			toast.error(errorMessage);
		} finally {
			setLoadingAllTransactions(false);
		}
	};

	const fetchAllNotifications = async () => {
		try {
			setLoadingAllNotifications(true);
			const token = localStorage.getItem("admin_token");

			if (!token) {
				throw new Error("No authentication token found");
			}

			const response = await axios.get(
				`${API_BASE}/admin/admin-notifications`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: "application/json",
					},
				},
			);

			// support both shapes: { data: { notifications: [] } } or { notifications: [] }
			const notifications =
				response.data?.data?.notifications ??
				response.data?.notifications ??
				[];

			if (!Array.isArray(notifications)) {
				throw new Error("Invalid response format from server");
			}

			setAllNotifications(notifications);
			setShowAllNotifications(true);
		} catch (err: any) {
			console.error("Failed to fetch all notifications:", err);
			const errorMessage =
				err.response?.data?.error ||
				err.message ||
				"Failed to load all notifications";
			toast.error(errorMessage);
		} finally {
			setLoadingAllNotifications(false);
		}
	};

	const fetchRecentNotifications = async () => {
		try {
			const token = localStorage.getItem("admin_token");
			if (!token) throw new Error("No authentication token found");

			const response = await axios.get(
				`${API_BASE}/admin/recent-notifications`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: "application/json",
					},
				},
			);

			// Safely handle data shape (could be response.data.data.notifications or response.data.notifications)
			const notifications =
				response.data?.data?.notifications ??
				response.data?.notifications ??
				[];

			if (!Array.isArray(notifications)) {
				throw new Error("Invalid response format from server");
			}

			// Update dashboardData using previous state
			setDashboardData((prev) =>
				prev
					? { ...prev, recent_notifications: notifications }
					: {
							total_users: 0,
							total_balance: 0,
							total_withdrawals: 0,
							recent_users: [],
							recent_transactions: [],
							recent_notifications: notifications,
							admin_stats: {
								current_count: 0,
								max_allowed: 0,
								slots_available: 0,
							},
					  },
			);
		} catch (error: any) {
			console.error("Error fetching recent notifications:", error);
			toast.error("Failed to load recent notifications");
		}
	};

	const refreshRecentUsers = async () => {
		try {
			setRefreshingUsers(true);
			const token = localStorage.getItem("admin_token");

			if (!token) {
				throw new Error("No authentication token found");
			}

			const response = await axios.get(`${API_BASE}/admin/dashboard`, {
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/json",
				},
			});

			if (response.data && dashboardData) {
				setDashboardData({
					...dashboardData,
					recent_users: response.data.data.recent_users,
				});
			}

			toast.success("Recent users refreshed successfully");
		} catch (err: any) {
			console.error("Failed to refresh users:", err);
			toast.error("Failed to refresh recent users");
		} finally {
			setRefreshingUsers(false);
		}
	};

	const refreshRecentTransactions = async () => {
		try {
			setRefreshingTransactions(true);
			const token = localStorage.getItem("admin_token");

			if (!token) {
				throw new Error("No authentication token found");
			}

			const response = await axios.get(`${API_BASE}/admin/dashboard`, {
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/json",
				},
			});

			if (response.data && dashboardData) {
				setDashboardData({
					...dashboardData,
					recent_transactions: response.data.data.recent_transactions,
				});
			}

			toast.success("Recent transactions refreshed successfully");
		} catch (err: any) {
			console.error("Failed to refresh transactions:", err);
			toast.error("Failed to refresh recent transactions");
		} finally {
			setRefreshingTransactions(false);
		}
	};

	const refreshRecentNotifications = async () => {
		try {
			setRefreshingNotifications(true);
			const token = localStorage.getItem("admin_token");

			if (!token) {
				throw new Error("No authentication token found");
			}

			const response = await axios.get(`${API_BASE}/admin/dashboard`, {
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/json",
				},
			});

			if (response.data && dashboardData) {
				setDashboardData({
					...dashboardData,
					recent_notifications: response.data.data.recent_notifications,
				});
			}

			toast.success("Recent notifications refreshed successfully");
		} catch (err: any) {
			console.error("Failed to refresh notifications:", err);
			toast.error("Failed to refresh recent notifications");
		} finally {
			setRefreshingNotifications(false);
		}
	};

	// Updated to use the new transaction processing page
	const handleProcessTransaction = (userId: number) => {
		navigate(`/admin/users/${userId}/update-balance`);
	};

	const handleLogout = async () => {
		try {
			const token = localStorage.getItem("admin_token");

			if (!token) {
				console.error("No admin token found");
				localStorage.clear(); // Clear all storage just in case
				toast.error("Session expired. Please login again.");
				navigate("/admin/login");
				return;
			}
			const response = await axios.post(
				"http://127.0.0.1:8000/api/admin/logout",
				{}, // Empty body
				{
					headers: {
						"Authorization": `Bearer ${token}`,
						"Accept": "application/json",
						"Content-Type": "application/json",
					},
				},
			);

			if (response.status === 200) {
				// Successful logout
				localStorage.removeItem("admin_token");
				localStorage.removeItem("admin_data");
				localStorage.removeItem("user"); // Remove user data if exists
				toast.success("Logged out successfully");
				navigate("/admin/login");
			}
		} catch (error: any) {
			console.error("Logout failed:", error);
			// toast.error("Failed to logout");

			// Handle different error scenarios
			if (error.response?.status === 401) {
				// Token is invalid or expired
				localStorage.removeItem("admin_token");
				localStorage.removeItem("admin_data");
				localStorage.removeItem("user");
				toast.warning("Your session has expired. Please login again.");
			} else {
				toast.error(
					"Failed to logout properly, but you've been logged out locally",
				);
			}

			// Always redirect to login on error
			navigate("/admin/login");
		} finally {
			setShowLogoutModal(false); // Close the modal regardless of outcome
		}
	};

	const confirmDeleteUser = (userId: number) => {
		setUserToDelete(userId);
		setShowDeleteUserModal(true);
	};

	const confirmDeleteTransaction = (transactionId: number) => {
		setTransactionToDelete(transactionId);
		setShowDeleteTransactionModal(true);
	};

	const handleDeleteUser = async () => {
		if (!userToDelete) return;
		try {
			const token = localStorage.getItem("admin_token");

			await axios.delete(
				`http://127.0.0.1:8000/api/admin/users/${userToDelete}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			toast.success("User deleted successfully");
			fetchDashboardData();

			// If we're viewing all users, update that list too
			if (showAllUsers) {
				setAllUsers(allUsers.filter((user) => user.id !== userToDelete));
			}
		} catch (error) {
			console.error("Failed to delete user:", error);
			toast.error("Failed to delete user");
		} finally {
			setShowDeleteUserModal(false);
			setUserToDelete(null);
		}
	};

	const handleDeleteTransaction = async () => {
		if (!transactionToDelete) return;
		try {
			const token = localStorage.getItem("admin_token");
			await axios.delete(
				`http://127.0.0.1:8000/api/admin/transactions/${transactionToDelete}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			toast.success("Transaction deleted successfully");
			fetchDashboardData();
		} catch (error) {
			console.error("Failed to delete transaction:", error);
			toast.error("Failed to delete transaction");
		} finally {
			setShowDeleteTransactionModal(false);
			setTransactionToDelete(null);
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-xl'>Loading dashboard...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-red-600'>{error}</div>
			</div>
		);
	}

	if (!dashboardData) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='text-xl'>No dashboard data available</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-200 pb-10'>
			<nav className='bg-white shadow-md mb-7'>
				<div className='max-w-7xl mx-auto px-10 sm:px-6 lg:px-8'>
					<div className='flex justify-between h-16'>
						<div className='flex items-center gap-3'>
							<h1 className='text-2xl font-bold text-primary'>
								Admin Dashboard
							</h1>
							<div className='flex items-center gap-4'>
								<span className='text-sm text-gray-600'>
									Admin slots: {dashboardData.admin_stats.current_count}/
									{dashboardData.admin_stats.max_allowed}
								</span>
							</div>
						</div>

						<div className='flex items-center'>
							<AdminNotificationBell
								unreadCount={adminUnreadCount}
								onNotificationUpdate={fetchDashboardData}
							/>
							<Button
								className='px-4 py-2 bg-red-600 text-red-500 rounded hover:bg-red-700 transition-colors'
								variant='outline'
								onClick={() => setShowLogoutModal(true)}>
								Logout
							</Button>
						</div>
					</div>
				</div>
			</nav>

			<main className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
				{error && (
					<div className='mb-4 p-4 text-red-700 bg-red-100 rounded-md'>
						{error}
					</div>
				)}

				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
					<div className='bg-white overflow-hidden shadow-sm rounded-lg p-6'>
						<div className='text-sm font-medium text-gray-500'>Total Users</div>
						<div className='mt-2  md:text-3xl font-semibold text-primary'>
							{dashboardData.total_users || 0}
						</div>
					</div>
					<div className='bg-white overflow-hidden shadow-sm rounded-lg p-6'>
						<div className='text-sm font-medium text-gray-500'>
							Total Balance
						</div>
						<div className='mt-2 text-3xl font-semibold text-gray-900'>
							${(Number(dashboardData?.total_balance) || 0).toFixed(2)}
						</div>
					</div>
					<div className='bg-white overflow-hidden shadow-sm rounded-lg p-6'>
						<div className='text-sm font-medium text-gray-500'>
							Total Withdrawals
						</div>
						<div className='mt-2 text-3xl font-semibold text-gray-900'>
							${(Number(dashboardData?.total_withdrawals) || 0).toFixed(2)}
						</div>
					</div>
				</div>

				{/* Users Section */}
				<div className='bg-gray-50 shadow-md rounded-lg mb-8'>
					<div className='px-4 py-5 sm:px-6 flex justify-between items-center'>
						<h2 className='text-xl font-semibold text-gray-900'>
							{showAllUsers ? "All Users" : "Recent Users"}
						</h2>

						<div className='flex gap-2'>
							{showAllUsers ? (
								<Button
									variant='outline'
									onClick={() => setShowAllUsers(false)}
									className='flex items-center gap-2'>
									<ChevronLeft className='h-4 w-4' />
									Back to Recent Users
								</Button>
							) : (
								<>
									<Button
										variant='outline'
										onClick={refreshRecentUsers}
										disabled={refreshingUsers}
										className='flex items-center gap-2 bg-transparent'>
										<RefreshCw
											className={`h-4 w-4 ${
												refreshingUsers ? "animate-spin" : ""
											}`}
										/>
										{refreshingUsers ? "Refreshing..." : "Refresh"}
									</Button>
									<Button
										variant='outline'
										onClick={fetchAllUsers}
										disabled={loadingAllUsers}
										className='flex items-center gap-2 bg-transparent'>
										<Users className='h-4 w-4' />
										{loadingAllUsers ? "Loading..." : "Show All Users"}
									</Button>
								</>
							)}
						</div>
					</div>

					<div className='overflow-x-auto'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Phone Number</TableHead>
									<TableHead>Balance</TableHead>
									<TableHead>Total Withdrawal</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{(showAllUsers
									? allUsers
									: dashboardData?.recent_users || []
								).map((user) => (
									<TableRow key={user.id}>
										<TableCell>{user.name}</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell>{Number(user.phone_number)}</TableCell>
										<TableCell>
											${(Number(user.balance) || 0).toFixed(2)}
										</TableCell>
										<TableCell>
											${(Number(user.total_withdrawal) || 0).toFixed(2)}
										</TableCell>
										<TableCell>
											<div className='flex flex-wrap gap-2'>
												<Button
													variant='outline'
													size='sm'
													onClick={() => handleProcessTransaction(user.id)}
													className='text-blue-600 hover:text-blue-900'>
													Process Transaction
												</Button>
												<Button
													variant='destructive'
													size='sm'
													onClick={() => confirmDeleteUser(user.id)}>
													Delete
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>

				{/* Transactions Section */}
				<div className='bg-gray-50 shadow-md rounded-lg mb-8'>
					<div className='px-4 py-5 sm:px-6 flex justify-between items-center'>
						<h2 className='text-xl font-semibold text-gray-900'>
							{showAllTransactions ? "All Transactions" : "Recent Transactions"}
						</h2>

						<div className='flex gap-2'>
							{showAllTransactions ? (
								<Button
									variant='outline'
									onClick={() => setShowAllTransactions(false)}
									className='flex items-center gap-2'>
									<ChevronLeft className='h-4 w-4' />
									Back to Recent Transactions
								</Button>
							) : (
								<>
									<Button
										variant='outline'
										onClick={refreshRecentTransactions}
										disabled={refreshingTransactions}
										className='flex items-center gap-2 bg-transparent'>
										<RefreshCw
											className={`h-4 w-4 ${
												refreshingTransactions ? "animate-spin" : ""
											}`}
										/>
										{refreshingTransactions ? "Refreshing..." : "Refresh"}
									</Button>
									<Button
										variant='outline'
										onClick={fetchAllTransactions}
										disabled={loadingAllTransactions}
										className='flex items-center gap-2 bg-transparent'>
										<List className='h-4 w-4' />
										{loadingAllTransactions
											? "Loading..."
											: "Show All Transactions"}
									</Button>
								</>
							)}
						</div>
					</div>

					<div className='overflow-x-auto'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>User</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Amount</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Visibility</TableHead>
									<TableHead>Date</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{(showAllTransactions
									? allTransactions
									: dashboardData?.recent_transactions || []
								).map((transaction) => (
									<TableRow key={transaction.id}>
										<TableCell>{transaction.user.name}</TableCell>
										<TableCell className='capitalize'>
											{transaction.type}
										</TableCell>
										<TableCell>
											<span
												className={
													transaction.type === "deposit"
														? "text-green-600"
														: "text-red-600"
												}>
												${Number(transaction.amount).toFixed(2)}
											</span>
										</TableCell>
										<TableCell className='capitalize'>
											{transaction.status}
										</TableCell>
										<TableCell>
											{transaction.visible_to_user ? "Visible" : "Hidden"}
										</TableCell>
										<TableCell>
											{new Date(transaction.created_at).toLocaleDateString()}
										</TableCell>
										<TableCell>
											<Button
												variant='destructive'
												size='sm'
												onClick={() =>
													confirmDeleteTransaction(transaction.id)
												}>
												Delete
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>

				{/* Recent Notifications Section */}
				<div className='bg-gray-50 shadow-md rounded-lg '>
					<div className='px-4 py-5 sm:px-6 flex justify-between items-center'>
						<h2 className='text-xl font-semibold text-gray-900'>
							{showAllNotifications
								? "All Notifications"
								: "Recent Notifications"}
						</h2>

						<div className='flex gap-2'>
							{showAllNotifications ? (
								<Button
									variant='outline'
									onClick={() => setShowAllNotifications(false)}
									className='flex items-center gap-2'>
									<ChevronLeft className='h-4 w-4' />
									Back to Recent Notifications
								</Button>
							) : (
								<>
									<Button
										variant='outline'
										onClick={refreshRecentNotifications}
										disabled={refreshingNotifications}
										className='flex items-center gap-2 bg-transparent'>
										<RefreshCw
											className={`h-4 w-4 ${
												refreshingNotifications ? "animate-spin" : ""
											}`}
										/>
										{refreshingNotifications ? "Refreshing..." : "Refresh"}
									</Button>
									<Button
										variant='outline'
										onClick={fetchAllNotifications}
										disabled={loadingAllNotifications}
										className='flex items-center gap-2 bg-transparent'>
										<Eye className='h-4 w-4' />
										{loadingAllNotifications
											? "Loading..."
											: "View All Notifications"}
									</Button>
								</>
							)}
						</div>
					</div>

					<div className='px-4 pb-4'>
						{(showAllNotifications
							? allNotifications
							: dashboardData?.recent_notifications || []
						).length > 0 ? (
							<div className='space-y-4'>
								{(showAllNotifications
									? allNotifications
									: dashboardData?.recent_notifications || []
								).map((notification) => (
									<div
										key={notification.id}
										className={`p-4 rounded-lg border-l-4 ${
											notification.type === "deposit"
												? "border-green-500 bg-green-50"
												: notification.type === "withdrawal"
												? "border-red-500 bg-red-50"
												: "border-blue-500 bg-blue-50"
										} ${!notification.is_read ? "ring-2 ring-blue-200" : ""}`}>
										<div className='flex justify-between items-start'>
											<div>
												<h3 className='font-semibold text-gray-800'>
													{notification.title}
												</h3>
												<p className='text-gray-600 mt-1'>
													{notification.message}
												</p>
												{notification.user ? (
													<p className='text-sm text-gray-500 mt-1'>
														User: {notification.user.name}
													</p>
												) : null}
												{/* <p className="text-sm text-gray-500 mt-1">User: {notification.user?.name}</p> */}
											</div>
											<div className='text-right'>
												<span className='text-sm text-gray-500'>
													{new Date(
														notification.created_at,
													).toLocaleDateString()}
												</span>
												{!notification.is_read && (
													<div className='mt-1'>
														<span className='inline-block w-2 h-2 bg-blue-500 rounded-full'></span>
														<span className='ml-2 text-sm text-blue-600'>
															New
														</span>
													</div>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className='text-center text-gray-500 py-8'>
								No notifications found
							</p>
						)}
					</div>
				</div>
			</main>

			<LogoutModal
				isOpen={showLogoutModal}
				onClose={() => setShowLogoutModal(false)}
				onConfirm={handleLogout}
				title='Confirm Admin Logout'
				description='Are you sure you want to logout from the admin dashboard?'
			/>

			{selectedUser && (
				<UpdateUserModal
					isOpen={showUpdateUserModal}
					onClose={() => setShowUpdateUserModal(false)}
					user={selectedUser}
					onUserUpdate={fetchDashboardData}
				/>
			)}

			<DeleteConfirmationModal
				isOpen={showDeleteUserModal}
				onClose={() => setShowDeleteUserModal(false)}
				onConfirm={handleDeleteUser}
				title='Delete User'
				description='Are you sure you want to delete this user?'
				itemType='user'
			/>

			<DeleteConfirmationModal
				isOpen={showDeleteTransactionModal}
				onClose={() => setShowDeleteTransactionModal(false)}
				onConfirm={handleDeleteTransaction}
				title='Delete Transaction'
				description='Are you sure you want to delete this transaction?'
				itemType='transaction'
			/>
		</div>
	);
};

export default AdminDashboard;
