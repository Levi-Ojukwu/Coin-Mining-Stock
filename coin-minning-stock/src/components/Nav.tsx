/** @format */

import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

const Nav = () => {
	return (
		<>
			<nav className='md:px-10 md:py-3'>
				<div className='flex justify-between items-center '>
					<div>
						<p className='text-[#25868d] text-3xl'>
							{" "}
							<span className='font-[]'>CM</span>S
						</p>
					</div>

					<Router>
						<div className='flex gap-7 text-white'>
							<ul>
								<li>
									<Link to='/'>Home</Link>
								</li>
								<li>
									<Link to='/about'>About</Link>
								</li>
								<li>
									<Link to='/contact'>Contact</Link>
								</li>
								<li>
									<Link to='/how-it-works'>How It Works</Link>
								</li>
								<li>
									<Link to='/schema'>Schema</Link>
								</li>
								<li>
									<Link to='/ranking'>Ranking</Link>
								</li>
							</ul>
						</div>
					</Router>

					<div>
						<div className='flex gap-3'>
							<a
								href='#'
								className='bg-[#00565c] hover:bg-[#25868d] duration-75 ease-in text-white font-semibold rounded-lg px-4 py-1'>
								Register
							</a>
							<a
								href='#'
								className='bg-[#e5f33d] text-gray-500 font-semibold rounded-lg px-6 py-1'>
								Login
							</a>
						</div>
					</div>
				</div>
			</nav>
		</>
	);
};

export default Nav;
