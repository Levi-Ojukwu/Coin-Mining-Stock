/** @format */

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoIosEye, IoIosEyeOff } from "react-icons/io"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TfiPencilAlt } from "react-icons/tfi";
import { IoLogInSharp } from "react-icons/io5";
import { RiLoginCircleFill } from "react-icons/ri";
import { FaRegHandshake } from "react-icons/fa6";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
})

type LoginFormData = z.infer<typeof loginSchema>

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
	const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
} = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
})

const onSubmit = async (data: LoginFormData) => {
  setLoading(true)
  setError("")
  setSuccess("")

  try {
    const response = await axios.post("http://127.0.0.1:8000/api/login", data)

    console.log("Response:", response.data)
    if (response.data.token && response.data.user) {
      setSuccess("Login successful!")
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      navigate("/dashboard")
    } else {
      setError("Invalid login response. Please try again.")
    }
  } catch (err: any) {
    if (err.response) {
      setError(err.response.data.error || "Login failed. Please try again.")
    } else {
      setError("Something went wrong. Please try again.")
    }
  } finally {
    setLoading(false)
  }
}

const togglePasswordVisibility = () => {
  setShowPassword(!showPassword)
}
	// const handleSubmit = async (e: any) => {
	// 	e.preventDefault();
	// 	setLoading(true);
	// 	setError("");
	// 	setSuccess("");

	// 	try {
	// 		const response = await axios.post("http://127.0.0.1:8000/api/login", {
	// 			email,
	// 			password,
	// 		});

	// 		console.log("Response:", response.data);
	// 		if (response.data.token && response.data.user) {
	// 			setSuccess("Login successful!");
	// 			localStorage.setItem("token", response.data.token);
	// 			localStorage.setItem("user", JSON.stringify(response.data.user));
	// 			navigate("/dashboard");
	// 		} else {
	// 			setError("Invalid login response. Please try again.");
	// 		}
	// 	} catch (err: any) {
	// 		setLoading(false);
	// 		if (err.response) {
	// 			setError(err.response.data.error || "Login failed. Please try again.");
	// 		} else {
	// 			setError("Something went wrong. Please try again.");
	// 		}
	// 	}
	// };

	return (
		<>
    <div className="flex justify-center items-center min-h-screen bg-[#00565c10]">
      <div className=" mx-auto bg-gradient-to-br from-[#e4f33d3d] via-[#e4f33d11] to-[#e4f33d92] px-5 md:px-12 py-10 rounded-lg shadow-lg w-full max-w-xl">
        <div className=" mb-7">
                    <div></div>
        
                    <div className="flex items-center gap-1 mb-1">
                      <span><FaRegHandshake className="w-14 h-12 text-primary"/></span>
                      <h2 className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r  from-primary  to-secondary'>
                      Welcome Back!
                      </h2>
                    </div>
        
                    <div>
                      <p className='text-gray-500 text-lg font-medium'>Login to access your CMS user panel.</p>
                    </div>
                  </div>
        <h2 className="text-2xl font-bold text-center mb-6"></h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-lg text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              {...register("email")}
              className="mt-1 block w-full  border-gray-300 shadow-md focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 bg-gray-50 text-gray-400 text-sm px-2 py-3"
              placeholder="Enter your email"
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password <span className="text-lg text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                {...register("password")}
                className="mt-1 block w-full  border-gray-300 shadow-md focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 bg-gray-50 text-gray-400 text-sm px-2 py-3"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? (
                  <IoIosEyeOff className="h-6 w-6 text-gray-700" />
                ) : (
                  <IoIosEye className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
            {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className=" py-2 px-10 border border-transparent rounded-md shadow-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div>
              <p className="text-center">Don't have an account? <span className=" font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-300"><a href="/register">Register for free</a></span></p>
            </div>
        </form>
        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-100 border border-red-400 rounded-md p-3">{error}</div>
        )}
        {success && (
          <div className="mt-4 text-sm text-green-600 bg-green-100 border border-green-400 rounded-md p-3">
            {success}
          </div>
        )}
      </div>
    </div>
			{/* <div className='d-flex justify-content-center align-items-center vh-100 bg-light'>
				<div
					className='card p-4 shadow'
					style={{ maxWidth: "400px", width: "100%" }}>
					<h2 className='text-center mb-4'>Login</h2>
					<form onSubmit={handleSubmit}>
						<div className='mb-3'>
							<label
								htmlFor='email'
								className='form-label'>
								Email:
							</label>
							<input
								type='email'
								id='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className='form-control'
								placeholder='Enter your email'
								required
							/>
						</div>
						<div className='mb-3'>
							<label
								htmlFor='password'
								className='form-label'>
								Password:
							</label>
							<input
								type='password'
								id='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className='form-control'
								placeholder='Enter your password'
								required
							/>
						</div>
						<button
							type='submit'
							className='btn btn-primary w-100'
							disabled={loading}>
							{loading ? "Logging in..." : "Login"}
						</button>
						{error && <div className='alert alert-danger mt-3'>{error}</div>}
						{success && (
							<div className='alert alert-success mt-3'>{success}</div>
						)}
					</form>
				</div>
			</div> */}
		</>
	);
};

export default Login;
