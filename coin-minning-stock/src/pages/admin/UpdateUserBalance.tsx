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
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Alert, AlertDescription } from "../../components/ui/alert"

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
	const [depositAmount, setDepositAmount] = useState("")
  	const [withdrawalAmount, setWithdrawalAmount] = useState("")
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false)
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
				// setNewBalance((response.data.balance ?? 0).toString());
				// setNewTotalWithdrawal((response.data.total_withdrawal ?? 0).toString());
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
			setSubmitting(true)
      		setError(null)

			const token = localStorage.getItem("admin_token");

			if (!token) {
				throw new Error("No admin token found");
			}

			if (!userId) {
				throw new Error("No user ID provided")
			  }
		

			// Validate that at least one amount is provided
			const deposit = depositAmount ? Number.parseFloat(depositAmount) : 0
			const withdrawal = withdrawalAmount ? Number.parseFloat(withdrawalAmount) : 0

			if (deposit <= 0 && withdrawal <= 0) {
				throw new Error("Please enter either a deposit amount or withdrawal amount")
			}

			// Validate numbers
			if ((depositAmount && isNaN(deposit)) || (withdrawalAmount && isNaN(withdrawal))) {
				throw new Error("Invalid number format")
			}

			// Check for negative values
			if (deposit < 0 || withdrawal < 0) {
				throw new Error("Amounts cannot be negative")
			}

			// Check if withdrawal exceeds current balance
			if (withdrawal > 0 && user && withdrawal > user.balance) {
				throw new Error(`Insufficient balance. Current balance: $${Number(user.balance).toFixed(2)}`)
			}

			const requestData: any = {}
			if (deposit > 0) requestData.deposit_amount = deposit
			if (withdrawal > 0) requestData.withdrawal_amount = withdrawal

			const response = await axios.post(
				`http://127.0.0.1:8000/api/admin/users/${userId}/process-transaction`,
				requestData,
				{
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				},
			)

			if (response.data?.error) {
				throw new Error(response.data.error);
			}

			// Show success message with details
			let successMessage = "Transaction processed successfully! "
			if (deposit > 0) successMessage += `Deposited: $${deposit.toFixed(2)} `
			if (withdrawal > 0) successMessage += `Withdrawn: $${withdrawal.toFixed(2)}`

			toast.success(successMessage)

			// Update user data with response
			if (response.data.user) {
				setUser(response.data.user)
			}

			// Clear form
			setDepositAmount("")
			setWithdrawalAmount("")

			// Navigate back to dashboard after a short delay
			setTimeout(() => {
        		navigate("/admin/dashboard")
      		}, 2000)
		} catch (error: any) {
			console.error("Transaction error:", error)
			const errorMessage =
				error.response?.data?.error ||
				error.message ||
				"Failed to process transaction";
			setError(errorMessage)
			toast.error(errorMessage);
		} finally {
			setSubmitting(false)
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<div className='animate-spin rounded-full h-32 w-32 border-b-2 border-primary'></div>
			</div>
		);
	}

	if (error && !user) {
		return (
		<div className="max-w-md mx-auto mt-8">
			<Alert>
			<AlertDescription>
				<strong>Error: </strong>
				{error}
			</AlertDescription>
			</Alert>
			<Button onClick={() => navigate("/admin/dashboard")} className="mt-4">
			Back to Dashboard
			</Button>
		</div>
		)
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
		<div className="max-w-2xl mx-auto mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Process User Transaction</h2>
        <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      {/* User Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Current Balance:</strong>{" "}
            <span className="text-green-500 font-semibold">${Number(user.balance).toFixed(2)}</span>
          </p>
          <p>
            <strong>Total Withdrawals:</strong>{" "}
            <span className="text-red-500 font-semibold">${Number(user.total_withdrawal).toFixed(2)}</span>
          </p>
        </CardContent>
      </Card>

      {/* Transaction Form */}
      <Card>
        <CardHeader>
          <CardTitle>Process Transaction</CardTitle>
          <p className="text-sm text-gray-600">
            Enter either a deposit amount (to add to balance) or withdrawal amount (to withdraw from balance).
          </p>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deposit Section */}
              <div className="space-y-2">
                <Label htmlFor="deposit" className="text-green-700 font-semibold">
                  Deposit Amount
                </Label>
                <Input
                  id="deposit"
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="border-green-300 focus:border-green-500"
                  disabled={submitting}
                />
                <p className="text-xs text-green-600">Amount to add to user's balance</p>
              </div>

              {/* Withdrawal Section */}
              <div className="space-y-2">
                <Label htmlFor="withdrawal" className="text-red-700 font-semibold">
                  Withdrawal Amount
                </Label>
                <Input
                  id="withdrawal"
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  max={user.balance}
                  className="border-red-300 focus:border-red-500"
                  disabled={submitting}
                />
                <p className="text-xs text-red-600">
                  Amount to subtract from balance (Max: ${Number(user.balance).toFixed(2)})
                </p>
              </div>
            </div>

            {/* Preview Section */}
            {(depositAmount || withdrawalAmount) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Transaction Preview:</h4>
                <div className="space-y-1 text-sm">
                  <p>Current Balance: ${Number(user.balance).toFixed(2)}</p>
                  {depositAmount && <p className="text-green-600">+ Deposit: ${Number(depositAmount).toFixed(2)}</p>}
                  {withdrawalAmount && (
                    <p className="text-red-600">- Withdrawal: ${Number(withdrawalAmount).toFixed(2)}</p>
                  )}
                  <hr className="my-2" />
                  <p className="font-semibold">
                    New Balance: $
                    {(
                      Number(user.balance) +
                      (depositAmount ? Number(depositAmount) : 0) -
                      (withdrawalAmount ? Number(withdrawalAmount) : 0)
                    ).toFixed(2)}
                  </p>
                  {withdrawalAmount && (
                    <p className="font-semibold text-blue-600">
                      New Total Withdrawals: $
                      {(Number(user.total_withdrawal) + (withdrawalAmount ? Number(withdrawalAmount) : 0)).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <Button type="submit" disabled={submitting} className="flex-1">
                {submitting ? "Processing..." : "Process Transaction"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/dashboard")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
	);
};

export default UpdateUserBalance;
