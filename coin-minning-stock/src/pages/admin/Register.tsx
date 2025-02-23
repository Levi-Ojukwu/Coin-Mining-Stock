"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import  toast  from "sooner"
import { useAuth } from "../../contexts/Authcontex"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"

const AdminRegister = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { register } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
        [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // try {
    //   const response = await axios.post("http://127.0.0.1:8000/api/admin/register", formData)
    //   localStorage.setItem("admin_token", response.data.token)
    //   navigate("/admin/login")
    // } catch (error: any) {
    //   console.error("Registration failed:", error)
    //   setError(error.response?.data?.error || "Registration failed")
    // } finally {
    //   setLoading(false)
    // }

    try {
      const response = await register(formData, true) // true for admin registration
      toast.success(response.message || "Registration successful! Please login to continue.")
      navigate("/admin/login") // Always redirect to login after admin registration
    } catch (error) {
      console.error("Registration failed:", error)
      toast.error("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gray-100">
    //   <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
    //     <div className="text-center mb-8">
    //       <h2 className="text-3xl font-bold text-gray-900">Admin Registration</h2>
    //       <p className="text-gray-600 mt-2">Create a new admin account</p>
    //     </div>

    //     {error && <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">{error}</div>}

    //     <form onSubmit={handleSubmit} className="space-y-6">
    //       <div>
    //         <label htmlFor="name" className="block text-sm font-medium text-gray-700">
    //           Name
    //         </label>
    //         <input
    //           id="name"
    //           name="name"
    //           type="text"
    //           required
    //           value={formData.name}
    //           onChange={handleChange}
    //           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    //         />
    //       </div>

    //       <div>
    //         <label htmlFor="username" className="block text-sm font-medium text-gray-700">
    //           Username
    //         </label>
    //         <input
    //           id="username"
    //           name="username"
    //           type="text"
    //           required
    //           value={formData.username}
    //           onChange={handleChange}
    //           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    //         />
    //       </div>

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

    //       <div>
    //         <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
    //           Confirm Password
    //         </label>
    //         <input
    //           id="password_confirmation"
    //           name="password_confirmation"
    //           type="password"
    //           required
    //           value={formData.password_confirmation}
    //           onChange={handleChange}
    //           className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    //         />
    //       </div>

    //       <button
    //         type="submit"
    //         disabled={isLoading}
    //         className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    //       >
    //         {isLoading ? "Creating account..." : "Register"}
    //       </button>
    //     </form>
    //   </div>
    // </div>

    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Registration</h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Full Name"
            />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Username"
            />
          </div>
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
          <div>
            <Label htmlFor="password_confirmation">Confirm Password</Label>
            <Input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password_confirmation}
              onChange={handleChange}
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
              placeholder="Confirm password"
            />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default AdminRegister

