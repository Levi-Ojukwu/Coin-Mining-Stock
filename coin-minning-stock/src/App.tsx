/** @format */

import { useState } from "react";
// import './App.css'
import "./index.css";
import "./output.css";
import Hero from "./components/Hero";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./components/Nav";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import Schema from "./pages/Schema";
import Ranking from "./pages/Ranking";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

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
						path='/sign-up'
						element={<SignUp />}
					/>
					<Route
						path='/login'
						element={<Login />}
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
