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
import { ChevronLeft, Users } from "lucide-react";

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

interface DashboardData {
	total_users: number;
	total_balance: number;
	total_withdrawals: number;
	recent_users: User[];
	transactions: Transaction[];

	admin_stats: {
		current_count: number;
		max_allowed: number;
		slots_available: number;
	};
}

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
	const [showAllUsers, setShowAllUsers] = useState(false);
	const [loadingAllUsers, setLoadingAllUsers] = useState(false);

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
	}, [navigate]);

	const fetchDashboardData = async () => {
		try {
			setLoading(true);
			setError(null);

			const token = localStorage.getItem("admin_token");

			if (!token) {
				throw new Error("No authentication token found");
			}

			const response = await axios.get<{
				message: string;
				data: DashboardData;
			}>("http://127.0.0.1:8000/api/admin/dashboard", {
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/json",
				},
			});

			// Ensure we have the data and it's in the correct format
			if (!response.data || !response.data.data) {
				throw new Error("Invalid response format from server");
			}

			setDashboardData(response.data.data);
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

			const response = await axios.get<{
				message: string;
				users: User[];
			}>("http://127.0.0.1:8000/api/admin/users", {
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

	// Updated to use the new transaction processing page
	const handleProcessTransaction = (userId: number) => {
		navigate(`/admin/users/${userId}/update-balance`)
	}

	// const handleUpdateUser = (userId: number) => {
	// 	navigate(`/admin/users/${userId}/update-balance`);
	// };

	// const handleUpdateTransactions = (userId: number) => {
	// 	navigate(`/admin/users/${userId}/transactions`);
	// };

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
						"Authorization": `Bearer ${token}`, // Fixed template literal syntax
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

				<div className='bg-white shadow-md rounded-lg mb-8'>
					<div className='px-4 py-5 sm:px-6 flex justify-between items-center'>
						<h2 className='text-xl font-semibold text-gray-900'>
							{showAllUsers ? "All Users" : "Recent Users"}
						</h2>

						{showAllUsers ? (
							<Button
								variant='outline'
								onClick={() => setShowAllUsers(false)}
								className='flex items-center gap-2'>
								<ChevronLeft className='h-4 w-4' />
								Back to Recent Users
							</Button>
						) : (
							<Button
								variant='outline'
								onClick={fetchAllUsers}
								disabled={loadingAllUsers}
								className='flex items-center gap-2'>
								<Users className='h-4 w-4' />
								{loadingAllUsers ? "Loading..." : "View All Users"}
							</Button>
						)}
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
								{(showAllUsers ? allUsers : dashboardData?.recent_users).map(
									(user) => (
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
                          className="text-blue-600 hover:text-blue-900">
														Process Transaction
													</Button>
													{/* <Button
														variant='outline'
														size='sm'
														onClick={() => handleUpdateTransactions(user.id)}
														className='text-green-600 hover:text-green-900'>
														Transactions
													</Button> */}
													<Button
														variant='destructive'
														size='sm'
														onClick={() => confirmDeleteUser(user.id)}>
														Delete
													</Button>
												</div>
											</TableCell>
										</TableRow>
									),
								)}

							</TableBody>
						</Table>
					</div>
				</div>

				<div className='bg-white shadow-md rounded-lg'>
					<div className='px-4 py-5 sm:px-6 flex justify-between items-center'>
						<h2 className='text-xl font-semibold text-gray-900'>
							Recent Transactions
						</h2>
						<Button
							variant='outline'
							onClick={fetchDashboardData}>
							Refresh
						</Button>
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
								{dashboardData?.transactions.map((transaction) => (
									<TableRow key={transaction.id}>
										<TableCell>{transaction.user.name}</TableCell>
										{/* <TableCell>
										{dashboardData.recent_users.find(
											(user) => user.id === transaction.user_id,
										)?.name || "Unknown"}
									</TableCell> */}
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
			</main>

			<LogoutModal
				isOpen={showLogoutModal}
				onClose={() => setShowLogoutModal(false)}
				onConfirm={handleLogout}
				title='Confirm Admin Logout'
				description='Are you sure you want to logout from the admin dashboard?'
				// isAdmin
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





