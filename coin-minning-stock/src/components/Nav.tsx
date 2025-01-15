/** @format */

import React from "react";
import { BrowserRouter as Router, Route, Routes, Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn } from "../variants";

const Nav = () => {
	return (
		<>
			<nav className='md:px-10'>
				<div className='flex justify-between items-center '>
					<motion.div variants={fadeIn("right", 0.1)}
																initial='hidden'
																whileInView={"show"}>
						<p className='text-[#25868d] text-3xl'>
							{" "}
							<span className='font-[]'>CM</span>S
						</p>
					</motion.div>

					{/* <Routes> */}
						<motion.div variants={fadeIn("down", 0.1)}
																	initial='hidden'
																	whileInView={"show"} className='text-white md:px-10 md:pt-1 md:pb-3 md:ml-24 rounded-br-full rounded-bl-full md:mb-12 bg-gradient-to-t from-[#95a2094e] via-[#95a20916] to-[#95a2094e]'>
							<ul className=" hidden md:flex gap-8 text-gray-200 font-medium text-base">
								<li>
									<NavLink to='/' className="hover:border-b-4 active:bg-gray border-secondary  hover:text-gray-200 transition duration-300 px- py-1">Home</NavLink>
								</li>
								<li>
									<NavLink to='/about' className="hover:border-b-4 border-secondary  hover:text-gray-200 transition duration-300 px- py-1">About</NavLink>
								</li>
								<li>
									<NavLink to='/contact' className="hover:border-b-4 border-secondary  hover:text-gray-200 transition duration-300 px- py-1">Contact</NavLink>
								</li>
								<li>
									<NavLink to='/how-it-works' className="hover:border-b-4 border-secondary  hover:text-gray-200 transition duration-300 px- py-1">How It Works</NavLink>
								</li>
								<li>
									<NavLink to='/schema' className="hover:border-b-4 border-secondary  hover:text-gray-200 transition duration-300 px- py-1">Schema</NavLink>
								</li>
								<li>
									<NavLink to='/ranking' className="hover:border-b-4 border-secondary  hover:text-gray-200 transition duration-300 px- py-1">Ranking</NavLink>
								</li>
							</ul>
						</motion.div>
					{/* </Routes> */}

					<motion.div variants={fadeIn("left", 0.1)}
																initial='hidden'
																whileInView={"show"}>
						<div className='flex gap-3'>
							<a
								href='#'
								className='bg-gray-200 hover:bg-gray-400 text-sm md:text-base transition duration-300 text-primary md:font-semibold rounded-lg px-4 py-1'>
								Register
							</a>
							<a
								href='#'
								className='bg-[#e5f33d] text-gray-500 font-semibold rounded-lg px-6 py-1'>
								Login
							</a>
						</div>
					</motion.div>
				</div>
			</nav>
		</>
	);
};

export default Nav;
