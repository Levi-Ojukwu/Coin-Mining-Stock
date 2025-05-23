/** @format */

"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { User } from "lucide-react";

interface User {
	id: number;
	name: string;
	email: string;
	role: "user" | "admin";
	username: string;
	phone_number?: string;
	balance?: number;
	total_withdrawal?: number;
}

interface AuthContextType {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	loading: boolean;
	error: string | null;
	login: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
	register: (userData: RegisterData, isAdmin?: boolean) => Promise<any>;
	logout: () => Promise<void>;
	clearError: () => void;
}

interface RegisterData {
	name: string;
	email: string;
	username: string;
	password: string;
	password_confirmation: string;
	phone_number?: string;
	country?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const storedUser = localStorage.getItem("user");

		if (token && storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch (e) {
				console.error("Failed to parse stored user:", e);
			}
		}
		setLoading(false);
	}, []);

	const login = async (email: string, password: string, isAdmin = false) => {
		try {
			setLoading(true);
			setError(null);

			const endpoint = isAdmin ? "/api/admin/login" : "/api/login";
			const response = await axios.post(
				`https://api.elitefarmmine.com${endpoint}`,
				{
					email,
					password,
				},
			);

			const { token, user: userData } = response.data;

			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(userData));
			setUser(userData);

			toast.success("Login successful!");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const errorMessage = error.response?.data?.error || "Login failed";
				setError(errorMessage);
				toast.error(errorMessage);
			} else {
				setError("An unexpected error occurred");
				toast.error("An unexpected error occurred");
			}
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const register = async (userData: RegisterData, isAdmin = false) => {
		try {
			setLoading(true);
			setError(null);

			const endpoint = isAdmin ? "/api/admin/register" : "/api/register";

			// Add debugging logs
			console.log(
				`Sending registration request to: https://api.elitefarmmine.com${endpoint}`,
			);
			console.log("Registration data:", userData);

			const response = await axios.post(
				`https://api.elitefarmmine.com${endpoint}`,
				userData,
				{
					headers: {
						"Content-Type": "application/json",
						"Accept": "application/json",
					},
					// Add timeout to prevent hanging requests
					timeout: 10000,
				},
			);

			console.log("Registration response:", response.data);

			if (response.data.message) {
				toast.success(response.data.message);
				return response.data;
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error("Registration error details:", {
					status: error.response?.status,
					statusText: error.response?.statusText,
					data: error.response?.data,
					headers: error.response?.headers,
					config: error.config,
				});

				if (error.response?.status === 405) {
					setError(
						"Method not allowed. The server doesn't accept POST requests at this endpoint.",
					);
					toast.error("Server configuration error. Please contact support.");
				} else if (error.response?.status === 422) {
					// Pass validation errors up to the component
					const validationErrors = error.response.data.messages;
					setError("Validation failed");
					// Show first validation error as toast
					const firstError = Object.values(validationErrors)[0];
					if (Array.isArray(firstError) && firstError.length > 0) {
						toast.error(firstError[0]);
					}
					throw error;
				} else {
          const errorMessage =
					error.response?.data?.error || "Registration failed";
				  setError(errorMessage);
				  toast.error(errorMessage);
        } 
			} else {
				setError("An unexpected error occurred");
				toast.error("An unexpected error occurred");
			}
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem("token");

			if (!token || !user) {
				throw new Error("No active session");
			}

			const endpoint =
				user?.role === "admin" ? "/api/admin/logout" : "/api/logout";
			await axios.post(`https://api.elitefarmmine.com${endpoint}`, null, {
				headers: { Authorization: `Bearer ${token}` },
			});

			localStorage.removeItem("token");
			localStorage.removeItem("user");
			setUser(null);
			toast.success("Logged out successfully");
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const errorMessage = error.response?.data?.error || "Logout failed";
				setError(errorMessage);
				toast.error(errorMessage);
			} else {
				setError("An unexpected error occurred");
				toast.error("An unexpected error occurred");
			}
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const clearError = () => setError(null);

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				loading,
				error,
				login,
				register,
				logout,
				clearError,
			}}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
