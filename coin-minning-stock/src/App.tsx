/** @format */

// import { useState } from "react";
// import './App.css'
import "./index.css";
import "./output.css";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";
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

function App() {

	return (
		<>
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
					
				</Routes>
			</Router>

			{/* <div>
          <div>
            <Hero />
          </div>
      </div>       */}
		</>
	);
}

export default App;
