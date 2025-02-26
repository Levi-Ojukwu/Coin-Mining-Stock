import type { FC, ReactNode } from "react"
import { Navigate } from "react-router-dom"

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
//   const location = useLocation()

  const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("admin_token")
    const adminData = localStorage.getItem("admin_data")

    if (!token || !adminData) {
      console.log("No token or admin data found")
      return false
    }

    try {
      const admin = JSON.parse(adminData)
      const isValid = admin.role === "admin"
      console.log("Admin authentication check:", isValid)
      return isValid
    } catch (err) {
      console.error("Error parsing admin data:", err)
      return false
    }
  }

  if (!isAuthenticated()) {
    // console.log("Redirecting to login from:", location.pathname)
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute

