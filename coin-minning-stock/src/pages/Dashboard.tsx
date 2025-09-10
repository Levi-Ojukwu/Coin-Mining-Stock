/** @format */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../contexts/AuthContex";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import {
	FiDollarSign,
	FiBriefcase,
	FiCreditCard,
	FiSend,
	FiLogOut,
	FiMenu,
	FiX,
} from "react-icons/fi";
import { FaHandshake } from "react-icons/fa6";
import CoinlibWidget from "../components/CoinlibWidget";
import CryptoAddresses from "../components/CryptoAddresses";
import WithdrawalPage from "../components/WithdrawalPage";
import DefaultPlan from "../components/DefaultPlan";
import LogoutModal from "../components/LogoutModal";
import NotificationBell from "../components/NotificationBell";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
);

// Define User type
interface User {
	id: number;
	name: string;
	email: string;
	role: "user" | "admin"; // Ensure role is explicitly typed
	username: string;
	phone_number?: string;
	balance: number;
	total_withdrawal: number;
}

interface Transaction {
	id: number;
	type: string;
	amount: number;
	status: string;
	created_at: string;
	description?: string;
	visible_to_user: boolean;
}

interface Notification {
	id: number;
	type: string;
	title: string;
	message: string;
	data: any;
	is_read: boolean;
	created_at: string;
}

interface DashboardData {
	user: User;
	balance: number;
	totalBalance: number;
	transactions: Transaction[];
	notifications: Notification[];
	unread_notifications_count: number;
}

export default function Dashboard() {
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(
		null,
	);
	const [activeNav, setActiveNav] = useState("dashboard");
	const [showLogoutModal, setShowLogoutModal] = useState(false);
	const navigate = useNavigate();
	const { user, setUser } = useAuth(); // Added setUser from auth context
	user;
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (!token) {
			navigate("/login");
			return;
		}
		fetchDashboardData();
	}, [navigate]);

	const fetchDashboardData = async () => {
		try {
			setLoading(true);
			setError(null);
			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("No authentication token found");
			}

			console.log("Fetching dashboard data..."); // Debug log

			const response = await axios.get<DashboardData>(
				"http://127.0.0.1:8000/api/dashboard",
				{
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: "application/json",
					},
				},
			);

			// Debug log the response
			console.log("Dashboard API Response:", response.data);

			if (!response.data) {
				throw new Error("Empty response from server");
			}

			setDashboardData(response.data);

			// Update user data in auth context if needed
			if (setUser && response.data.user) {
				setUser(response.data.user);
			}

			setError(null);
		} catch (error: any) {
			console.error("Dashboard data fetch error:", error);

			// Detailed error logging
			if (axios.isAxiosError(error)) {
				console.error("API Error Response:", error.response?.data);
				console.error("API Error Status:", error.response?.status);
			}

			const errorMessage =
				error.response?.data?.message ||
				error.message ||
				"Failed to fetch dashboard data";
			setError(errorMessage);
			toast.error(errorMessage);

			// Handle authentication errors
			if (error.response?.status === 401) {
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				navigate("/login");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async () => {
		try {
			const token = localStorage.getItem("token");

			if (!token) {
				throw new Error("No authentication token found");
			}

			await axios.post(
				"http://127.0.0.1:8000/api/logout",
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			setUser(null);

			toast.success("Logged out successfully");
			navigate("/login");
		} catch (error: any) {
			console.error("Logout failed:", error);

			const errorMessage =
				error.response?.data?.message || error.message || "Failed to logout";
			toast.error(errorMessage);

			// Force logout on error
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			setUser(null);
			navigate("/login");
		}
	};

	const renderContent = () => {
		switch (activeNav) {
			case "dashboard":
				return (
					<>
						<CoinlibWidget />

						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10'>
							<div className='bg-gradient-to-br from-[#e4f33d3c] to-[#00565c46] px-5 py-7 rounded-lg shadow-md'>
								<h2 className='text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-semibold mb-4'>
									User Information
								</h2>
								{dashboardData?.user && (
									<>
										<p className='text-gray-500'>
											<strong className='text-gray-800'>Name:</strong>{" "}
											{dashboardData.user.name}
										</p>
										<p className='text-gray-500'>
											<strong className='text-gray-800'>Email:</strong>{" "}
											{dashboardData.user.email}
										</p>
										<p className='text-gray-500'>
											<strong className='text-gray-800'>Username:</strong>{" "}
											{dashboardData.user.username}
										</p>
										<p className='text-gray-500'>
											<strong className='text-gray-800'>Phone Number:</strong>{" "}
											{dashboardData.user.phone_number}
										</p>
									</>
								)}
							</div>

							<div className='bg-gradient-to-br from-[#e4f33d3c] to-[#00565c46] px-5 py-7 rounded-lg shadow-md'>
								<h2 className='text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-semibold mb-4'>
									Current Balance
								</h2>
								<p className='text-3xl font-bold text-green-600'>
									$
									{Number(dashboardData?.user?.balance || 0).toFixed(2) ||
										"0.00"}
								</p>
							</div>

							<div className='bg-gradient-to-br from-[#e4f33d3c] to-[#00565c46] px-5 py-7 rounded-lg shadow-md'>
								<h2 className='text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-semibold mb-4'>
									Total Withdrawal
								</h2>
								<p className='text-3xl font-bold text-blue-600'>
									$
									{Number(dashboardData?.user?.total_withdrawal || 0).toFixed(
										2,
									) || "0.00"}
								</p>
							</div>
						</div>

						{/* Recent Notifications Section */}
						{dashboardData?.notifications &&
							dashboardData.notifications.length > 0 && (
								<div className='mt-10 bg-white p-6 rounded-lg shadow-md'>
									<h2 className='text-2xl font-semibold mb-6 text-primary'>
										Recent Notifications
									</h2>
									<div className='space-y-4'>
										{dashboardData.notifications
											.slice(0, 5)
											.map((notification) => (
												<div
													key={notification.id}
													className={`p-4 rounded-lg border-l-4 ${
														notification.type === "deposit"
															? "border-green-500 bg-green-50"
															: notification.type === "withdrawal"
															? "border-red-500 bg-red-50"
															: "border-blue-500 bg-blue-50"
													} ${
														!notification.is_read ? "ring-2 ring-blue-200" : ""
													}`}>
													<div className='flex justify-between items-start'>
														<div>
															<h3 className='font-semibold text-gray-800'>
																{notification.title}
															</h3>
															<p className='text-gray-600 mt-1'>
																{notification.message}
															</p>
														</div>
														<span className='text-sm text-gray-500'>
															{new Date(
																notification.created_at,
															).toLocaleDateString()}
														</span>
													</div>
													{!notification.is_read && (
														<div className='mt-2'>
															<span className='inline-block w-2 h-2 bg-blue-500 rounded-full'></span>
															<span className='ml-2 text-sm text-blue-600'>
																New
															</span>
														</div>
													)}
												</div>
											))}
									</div>
								</div>
							)}
					</>
				);
			case "transactions":
				return (
					<div className='bg-white p-6 rounded-lg shadow-md overflow-x-auto'>
						<h2 className='text-2xl font-semibold mb-6 text-primary'>
							Transaction History
						</h2>
						{dashboardData?.transactions &&
						dashboardData.transactions.length > 0 ? (
							<div className='w-full'>
								<div className='overflow-x-auto'>
									<table className='w-full min-w-[800px] divide-y divide-gray-900'>
										<thead className='bg-gray-100'>
											<tr>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
													Id
												</th>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
													Type
												</th>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
													Amount
												</th>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
													Status
												</th>
												<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase'>
													Date
												</th>
											</tr>
										</thead>
										<tbody className='bg-white divide-y divide-gray-200'>
											{dashboardData.transactions.map((transaction) => (
												<tr
													key={transaction.id}
													className='hover:bg-gray-100'>
													<td className='px-6 py-4 whitespace-nowrap'>
														{transaction.id}
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														{transaction.type}
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														${Number(transaction.amount).toFixed(2)}
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														{transaction.status}
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														{new Date(
															transaction.created_at,
														).toLocaleDateString()}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						) : (
							<p className='text-center text-gray-500'>No transactions found</p>
						)}
					</div>
				);
			case "transfer":
				return <CryptoAddresses />;
			case "withdrawals":
				return (
					<div className='bg-gradient-to-br from-[#00565c4f] to-red-100 p-8 rounded-lg shadow-md'>
						<WithdrawalPage />
					</div>
				);
			case "investments":
				return (
					<div className='bg-white p-6 rounded-lg shadow-md'>
						<h2 className='text-2xl font-semibold mb-6 text-primary'>
							Investment Plans
						</h2>
						<DefaultPlan />
					</div>
				);
			default:
				return <div>Select an option from the sidebar</div>;
		}
	};

	const sidebarContent = (
		<nav>
			<div className='mb-10'>
				<p className='text-secondary flex py-1 lg:py-0 font-serif text-2xl'>
					<span>CMS.</span>
				</p>
			</div>
			<ul className='space-y-2'>
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
								setActiveNav(item.name);
								setIsMobileMenuOpen(false);
							}}
							className={`flex items-center space-x-2 p-2 rounded w-full text-left ${
								activeNav === item.name
									? "bg-gradient-to-r from-red-300 to-secondary text-primary"
									: "hover:bg-gradient-to-r from-red-300 to-secondary hover:text-primary"
							}`}>
							<item.icon />
							<span>{item.label}</span>
						</button>
					</li>
				))}
			</ul>
			<button
				onClick={() => setShowLogoutModal(true)}
				className='mt-8 flex items-center gap-2 p-2 hover:text-primary hover:bg-gradient-to-r from-red-300 to-secondary rounded w-full'>
				<FiLogOut />
				<span>Logout</span>
			</button>
		</nav>
	);

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
			</div>
		);
	}

	return (
		<div className='flex bg-[#00565c1f] min-h-screen'>
			{/* Desktop and tablet sidebar */}
			<aside className='hidden lg:block bg-primary text-white w-64 min-h-screen p-8 pl-4 fixed left-0 top-0 bottom-0 overflow-y-auto'>
				{sidebarContent}
			</aside>

			{/* Mobile menu button */}
			<button
				className='lg:hidden fixed top-4 right-4 z-20 p-2 bg-primary text-white rounded'
				onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
				{isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
			</button>

			{/* Mobile sidebar */}
			{isMobileMenuOpen && (
				<aside className='lg:hidden fixed inset-0 bg-primary text-white w-full h-full z-10 p-8 pl-4 overflow-y-auto'>
					{sidebarContent}
				</aside>
			)}

			{/* Main content */}
			<main className='flex-1 p-8 lg:ml-64 overflow-x-auto'>
				<div className='mb-1 flex justify-between items-start mr-5'>
					<div>
						<h1 className='text-base lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-1'>
							User Mining Dashboard
						</h1>
						{dashboardData?.user && (
							<div className='flex gap-1 items-center ml-2'>
								<FaHandshake className='w-9 h-9 text-gray-600' />
								<p className='text-gray-600 font-semibold text-sm lg:text-xl'>
									<span>Welcome back, </span>
									{dashboardData.user.name}! Your mining dashboard at a glance
								</p>
							</div>
						)}
					</div>

					<div className="">
						{/* Notification Bell */}
						{dashboardData && (
							<NotificationBell
								unreadCount={dashboardData.unread_notifications_count || 0}
								onNotificationUpdate={fetchDashboardData}
							/>
						)}
					</div>
				</div>
				{error && <p className='text-red-500 text-center mb-4'>{error}</p>}
				{renderContent()}
			</main>

			<LogoutModal
				isOpen={showLogoutModal}
				onClose={() => setShowLogoutModal(false)}
				onConfirm={handleLogout}
			/>
		</div>
	);
}
