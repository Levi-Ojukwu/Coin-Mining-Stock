/** @format */

// import { useState } from "react";
// import './App.css'
import "./index.css";
import "./output.css";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import "./components/Nav";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import Schema from "./pages/Schema";
import Ranking from "./pages/Ranking";
// import SignUp from "./pages/Register";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CryptoAddresses from "./components/CryptoAddresses";
import AdminLogin from "./pages/admin/Login";
import AdminRegister from "./pages/admin/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { AuthProvider } from "./contexts/Authcontex";

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const token = localStorage.getItem("admin_token");
	if (!token) {
		return (
			<Navigate
				to='/admin/login'
				replace
			/>
		);
	}
	return <>{children}</>;
};

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route
						index
						element={<Home />}
					/>
					<Route
						path='/'
						element={<Home />}
					/>
					<Route
						path='/about'
						element={<About />}
					/>
					<Route
						path='/contact'
						element={<Contact />}
					/>
					<Route
						path='/how-it-works'
						element={<HowItWorks />}
					/>
					<Route
						path='/schema'
						element={<Schema />}
					/>
					<Route
						path='/ranking'
						element={<Ranking />}
					/>
					<Route
						path='/register'
						element={<Register />}
					/>
					<Route
						path='/login'
						element={<Login />}
					/>
					<Route
						path='/dashboard'
						element={<Dashboard />}
					/>
					<Route
						path='/deposit'
						element={<CryptoAddresses />}
					/>

					<Route
						path='/admin/login'
						element={<AdminLogin />}
					/>

					<Route
						path='/admin/register'
						element={<AdminRegister />}
					/>

					<Route
						path='/admin/dashboard'
						element={
							<ProtectedRoute>
								<AdminDashboard />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
