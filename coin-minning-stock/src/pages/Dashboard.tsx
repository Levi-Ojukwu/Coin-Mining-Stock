/** @format */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
// import { Line } from "react-chartjs-2";
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
} from "react-icons/fi";
import { FaHandshake } from "react-icons/fa6";
import CoinlibWidget from "../components/CoinlibWidget";
import CryptoAddresses from "../components/CryptoAddresses";
import WithdrawalPage from "../components/WithdrawalPage";
import DefaultPlan from "../components/DefaultPlan";

// const withdrawImages = [
// 	{
// 		image: "https://i.pcmag.com/imagery/reviews/068BjcjwBw0snwHIq0KNo5m-15..v1602794215.png",
// 	},
// ];

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
	name: string;
	email: string;
    phone_number: number;
}

interface Transaction {
	id: number;
	type: string;
	amount: number;
	date: string;
}

interface DashboardData {
	balance: number
	transactions: Transaction[]
  }

const Dashboard: React.FC = () => {
	const [user, setUser] = useState<User | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	// const [balance, setBalance] = useState<number>(0);
	// const [transactions, setTransactions] = useState<Transaction[]>([]);
	// const [chartData, setChartData] = useState<any>(null);
	const [activeNav, setActiveNav] = useState<string>("dashboard");
	const navigate = useNavigate();

	// useEffect(() => {

	// 	const userData = localStorage.getItem("user");
	// 	const token = localStorage.getItem("token");

	// 	if (userData && token) {
	// 		try {
	// 			const parsedUser: User = JSON.parse(userData);
	// 			setUser(parsedUser);

	// 			axios
	// 				.get("http://127.0.0.1:8000/api/dashboard", {
	// 					headers: { Authorization: `Bearer ${token}` },
	// 				})
	// 				.then((response) => {
	// 					console.log("Dashboard data:", response.data);
	// 					setBalance(response.data.balance || 0);
	// 					setTransactions(response.data.transactions || []);

	// 					setChartData({
	// 						labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
	// 						datasets: [
	// 							{
	// 								label: "Portfolio Value",
	// 								data: response.data.chartData || [
	// 									3000, 3500, 4200, 4800, 5100, 5432.1,
	// 								],
	// 								borderColor: "rgb(75, 192, 192)",
	// 								tension: 0.1,
	// 							},
	// 						],
	// 					});
	// 				})
	// 				.catch((error) => {
	// 					setError("Failed to fetch dashboard data.");
	// 					console.error(error);
	// 				});
	// 		} catch (error) {
	// 			console.error("Failed to parse user data:", error);
	// 			localStorage.removeItem("user");
	// 			navigate("/login");
	// 		} finally {
	// 			setLoading(false);
	// 		}
	// 	} else {
	// 		navigate("/login");
	// 	}
	// }, [navigate]);

	// Logout function
	
	useEffect(() => {
		const userData = localStorage.getItem("user")
		const token = localStorage.getItem("token")
	
		if (userData && token) {
		  try {
			const parsedUser: User = JSON.parse(userData)
			setUser(parsedUser)
	
			axios
			  .get<DashboardData>("http://127.0.0.1:8000/api/dashboard", {
				headers: { Authorization: `Bearer ${token}` },
			  })
			  .then((response) => {
				console.log("Dashboard data:", response.data)
				// setBalance(response.data.balance)
				// setTransactions(response.data.transactions)
			  })
			  .catch((error: Error | AxiosError) => {
				setError("Failed to fetch dashboard data.")
				console.error(error)
			  })
			  .finally(() => {
				setLoading(false)
			  })
		  } catch (error) {
			console.error("Failed to parse user data:", error)
			localStorage.removeItem("user")
			navigate("/login")
		  }
		} else {
		  navigate("/login")
		}
	  }, [navigate])

	const handleLogout = async (): Promise<void> => {
		try {
			const token = localStorage.getItem("token");

			if (!token) {
				console.error("No token found in localStorage.");
				setError("No token found. Please log in again.");
				navigate("/login");
				return;
			}

			console.log("Logging out with token:", token);

			const response = await axios.post(
				"http://127.0.0.1:8000/api/logout",
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (response.status === 200) {
				console.log("Logout Successful", response.data);
				localStorage.removeItem("user");
				localStorage.removeItem("token");
				navigate("/login");
			} else {
				throw new Error(`Unexpected response status: ${response.status}`);
			}
		} catch (error) {
			console.error("Logout failed:", error);
			if (axios.isAxiosError(error)) {
				setError(
					`Failed to log-out. ${
						error.response?.data?.message || error.message
					}`,
				);
			} else {
				setError("An unexpected error occurred during logout.");
			}
		}
	};

	const handleNavClick = (navItem: string): void => {
		setActiveNav(navItem);
		// Here you would typically navigate to the corresponding page
		// For now, we'll just update the active state
	};

	const renderContent = (): JSX.Element => {
		switch (activeNav) {
			case "dashboard":
				return (
					<>
					<CoinlibWidget />
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10'>
							<div className='bg-gradient-to-br from-[#e4f33d3c]  to-[#00565c46] px-5 py-7 rounded-lg shadow-md'>
								<h2 className='text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-semibold mb-4'>
									User Information
								</h2>
								{user && (
									<>
										<p className='text-gray-500'>
											<strong className='text-gray-800'>Name:</strong>{" "}
											{user.name}
										</p>
										<p className='text-gray-500'>
											<strong className='text-gray-800'>Email:</strong>{" "}
											{user.email}
										</p>
										<p className='text-gray-500'>
											<strong className='text-gray-800'>Phone Number:</strong>{" "}
											{user.phone_number}
										</p>
									</>
								)}
							</div>

							<div className='bg-gradient-to-br from-[#e4f33d3c]  to-[#00565c46] px-5 py-7 rounded-lg shadow-md'>
								<h2 className='text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-semibold mb-4'>
									Current Balance
								</h2>
								<p className='text-3xl font-bold text-green-600'>
									{/* ${balance.toFixed(2)} */}
								</p>
							</div>
							<div className='bg-gradient-to-br from-[#e4f33d3c]  to-[#00565c46] px-5 py-7 rounded-lg shadow-md'>
								<h2 className='text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-semibold mb-4'>
									Total Withdrawal
								</h2>
							</div>
						</div>
						
					</>
				);
			case "transactions":
				return (
					<div className='bg-white p-6 rounded-lg shadow-md'>
						<h2 className='text-2xl font-semibold mb-6 text-primary'>Transaction History</h2>
						{/* <ul>
							{transactions.map((transaction) => (
								<li
									key={transaction.id}
									className='mb-2'>
									<span
										className={`font-semibold ${
											transaction.amount > 0 ? "text-green-600" : "text-red-600"
										}`}>
										{transaction.type}
									</span>
									<span className='ml-2'>
										${Math.abs(transaction.amount).toFixed(2)}
									</span>
									<span className='ml-2 text-gray-500'>{transaction.date}</span>
								</li>
							))}
						</ul> */}
					</div>
				);
			case "transfer":
				return (
					<CryptoAddresses />
				);
			case "withdrawals":
				return (
					<div className='bg-gradient-to-br from-[#00565c4f] to-red-100 p-8 rounded-lg shadow-md'>					
						<WithdrawalPage />
					</div>
				);
			case "investments":
				return (
					<div className='bg-white p-6 rounded-lg shadow-md'>
						<h2 className='text-2xl font-semibold mb-6 text-primary'>Investment Plans</h2>
						{/* <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							{[
								{ name: "Basic", return: "5%", duration: "30 days" },
								{ name: "Standard", return: "8%", duration: "60 days" },
								{ name: "Premium", return: "12%", duration: "90 days" },
								{ name: "Platinum", return: "15%", duration: "180 days" },
							].map((plan) => (
								<div
									key={plan.name}
									className='border p-4 rounded-lg'>
									<h3 className='text-xl font-semibold'>{plan.name}</h3>
									<p>Return: {plan.return}</p>
									<p>Duration: {plan.duration}</p>
									<button className='mt-2 bg-green-500 text-white py-1 px-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50'>
										Invest
									</button>
								</div>
							))}
						</div> */}

						<DefaultPlan />
					</div>
				);
			default:
				return <div>Select an option from the sidebar</div>;
		}
	};

	if (loading)
		return <p className='text-center text-gray-500 text-xl'>Loading...</p>;

	return (
		<div className='flex bg-[#00565c1f] min-h-screen'>
			<aside className='bg-primary text-white w-64 min-h-screen p-8 pl-4'>
				<nav>
					<div className='mb-10'>
						<p className='text-secondary flex py-1 md:py-0 font-serif text-2xl'>
							{" "}
							<span className='font-[] z-50'>CMS.</span>
						</p>
						{/* <p className='text-secondary flex py-1 md:py-0 font-serif text-base'>
							{" "}
							<span className='font-[]'>CM</span><span className="flex items-center"><PiCurrencyDollarDuotone className="w-10 border-[0.00001px] shadow-md shadow-secondary bg-gradient-to-b from-[#849003fb] via-primary to-[#727b0798] h-10"/><span>tock</span></span>
						</p> */}
					</div>
					<ul className='space-y-2'>
						{[
							{ name: "dashboard", icon: FiDollarSign, label: "Dashboard" },
							{
								name: "transactions",
								icon: FiCreditCard,
								label: "Transactions",
							},
							{ name: "transfer", icon: FiSend, label: "Deposit" },
							{ name: "withdrawals", icon: FiBriefcase, label: "Withdrawals" },
							{
								name: "investments",
								icon: FiBriefcase,
								label: "Investment Plans",
							},
						].map((item) => (
							<li key={item.name}>
								<button
									onClick={() => handleNavClick(item.name)}
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
				</nav>
				<button
					onClick={handleLogout}
					className='mt-8 flex items-center gap-2 p-2 hover:text-primary hover:bg-gradient-to-r from-red-300 to-secondary rounded w-full'>
					<FiLogOut />
					<span>Logout</span>
				</button>
			</aside>

			<main className='flex-1 p-8'>
				<div className='mb-10'>
					<h1 className='text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-1'>
						User Mining Dashboard
					</h1>
					{user && (
						<>
							<div className='flex gap-1 items-center ml-2'>
								<FaHandshake className='w-9 h-9 text-gray-600' />
								<p className='text-gray-600 font-semibold text-xl'>
									<span>Welcome back, </span>
									{user.name}! Your mining dashboard at a glance
								</p>
							</div>
						</>
					)}
					{/* <CoinGeckoWidget /> */}
				</div>
				{error && <p className='text-red-500 text-center mb-4'>{error}</p>}
				{renderContent()}
			</main>
			
		</div>
	);
};

export default Dashboard;
