/** @format */

"use client";

import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Alert, AlertDescription } from "../../components/ui/alert";
// import { useAuth } from "../../contexts/AuthContex";

const AdminLogin = () => {
//   const { user } = useAuth()
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

  // useEffect(() => {
  //   const token = localStorage.getItem("admin_token");
  //   if (token) {
  //     // console.log("Admin already logged in, redirecting...");
  //     navigate("/admin/dashboard");
  //   }
  // }, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// const response = await axios.post("http://127.0.0.1:8000/api/admin/login", formData)

			const response = await axios.post(
				"http://127.0.0.1:8000/api/admin/login",
				formData,
				{
					headers: {
						"Content-Type": "application/json",
						"Accept": "application/json",
					},
				},
			);

			console.log("Login response:", response.data); // Debug response

			// Check if we have a token and admin data
			if (!response.data.token || !response.data.admin) {
				throw new Error("Invalid response from server");
			}

			// Verify admin role
			if (response.data.admin.role !== "admin") {
				throw new Error("Unauthorized access. Admin privileges required.");
			}

			// Store token and admin data
			localStorage.setItem("admin_token", response.data.token);
			localStorage.setItem("admin_data", JSON.stringify(response.data.admin));

			console.log("Stored token:", localStorage.getItem("admin_token")); // Verify storage
			console.log("Stored admin data:", localStorage.getItem("admin_data")); // Verify storage

			//Navigate to dashboard
			// setTimeout(() => {
			// 	console.log("Navigating to dashboard...");
			// 	navigate("/admin/dashboard");
			// }, 100);

      const token = localStorage.getItem("admin_token")
      if(token){
        console.log("Navigating to dashboard...");
				navigate("/admin/dashboard");
      }      
		} catch (error: any) {
			console.error("Login failed:", error);
			setError(
				error.response?.data?.error ||
					error.response?.data?.message ||
					error.message ||
					"Login failed. Please check your credentials.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-100'>
			<div className='max-w-md w-full bg-white rounded-lg shadow-md p-8'>
				<div className='text-center mb-8'>
					<h2 className='text-3xl font-bold text-gray-900'>Admin Login</h2>
					<p className='text-gray-600 mt-2'>
						Enter your credentials to access the admin dashboard
					</p>
				</div>

				{error && (
					<Alert
						variant='destructive'
						className='mb-6'>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<form
					onSubmit={handleSubmit}
					className='space-y-6'>
					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700'>
							Email
						</label>
						<Input
							id='email'
							name='email'
							type='email'
							required
							value={formData.email}
							onChange={handleChange}
							className='mt-1'
							placeholder='admin@example.com'
						/>
					</div>

					<div>
						<label
							htmlFor='password'
							className='block text-sm font-medium text-gray-700'>
							Password
						</label>
						<Input
							id='password'
							name='password'
							type='password'
							required
							value={formData.password}
							onChange={handleChange}
							className='mt-1'
						/>
					</div>

					<Button
						type='submit'
						className='w-full'
						disabled={loading}>
						{loading ? "Logging in..." : "Login"}
					</Button>
				</form>
			</div>
		</div>

		// <div className="min-h-screen flex items-center justify-center bg-gray-100">
		//   <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
		//     <div className="text-center mb-8">
		//       <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
		//       <p className="text-gray-600 mt-2">Enter your credentials to access the admin dashboard</p>
		//     </div>

		//     {error && (
		//       <Alert variant="destructive" className="mb-6">
		//         <AlertDescription>{error}</AlertDescription>
		//       </Alert>
		//     )}

		//     <form onSubmit={handleSubmit} className="space-y-6">
		//       <div>
		//         <label htmlFor="email" className="block text-sm font-medium text-gray-700">
		//           Email
		//         </label>
		//         <Input
		//           id="email"
		//           name="email"
		//           type="email"
		//           required
		//           value={formData.email}
		//           onChange={handleChange}
		//           className="mt-1"
		//           placeholder="admin@example.com"
		//         />
		//       </div>

		//       <div>
		//         <label htmlFor="password" className="block text-sm font-medium text-gray-700">
		//           Password
		//         </label>
		//         <Input
		//           id="password"
		//           name="password"
		//           type="password"
		//           required
		//           value={formData.password}
		//           onChange={handleChange}
		//           className="mt-1"
		//         />
		//       </div>

		//       <Button type="submit" className="w-full" disabled={loading}>
		//         {loading ? "Logging in..." : "Login"}
		//       </Button>
		//     </form>
		//   </div>
		// </div>
	);
};

export default AdminLogin;

// <div className="min-h-screen flex items-center justify-center bg-gray-100">
//   <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
//     <div className="text-center mb-8">
//       <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
//       <p className="text-gray-600 mt-2">Enter your credentials to access the admin dashboard</p>
//     </div>

//     {error && <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">{error}</div>}

//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div>
//         <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//           Email
//         </label>
//         <input
//           id="email"
//           name="email"
//           type="email"
//           required
//           value={formData.email}
//           onChange={handleChange}
//           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//         />
//       </div>

//       <div>
//         <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//           Password
//         </label>
//         <input
//           id="password"
//           name="password"
//           type="password"
//           required
//           value={formData.password}
//           onChange={handleChange}
//           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//         />
//       </div>

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {loading ? "Logging in..." : "Login"}
//       </button>
//     </form>
//   </div>
// </div>
