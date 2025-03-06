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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../components/ui/select";
import { Alert, AlertDescription } from "../../components/ui/alert";

interface Transaction {
	id: number;
	type: string;
	amount: number;
	status: string;
	description: string;
	created_at: string;
	visible_to_user: boolean;
}

interface User {
	id: number;
	name: string;
	email: string;
	balance: number
  	total_withdrawal: number
}

const UpdateUserTransactions: React.FC = () => {
	const { userId } = useParams<{ userId: string }>();
	const navigate = useNavigate();
	const [user, setUser] = useState<User | null>(null);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [newTransactionType, setNewTransactionType] = useState("deposit");
	const [newTransactionAmount, setNewTransactionAmount] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		fetchUserAndTransactions();
	}, []);

	const fetchUserAndTransactions = async () => {
		try {
			setLoading(true);
			setError(null);

			const token = localStorage.getItem("admin_token");

			if (!token) {
				throw new Error("No admin token found");
			}

			if (!userId) {
				throw new Error("No user ID provided");
			}

			// Fetch user details
			const response = await axios.get(
				`https://api.elitefarmmine.com/api/admin/users/${userId}/transactions`,
				{
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: "application/json",
					},
				},
			);

			if (response.data) {
				setUser(response.data.user);
				setTransactions(response.data.transactions);
			}
		} catch (error: any) {
			console.error("Error fetching data:", error);
			const errorMessage =
				error.response?.data?.error || error.message || "Failed to fetch data";
			setError(errorMessage);
			toast.error(errorMessage);

			// If user not found, redirect to dashboard
			if (error.response?.status === 404) {
				toast.error(`User with ID ${userId} not found`)
				setTimeout(() => navigate("/admin/dashboard"), 2000)
			}
		} finally {
			setLoading(false);
		}
	};

	const handleAddTransaction = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setSubmitting(true);
			setError(null)

			const token = localStorage.getItem("admin_token");

			if (!token) {
				throw new Error("No admin token found");
			}

			if (!userId) {
				throw new Error("No user ID provided");
			}

			// Validate amount
			const amount = Number.parseFloat(newTransactionAmount);
			if (isNaN(amount) || amount <= 0) {
				throw new Error("Please enter a valid amount greater than 0");
			}

			// Add maximum amount validation
			if (amount > 999999999999999999.99) {
				throw new Error("Amount exceeds maximum allowed value")
			}

			// // Check if withdrawal amount exceeds balance
			// if (newTransactionType === "withdrawal" && user && amount > user.balance) {
			// 	throw new Error(`Insufficient balance. Current balance: ${Number(user.balance).toFixed(2)}`)
			// }

			const response = await axios.post(
				`https://api.elitefarmmine.com/api/admin/users/${userId}/transactions`,
				{
					type: newTransactionType,
					amount: amount.toFixed(2), // Ensure proper decimal format
				},
				{
					headers: {
						"Authorization": `Bearer ${token}`,
						"Accept": "application/json",
						"Content-Type": "application/json",
					},
				},
			);

			toast.success("Transaction added successfully");
			setNewTransactionAmount("");

			 // Update user and transactions with new data
			 if (response.data.user) {
				setUser(response.data.user)
			}
			await fetchUserAndTransactions(); // Refresh the data
		} catch (error: any) {
			console.error("Failed to add transaction:", error);
			const errorMessage =
				error.response?.data?.error ||
				error.message ||
				"Failed to add transaction";
				setError(errorMessage)
				toast.error(errorMessage);

				// If user not found, redirect to dashboard
				if (error.response?.status === 404) {
					toast.error(`User with ID ${userId} not found`)
					setTimeout(() => navigate("/admin/dashboard"), 2000)
				}
		} finally {
			setSubmitting(false);
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
			<div className='max-w-4xl mx-auto mt-8'>
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
		  <div className="max-w-4xl mx-auto mt-8">
			<Alert>
			  <AlertDescription>User not found</AlertDescription>
			</Alert>
			<Button onClick={() => navigate("/admin/dashboard")} className="mt-4">
			  Back to Dashboard
			</Button>
		  </div>
		)
	}

	return (
		<>
			<div className='max-w-4xl mx-auto mt-8'>
				<div className='flex justify-between items-center mb-6'>
					<h2 className='text-2xl font-bold'>Update User Transactions</h2>
					<Button
						variant='outline'
						onClick={() => navigate("/admin/dashboard")}>
						Back to Dashboard
					</Button>
				</div>

				{user && (
					<div className='mb-6 p-4 bg-gray-50 rounded-lg'>
						<h3 className='font-semibold mb-2'>User Details</h3>
						<p>
							<strong>ID:</strong> {user.id}
						</p>
						<p>
							<strong>Name:</strong> {user.name}
						</p>
						<p>
							<strong>Email:</strong> {user.email}
						</p>
					</div>
				)}

				<div className='bg-white p-6 rounded-lg shadow-md mb-8'>
					<h3 className='text-xl font-semibold mb-4'>Add New Transaction</h3>
					<form
						onSubmit={handleAddTransaction}
						className='flex items-end space-x-4'>
						<div className='flex-1'>
							<Label htmlFor='transactionType'>Type</Label>
							<Select
								onValueChange={setNewTransactionType}
								defaultValue={newTransactionType}>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Select type' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='deposit'>Deposit</SelectItem>
									<SelectItem value='withdrawal'>Withdrawal</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='flex-1'>
							<Label htmlFor='transactionAmount'>Amount</Label>
							<Input
								id='transactionAmount'
								type='number'
								value={newTransactionAmount}
								onChange={(e) => setNewTransactionAmount(e.target.value)}
								min='0'
								step='0.01'
								required
								disabled={submitting}
							/>
						</div>
						<Button
							type='submit'
							disabled={submitting}>
							{submitting ? "Adding..." : "Add Transaction"}
						</Button>
					</form>
				</div>

				<div className='bg-white p-6 rounded-lg shadow-md'>
					<h3 className='text-xl font-semibold mb-4'>Transaction History</h3>
					{transactions.length > 0 ? (
						<div className='overflow-x-auto'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Type
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Amount
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Status
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Description
										</th>
										<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
											Date
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200'>
									{transactions.map((transaction) => (
										<tr key={transaction.id}>
											<td className='px-6 py-4 whitespace-nowrap capitalize'>
												{transaction.type}
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<span
													className={
														transaction.type === "deposit"
															? "text-green-600"
															: "text-red-600"
													}>
													${Number(transaction.amount).toFixed(2)}
												</span>
											</td>
											<td className='px-6 py-4 whitespace-nowrap capitalize'>
												{transaction.status}
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												{transaction.description}
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												{new Date(transaction.created_at).toLocaleDateString()}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<p className='text-center text-gray-500'>No transactions found</p>
					)}
				</div>
			</div>
		</>
	);
};

export default UpdateUserTransactions;
