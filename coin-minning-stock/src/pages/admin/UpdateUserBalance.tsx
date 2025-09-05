/** @format */

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

interface User {
	id: number;
	name: string;
	email: string;
	balance: number;
	total_withdrawal: number;
}

const UpdateUserBalance: React.FC = () => {
	const { userId } = useParams<{ userId: string }>();
	const navigate = useNavigate();
	const [user, setUser] = useState<User | null>(null);
	const [newBalance, setNewBalance] = useState("");
	const [newTotalWithdrawal, setNewTotalWithdrawal] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchUserData();
	}, []);

	const fetchUserData = async () => {
		try {
			setLoading(true);
			setError(null);
			const token = localStorage.getItem("admin_token");

			if (!token) {
				throw new Error("No admin token found");
			}

			if (!userId) {
				throw new Error("No user ID provided")
			  }

			const response = await axios.get<User>(
				`http://127.0.0.1:8000/api/admin/users/${userId}`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: "application/json",
					},
				},
			);

			// Debug log to see the actual response
			console.log("API Response:", response.data);

			if (response.data) {
				setUser(response.data);

				// Safely convert numbers to strings with fallback to '0'
				setNewBalance((response.data.balance ?? 0).toString());
				setNewTotalWithdrawal((response.data.total_withdrawal ?? 0).toString());
			} else {
				throw new Error("User data is empty");
			}
		} catch (error: any) {
			console.error("Error fetching user data:", error);

			const errorMessage =
				error.response?.data?.error ||
				error.message ||
				"Failed to fetch user data";
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const token = localStorage.getItem("admin_token");

			if (!token) {
				throw new Error("No admin token found");
			}

			if (!userId) {
				throw new Error("No user ID provided")
			  }
		

			// Validate numbers before sending
			const balance = Number.parseFloat(newBalance);
			const totalWithdrawal = Number.parseFloat(newTotalWithdrawal);

			if (isNaN(balance) || isNaN(totalWithdrawal)) {
				throw new Error("Invalid number format");
			}

			const response = await axios.post(
				`http://127.0.0.1:8000/api/admin/users/${userId}/update-balance`,
				{
					user_id: Number.parseInt(userId), // Explicitly send the user ID
					balance: balance,
					total_withdrawal: totalWithdrawal,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				},
			);

			if (response.data?.error) {
				throw new Error(response.data.error);
			}

			toast.success("User balance and total withdrawal updated successfully");
			navigate("/admin/dashboard");
		} catch (error: any) {
			console.error("Update error:", error)
			const errorMessage =
				error.response?.data?.error ||
				error.message ||
				"Failed to update user balance";
			toast.error(errorMessage);
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='max-w-md mx-auto mt-8'>
				<div
					className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative'
					role='alert'>
					<strong className='font-bold'>Error: </strong>
					<span className='block sm:inline'>{error}</span>
				</div>
				<Button
					onClick={() => navigate("/admin/dashboard")}
					className='mt-4'>
					Back to Dashboard
				</Button>
			</div>
		);
	}

	if (!user) {
		return (
			<div className='max-w-md mx-auto mt-8'>
				<div
					className='bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative'
					role='alert'>
					<span className='block sm:inline'>No user data found</span>
				</div>
				<Button
					onClick={() => navigate("/admin/dashboard")}
					className='mt-4'>
					Back to Dashboard
				</Button>
			</div>
		);
	}

	return (
		<div className='max-w-md mx-auto mt-8'>
			<h2 className='text-2xl font-bold mb-4'>
				Update User Balance and Total Withdrawal
			</h2>
			<div className='mb-4 p-4 bg-gray-50 rounded-lg'>
				<p>
					<strong>User:</strong> {user.name}
				</p>
				<p>
					<strong>Email:</strong> {user.email}
				</p>
				<p>
					<strong>Current Balance:</strong> ${Number(user.balance).toFixed(2)}
				</p>
				<p>
					<strong>Current Total Withdrawal:</strong> $
					{Number(user.total_withdrawal).toFixed(2)}
				</p>
			</div>
			<form
				onSubmit={handleSubmit}
				className='space-y-4'>
				<div>
					<Label htmlFor='balance'>New Balance</Label>
					<Input
						id='balance'
						type='number'
						value={newBalance}
						onChange={(e) => setNewBalance(e.target.value)}
						required
						min='0'
						step='0.01'
					/>
				</div>
				<div>
					<Label htmlFor='totalWithdrawal'>New Total Withdrawal</Label>
					<Input
						id='totalWithdrawal'
						type='number'
						value={newTotalWithdrawal}
						onChange={(e) => setNewTotalWithdrawal(e.target.value)}
						required
						min='0'
						step='0.01'
					/>
				</div>
				<div className='flex space-x-4'>
					<Button type='submit'>Update</Button>
					<Button
						type='button'
						variant='outline'
						onClick={() => navigate("/admin/dashboard")}>
						Cancel
					</Button>
				</div>
			</form>
		</div>
		// <div className='max-w-md mx-auto mt-8'>
		// 	<h2 className='text-2xl font-bold mb-4'>
		// 		Update User Balance and Total Withdrawal
		// 	</h2>
		// 	<div className='mb-4 p-4 bg-gray-50 rounded-lg'>
		// 		<p>
		// 			<strong>User:</strong> {user.name}
		// 		</p>
		// 		<p>
		// 			<strong>Email:</strong> {user.email}
		// 		</p>
		// 	</div>
		// 	<form
		// 		onSubmit={handleSubmit}
		// 		className='space-y-4'>
		// 		<div>
		// 			<Label htmlFor='balance'>Balance</Label>
		// 			<Input
		// 				id='balance'
		// 				type='number'
		// 				value={newBalance}
		// 				onChange={(e) => setNewBalance(e.target.value)}
		// 				required
		// 				min='0'
		// 				step='0.01'
		// 			/>
		// 		</div>
		// 		<div>
		// 			<Label htmlFor='totalWithdrawal'>Total Withdrawal</Label>
		// 			<Input
		// 				id='totalWithdrawal'
		// 				type='number'
		// 				value={newTotalWithdrawal}
		// 				onChange={(e) => setNewTotalWithdrawal(e.target.value)}
		// 				required
		// 				min='0'
		// 				step='0.01'
		// 			/>
		// 		</div>
		// 		<div className='flex space-x-4'>
		// 			<Button type='submit'>Update</Button>
		// 			<Button
		// 				type='button'
		// 				variant='outline'
		// 				onClick={() => navigate("/admin/dashboard")}>
		// 				Cancel
		// 			</Button>
		// 		</div>
		// 	</form>
		// </div>
		// <div className='max-w-md mx-auto mt-8'>
		// 	<h2 className='text-2xl font-bold mb-4'>
		// 		Update User Balance and Total Withdrawal
		// 	</h2>
		// 	<form onSubmit={handleSubmit}>
		// 		<div className='mb-4'>
		// 			<Label htmlFor='balance'>Balance</Label>
		// 			<Input
		// 				id='balance'
		// 				type='number'
		// 				value={newBalance}
		// 				onChange={(e) => setNewBalance(e.target.value)}
		// 				required
		// 			/>
		// 		</div>
		// 		<div className='mb-4'>
		// 			<Label htmlFor='totalWithdrawal'>Total Withdrawal</Label>
		// 			<Input
		// 				id='totalWithdrawal'
		// 				type='number'
		// 				value={newTotalWithdrawal}
		// 				onChange={(e: any) => setNewTotalWithdrawal(e.target.value)}
		// 				required
		// 			/>
		// 		</div>
		// 		<Button type='submit'>Update</Button>
		// 	</form>
		// </div>
	);
};

export default UpdateUserBalance;
