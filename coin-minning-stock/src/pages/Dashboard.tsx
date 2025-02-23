/** @format */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "sooner";
import { useAuth } from "../contexts/Authcontex";
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
import LogoutModal from "../components/LogoutModal";

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
	status: string;
	created_at: string;
}

interface DashboardData {
	message: string
	user: {
		id: number
		name: string
		email: string
		username: string
		phone_number: string
		balance:number
		total_withdrawal: number
	}
	transactions: Transaction[]
  }

  export default function Dashboard() {
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)
	const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
	const [activeNav, setActiveNav] = useState("dashboard")
	const [showLogoutModal, setShowLogoutModal] = useState(false)
	const navigate = useNavigate()
	const { user } = useAuth()
  
	useEffect(() => {
	  if (!user) {
		navigate("/login")
		return
	  }
	  fetchDashboardData()
	}, [user, navigate])
  
	const fetchDashboardData = async () => {
	  try {
		const token = localStorage.getItem("token")
		const response = await axios.get<DashboardData>("http://127.0.0.1:8000/api/dashboard", {
		  headers: { Authorization: `Bearer ${token}` },
		})
		setDashboardData(response.data)
		setError(null)
	  } catch (error) {
		console.error("Failed to fetch dashboard data:", error)
		setError("Failed to fetch dashboard data")
		toast.error("Failed to fetch dashboard data")
	  } finally {
		setLoading(false)
	  }
	}
  
	const handleLogout = async () => {
	  try {
		const token = localStorage.getItem("token")
		await axios.post(
		  "http://127.0.0.1:8000/api/logout",
		  {},
		  {
			headers: { Authorization: `Bearer ${token}` },
		  },
		)
		localStorage.removeItem("token")
		localStorage.removeItem("user")
		toast.success("Logged out successfully")
		navigate("/login")
	  } catch (error) {
		console.error("Logout failed:", error)
		toast.error("Failed to logout")
	  }
	}
  
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
				  <p className="text-3xl font-bold text-green-600">${Number(dashboardData?.user?.balance || 0).toFixed(2) || "0.00"}</p>
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
			</>
		  )
		case "transactions":
		  return (
			<div className="bg-white p-6 rounded-lg shadow-md">
			  <h2 className="text-2xl font-semibold mb-6 text-primary">Transaction History</h2>
			  {dashboardData?.transactions && dashboardData.transactions.length > 0 ? (
				<div className="overflow-x-auto">
				  <table className="min-w-full divide-y divide-gray-200">
					<thead>
					  <tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
					  </tr>
					</thead>
					<tbody>
					  {dashboardData.transactions.map((transaction) => (
						<tr key={transaction.id}>
						  <td className="px-6 py-4 whitespace-nowrap capitalize">{transaction.type}</td>
						  <td className="px-6 py-4 whitespace-nowrap">${transaction.amount.toFixed(2)}</td>
						  <td className="px-6 py-4 whitespace-nowrap capitalize">{transaction.status}</td>
						  <td className="px-6 py-4 whitespace-nowrap">
							{new Date(transaction.created_at).toLocaleDateString()}
						  </td>
						</tr>
					  ))}
					</tbody>
				  </table>
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
  
	if (loading) {
	  return (
		<div className="flex items-center justify-center min-h-screen">
		  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
		</div>
	  )
	}
  
	return (
	  <div className="flex bg-[#00565c1f] min-h-screen">
		<aside className="bg-primary text-white w-64 min-h-screen p-8 pl-4">
		  <nav>
			<div className="mb-10">
			  <p className="text-secondary flex py-1 md:py-0 font-serif text-2xl">
				<span className="font-[]">CMS.</span>
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
					onClick={() => setActiveNav(item.name)}
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
		  </nav>
		  <button
			onClick={() => setShowLogoutModal(true)}
			className="mt-8 flex items-center gap-2 p-2 hover:text-primary hover:bg-gradient-to-r from-red-300 to-secondary rounded w-full"
		  >
			<FiLogOut />
			<span>Logout</span>
		  </button>
		</aside>
  
		<main className="flex-1 p-8">
		  <div className="mb-10">
			<h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-1">
			  User Mining Dashboard
			</h1>
			{dashboardData?.user && (
			  <div className="flex gap-1 items-center ml-2">
				<FaHandshake className="w-9 h-9 text-gray-600" />
				<p className="text-gray-600 font-semibold text-xl">
				  <span>Welcome back, </span>
				  {dashboardData.user.name}! Your mining dashboard at a glance
				</p>
			  </div>
			)}
		  </div>
		  {error && <p className="text-red-500 text-center mb-4">{error}</p>}
		  {renderContent()}
		</main>
  
		<LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={handleLogout} />
	  </div>
	)
  }

