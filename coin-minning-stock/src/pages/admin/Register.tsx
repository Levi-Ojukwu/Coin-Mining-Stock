/** @format */

"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios"
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContex";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription } from "../../components/ui/alert";

interface ValidationErrors {
	[key: string]: string[];
}

const AdminRegister = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		username: "",
		email: "",
		password: "",
		password_confirmation: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
		{},
	);
	const { register } = useAuth();

	// const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	//   setFormData((prev) => ({
	//     ...prev,
	//       [e.target.name]: e.target.value,
	//   }))
	// }

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		// Clear validation error for this field when user starts typing
		if (validationErrors[name]) {
			setValidationErrors((prev) => ({
				...prev,
				[name]: [],
			}));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setValidationErrors({});

		try {
			const response = await register(formData, true); // true for admin registration
			toast.success(
				response.message ||
					"Registration successful! Please login to continue.",
			);
			navigate("/admin/login"); // Always redirect to login after admin registration
		} catch (error: any) {
			console.error("Registration failed:", error);

			if (error.response?.data?.messages) {
				setValidationErrors(error.response.data.messages);
				// Show the first validation error as a toast
				const firstError = Object.values(error.response.data.messages)[0];
				if (Array.isArray(firstError) && firstError.length > 0) {
					toast.error(firstError[0]);
				}
			} else {
				toast.error(
					error.response?.data?.error ||
						"Registration failed. Please try again.",
				);
			}
			// toast.error("Registration failed. Please try again.")
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Admin Registration
					</h2>
					<p className='mt-2 text-center text-sm text-gray-600'>
						Already have an account?{" "}
						<Link
							to='/admin/login'
							className='font-medium text-primary hover:text-primary/90'>
							Sign in
						</Link>
					</p>
				</div>

				<form
					className='mt-8 space-y-6'
					onSubmit={handleSubmit}>
					<div className='rounded-md shadow-sm space-y-4'>
						<div>
							<Label htmlFor='name'>Name</Label>
							<Input
								id='name'
								name='name'
								type='text'
								required
								value={formData.name}
								onChange={handleChange}
								className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
									validationErrors.name ? "border-red-300" : "border-gray-300"
								}`}
								placeholder='Full Name'
							/>
							{validationErrors.name && (
								<p className='mt-1 text-sm text-red-600'>
									{validationErrors.name[0]}
								</p>
							)}
						</div>

						<div>
							<Label htmlFor='username'>Username</Label>
							<Input
								id='username'
								name='username'
								type='text'
								required
								value={formData.username}
								onChange={handleChange}
								className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
									validationErrors.username
										? "border-red-300"
										: "border-gray-300"
								}`}
								placeholder='Username'
							/>
							{validationErrors.username && (
								<p className='mt-1 text-sm text-red-600'>
									{validationErrors.username[0]}
								</p>
							)}
						</div>

						<div>
							<Label htmlFor='email'>Email address</Label>
							<Input
								id='email'
								name='email'
								type='email'
								autoComplete='email'
								required
								value={formData.email}
								onChange={handleChange}
								className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
									validationErrors.email ? "border-red-300" : "border-gray-300"
								}`}
								placeholder='Email address'
							/>
							{validationErrors.email && (
								<p className='mt-1 text-sm text-red-600'>
									{validationErrors.email[0]}
								</p>
							)}
						</div>

						<div>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								name='password'
								type='password'
								autoComplete='new-password'
								required
								value={formData.password}
								onChange={handleChange}
								className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
									validationErrors.password
										? "border-red-300"
										: "border-gray-300"
								}`}
								placeholder='Password'
							/>
							{validationErrors.password && (
								<p className='mt-1 text-sm text-red-600'>
									{validationErrors.password[0]}
								</p>
							)}
						</div>

						<div>
							<Label htmlFor='password_confirmation'>Confirm Password</Label>
							<Input
								id='password_confirmation'
								name='password_confirmation'
								type='password'
								autoComplete='new-password'
								required
								value={formData.password_confirmation}
								onChange={handleChange}
								className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${
									validationErrors.password_confirmation
										? "border-red-300"
										: "border-gray-300"
								}`}
								placeholder='Confirm password'
							/>
							{validationErrors.password_confirmation && (
								<p className='mt-1 text-sm text-red-600'>
									{validationErrors.password_confirmation[0]}
								</p>
							)}
						</div>
					</div>

					{Object.keys(validationErrors).length > 0 && (
						<Alert variant='destructive'>
							<AlertDescription>
								Please correct the errors in the form before submitting.
							</AlertDescription>
						</Alert>
					)}

					<div>
						<Button
							type='submit'
							disabled={isLoading}
							className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'>
							{isLoading ? "Registering..." : "Register"}
						</Button>
					</div>

					<div className='text-center'>
						<Link
							to='/login'
							className='text-sm text-gray-600 hover:text-primary'>
							User Login
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AdminRegister;
