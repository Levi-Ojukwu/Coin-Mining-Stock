/** @format */

"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { FC } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../contexts/AuthContex";
import LogoutModal from "../../components/LogoutModal";
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

// Types
interface User {
	id: number;
	name: string;
	email: string;
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
}

interface DashboardData {
	total_users: number;
	total_balance: number;
	total_withdrawals: number;
	recent_users: User[];
	transactions: Transaction[];
}

const AdminDashboard: FC = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(
		null,
	);
	// const [users, setUsers] = useState<User[]>([]);
	// const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [updateAmount, setUpdateAmount] = useState("");
	const [transactionType, setTransactionType] = useState("deposit");
	const [showUpdateUserModal, setShowUpdateUserModal] = useState(false)
	const [showTransactionModal, setShowTransactionModal] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const [showUserManagementModal, setShowUserManagementModal] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("admin_token");

		// if (user === null) {
		// 	navigate("/admin/login");
		// 	return;
		// }

		// if (user.role !== "admin") {
		// 	navigate("/");
		// 	return;
		// }

		if (!token) {
			navigate("/admin/login");
			return;
		}

		fetchDashboardData();
	}, [user, navigate]);

	const fetchDashboardData = async () => {
		try {
			const token = localStorage.getItem("admin_token");

			const response = await axios.get<{
				message: string;
				data: DashboardData;
			}>("http://127.0.0.1:8000/api/admin/dashboard", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setDashboardData(response.data.data);
			setError(null);
		} catch (error) {
			console.error("Failed to fetch dashboard data:", error);
			setError("Failed to fetch dashboard data");
			toast.error("Failed to fetch dashboard data");
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateBalance = async (userId: number) => {
		try {
			const token = localStorage.getItem("admin_token");
			await axios.post(
				`http://127.0.0.1:8000/api/admin/users/${userId}/update-balance`,
				{
					amount: Number.parseFloat(updateAmount),
					type: transactionType,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);

			// setShowUpdateModal(false);
			setUpdateAmount("");
			fetchDashboardData();
			setError(null);
		} catch (error) {
			console.error("Failed to update balance:", error);
			setError("Failed to update balance");
		}
	};

	const handleAddTransaction = async (userId: number) => {
		try {
			const token = localStorage.getItem("admin_token");
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
			);

			setShowTransactionModal(false);
			setUpdateAmount("");
			fetchDashboardData();
			setError(null);
		} catch (error) {
			console.error("Failed to add transaction:", error);
			setError("Failed to add transaction");
		}
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

	const handleDeleteUser = async (userId: number) => {
		if (window.confirm("Are you sure you want to delete this user?")) {
			try {
				const token = localStorage.getItem("admin_token");

				await axios.delete(`http://127.0.0.1:8000/api/admin/users/${userId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				toast.success("User deleted successfully");
				fetchDashboardData();
			} catch (error) {
				console.error("Failed to delete user:", error);
				toast.error("Failed to delete user");
			}
		}
	};

	const handleDeleteTransaction = async (transactionId: number) => {
		if (window.confirm("Are you sure you want to delete this transaction?")) {
			try {
				const token = localStorage.getItem("admin_token");
				await axios.delete(
					`http://127.0.0.1:8000/api/admin/transactions/${transactionId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					},
				);
				toast.success("Transaction deleted successfully");
				fetchDashboardData();
			} catch (error) {
				console.error("Failed to delete transaction:", error);
				toast.error("Failed to delete transaction");
			}
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500'></div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gray-100'>
			<nav className='bg-white shadow-md'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between h-16'>
						<div className='flex items-center'>
							<h1 className='text-2xl font-bold text-primary'>
								Admin Dashboard
							</h1>
						</div>

						<div className='flex items-center'>
							<Button
								variant='outline'
								onClick={() => setShowLogoutModal(true)}>
								Logout
							</Button>
						</div>
					</div>
				</div>
			</nav>

			<main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
				{error && (
					<div className='mb-4 p-4 text-red-700 bg-red-100 rounded-md'>
						{error}
					</div>
				)}

				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
					<div className='bg-white overflow-hidden shadow-sm rounded-lg p-6'>
						<div className='text-sm font-medium text-gray-500'>Total Users</div>
						<div className='mt-2 text-3xl font-semibold text-gray-900'>
							{dashboardData?.total_users || 0}
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
					<div className='px-4 py-5 sm:px-6'>
						<h2 className='text-xl font-semibold text-gray-900'>
							Recent Users
						</h2>
					</div>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Balance</TableHead>
								<TableHead>Total Withdrawal</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{dashboardData?.recent_users.map((user) => (
								<TableRow key={user.id}>
									<TableCell>{user.name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										${(Number(dashboardData?.total_balance) || 0).toFixed(2)}
									</TableCell>
									<TableCell>
										$$
										{(Number(dashboardData?.total_withdrawals) || 0).toFixed(2)}
									</TableCell>
									<TableCell>
										<Button
											variant='outline'
											size='sm'
											onClick={() => {
												setSelectedUser(user);
												setShowUpdateUserModal(true);
											}}>
											Update
										</Button>
										<Button
											variant='destructive'
											size='sm'
											onClick={() => handleDeleteUser(user.id)}
											className='ml-2'>
											Delete
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
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
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID</TableHead>
								<TableHead>User</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Date</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{dashboardData?.transactions.map((transaction) => (
								<TableRow key={transaction.id}>
									<TableCell>{transaction.id}</TableCell>
									<TableCell>
										{dashboardData.recent_users.find(
											(user) => user.id === transaction.user_id,
										)?.name || "Unknown"}
									</TableCell>
									<TableCell className='capitalize'>
										{transaction.type}
									</TableCell>
									<TableCell>${Number(transaction.amount).toFixed(2)}</TableCell>
									<TableCell className='capitalize'>
										{transaction.status}
									</TableCell>
									<TableCell>
										{new Date(transaction.created_at).toLocaleDateString()}
									</TableCell>
									<TableCell>
										<Button
											variant='destructive'
											size='sm'
											onClick={() => handleDeleteTransaction(transaction.id)}>
											Delete
										</Button>
									</TableCell>
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
				title='Confirm Admin Logout'
				description='Are you sure you want to logout from the admin dashboard?'
			/>

			<UpdateUserModal
				isOpen={showUpdateUserModal}
				onClose={() => setShowUpdateUserModal(false)}
				user={selectedUser}
				onUserUpdate={fetchDashboardData}
			/>
		</div>
	);
};

export default AdminDashboard;

// <div className='min-h-screen bg-gray-100'>
// 	<nav className='bg-white shadow-md'>
// 		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
// 			<div className='flex justify-between h-16'>
// 				<div className='flex items-center'>
// 					<h1 className='text-2xl font-bold text-primary'>
// 						Admin Dashboard
// 					</h1>
// 				</div>
// 				<div className='flex items-center'>
// 					<Button
// 						variant='outline'
// 						onClick={() => setShowLogoutModal(true)}>
// 						Logout
// 					</Button>
// 				</div>
// 			</div>
// 		</div>
// 	</nav>

// 	<main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
// 		{error && (
// 			<div className='mb-4 p-4 text-red-700 bg-red-100 rounded-md'>
// 				{error}
// 			</div>
// 		)}

// 		<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
// 			<div className='bg-white overflow-hidden shadow-sm rounded-lg p-6'>
// 				<div className='text-sm font-medium text-gray-500'>Total Users</div>
// 				<div className='mt-2 text-3xl font-semibold text-gray-900'>
// 					{dashboardData?.total_users || 0}
// 				</div>
// 			</div>
// 			<div className='bg-white overflow-hidden shadow-sm rounded-lg p-6'>
// 				<div className='text-sm font-medium text-gray-500'>
// 					Total Balance
// 				</div>
// 				<div className='mt-2 text-3xl font-semibold text-gray-900'>
// 					${(Number(dashboardData?.total_balance) || 0).toFixed(2)}
// 				</div>
// 			</div>
// 			<div className='bg-white overflow-hidden shadow-sm rounded-lg p-6'>
// 				<div className='text-sm font-medium text-gray-500'>
// 					Total Withdrawals
// 				</div>
// 				<div className='mt-2 text-3xl font-semibold text-gray-900'>
// 					${(Number(dashboardData?.total_withdrawals) || 0).toFixed(2)}
// 				</div>
// 			</div>
// 		</div>

// 		<div className='bg-white shadow-md rounded-lg mb-8'>
// 			<div className='px-4 py-5 sm:px-6'>
// 				<h2 className='text-xl font-semibold text-gray-900'>
// 					Recent Users
// 				</h2>
// 			</div>
// 			<Table>
// 				<TableHeader>
// 					<TableRow>
// 						<TableHead>Name</TableHead>
// 						<TableHead>Email</TableHead>
// 						<TableHead>Balance</TableHead>
// 						<TableHead>Total Withdrawal</TableHead>
// 					</TableRow>
// 				</TableHeader>
// 				<TableBody>
// 					{dashboardData?.recent_users.map((user) => (
// 						<TableRow key={user.id}>
// 							<TableCell>{user.name}</TableCell>
// 							<TableCell>{user.email}</TableCell>
// 							<TableCell>
// 								${(Number(user.balance) || 0).toFixed(2)}
// 							</TableCell>
// 							<TableCell>
// 								${(Number(user.total_withdrawal) || 0).toFixed(2)}
// 							</TableCell>
// 						</TableRow>
// 					))}
// 				</TableBody>
// 			</Table>
// 		</div>

// 		<div className='bg-white shadow-md rounded-lg'>
// 			<div className='px-4 py-5 sm:px-6 flex justify-between items-center'>
// 				<h2 className='text-xl font-semibold text-gray-900'>
// 					Recent Transactions
// 				</h2>
// 				<Button
// 					variant='outline'
// 					onClick={fetchDashboardData}>
// 					Refresh
// 				</Button>
// 			</div>
// 			<Table>
// 				<TableHeader>
// 					<TableRow>
// 						<TableHead>ID</TableHead>
// 						<TableHead>User</TableHead>
// 						<TableHead>Type</TableHead>
// 						<TableHead>Amount</TableHead>
// 						<TableHead>Status</TableHead>
// 						<TableHead>Date</TableHead>
// 					</TableRow>
// 				</TableHeader>
// 				<TableBody>
// 					{dashboardData?.transactions.map((transaction) => (
// 						<TableRow key={transaction.id}>
// 							<TableCell>{transaction.id}</TableCell>
// 							<TableCell>
// 								{dashboardData.recent_users.find(
// 									(user) => user.id === transaction.user_id,
// 								)?.name || "Unknown"}
// 							</TableCell>
// 							<TableCell className='capitalize'>
// 								{transaction.type}
// 							</TableCell>
// 							<TableCell>${transaction.amount.toFixed(2)}</TableCell>
// 							<TableCell className='capitalize'>
// 								{transaction.status}
// 							</TableCell>
// 							<TableCell>
// 								{new Date(transaction.created_at).toLocaleDateString()}
// 							</TableCell>
// 						</TableRow>
// 					))}
// 				</TableBody>
// 			</Table>
// 		</div>
// 	</main>

// 	<LogoutModal
// 		isOpen={showLogoutModal}
// 		onClose={() => setShowLogoutModal(false)}
// 		onConfirm={handleLogout}
// 		title='Confirm Admin Logout'
// 		description='Are you sure you want to logout from the admin dashboard?'
// 	/>
// </div>
