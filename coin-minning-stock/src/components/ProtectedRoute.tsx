import type { FC, ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation()

  const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("admin_token")
    const adminData = localStorage.getItem("admin_data")

    if (!token || !adminData) {
      console.log("Authentication failed: No token or admin data found")
      toast.error("Please login to access this page")
      return false
    }

    try {
      const admin = JSON.parse(adminData)
      const isValid = admin.role === "admin"

      if (!isValid) {
        console.log("Authentication failed: Invalid admin role")
        toast.error("Unauthorized access. Admin privileges required.")
      }
      return isValid
    } catch (err) {
      console.error("Authentication error:", err)
      toast.error("Session error. Please login again.")
      // Clear invalid data
      localStorage.removeItem("admin_token")
      localStorage.removeItem("admin_data")
      return false
    }
  }

  if (!isAuthenticated()) {
    console.log("Redirecting to login from:", location.pathname)
    // Save the attempted URL for redirecting after login
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

