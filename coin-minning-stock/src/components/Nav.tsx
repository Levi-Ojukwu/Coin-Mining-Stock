/** @format */

import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn } from "../variants";
import { RiMenu4Line } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
// import { TbCurrencyDollar } from "react-icons/tb";
// import { PiCurrencyDollarDuotone } from "react-icons/pi";

const Nav = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};
	return (
		<>
			<nav className='px-4 py- md:px-10 z-50'>
				<div className='flex justify-between items-center '>
					<motion.div
						variants={fadeIn("right", 0.1)}
						initial='hidden'
						whileInView={"show"}>
						<p className='text-secondary flex py-1 md:py-0 font-serif text-2xl'>
							{" "}
							<span className='font-[] z-50'>CMS.</span>
						</p>
						{/* <p className='text-secondary flex py-1 md:py-0 font-serif text-base'>
							{" "}
							<span className='font-[]'>CM</span><span className="flex items-center"><PiCurrencyDollarDuotone className="w-10 border-[0.00001px] shadow-md shadow-secondary bg-gradient-to-b from-[#849003fb] via-primary to-[#727b0798] h-10"/><span>tock</span></span>
						</p> */}
					</motion.div>

					{/* <Routes> */}
					<motion.div
						variants={fadeIn("down", 0.1)}
						initial='hidden'
						whileInView={"show"}
						className='text-white z-50 md:px-10 md:pt-1 md:pb-3 md:ml-20 rounded-br-full rounded-bl-full md:mb-12 bg-gradient-to-t from-[#95a2094e] via-[#95a20916] to-[#95a2094e]'>
						<ul className=' hidden md:flex gap-8 text-gray-200 font-medium text-base'>
							<li>
								<NavLink
									to='/'
									className='hover:border-b-4 active:bg-gray border-secondary  hover:text-gray-200 transition duration-300 px- py-1'>
									Home
								</NavLink>
							</li>
							<li>
								<NavLink
									to='/about'
									className='hover:border-b-4 border-secondary  hover:text-gray-200 transition duration-300 px- py-1'>
									About
								</NavLink>
							</li>
							<li>
								<NavLink
									to='/contact'
									className='hover:border-b-4 border-secondary  hover:text-gray-200 transition duration-300 px- py-1'>
									Contact
								</NavLink>
							</li>
							<li>
								<NavLink
									to='/how-it-works'
									className='hover:border-b-4 border-secondary  hover:text-gray-200 transition duration-300 px- py-1'>
									How It Works
								</NavLink>
							</li>
							<li>
								<NavLink
									to='/schema'
									className='hover:border-b-4 border-secondary  hover:text-gray-200 transition duration-300 px- py-1'>
									Schema
								</NavLink>
							</li>
							<li>
								<NavLink
									to='/ranking'
									className='hover:border-b-4 border-secondary  hover:text-gray-200 transition duration-300 px- py-1'>
									Ranking
								</NavLink>
							</li>
						</ul>
					</motion.div>
					{/* </Routes> */}

					<motion.div
						variants={fadeIn("left", 0.1)}
						initial='hidden'
						whileInView={"show"}>
						<div className='md:flex gap-3'>
							<Link
								to='/register'
								className='bg-gray-200 z-50 hidden md:flex hover:bg-gray-400 text-sm md:text-base transition duration-300 text-primary md:font-semibold rounded-lg px-4 py-1'>
								Register
							</Link>
							<Link
								to='/login'
								className='bg-[#e5f33d] z-50 hidden md:flex text-gray-500 font-semibold rounded-lg px-6 py-1'>
								Login
							</Link>
						</div>

						<div>
							<div className=''>
								<span className='md:hidden'>
									<RiMenu4Line
										className='w-6 h-6 text-secondary'
										onClick={toggleMenu}
									/>
								</span>
							</div>
						</div>
					</motion.div>
				</div>

				<div
					className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
						isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
					}`}
					onClick={toggleMenu}>
					<div
						className={`fixed insert-y-0 left-0 w-[80%] bg-primary px-4 pt-2 pb-10 z-40 transition-transform duration-300 transform ${
							isMenuOpen ? "translate-x-0" : "-translate-x-full"
						}`}
						onClick={(e) => e.stopPropagation()}>
						<div className='flex justify-between items-center'>
							<p className='text-secondary flex py-1 md:py-0 font-serif text-2xl'>
								{" "}
								<span className='font-[]'>CMS.</span>
							</p>
							{/* <p className='text-secondary flex py-1 md:py-0 font-serif text-base'>
							{" "}
							<span className='font-[]'>CM</span><span className="flex items-center"><PiCurrencyDollarDuotone className="w-10 border-[0.00001px] bg-gradient-to-b from-[#849003fb] via-primary to-[#727b0798] h-10"/><span>tock</span></span>
						</p> */}
							<IoClose
								className='w-6 h-6 text-secondary'
								onClick={toggleMenu}
							/>
						</div>

						<div className='mt-8'>
							<ul className='flex flex-col gap-5 text-gray-200 font-medium text-base'>
								<li>
									<NavLink
										to='/'
										className='hover:border-b-4 active:bg-gray border-secondary  hover:text-gray-200 transition duration-300 px- py-1'>
										Home
									</NavLink>
								</li>
								<li>
									<NavLink
										to='/about'
										className='hover:border-b-4 border-secondary  hover:text-gray-200 transition duration-300 px- py-1'>
										About
									</NavLink>
								</li>
								<li>
									<NavLink
										to='/contact'
										className='hover:border-b-4 border-secondary  hover:text-gray-200 transition duration-300 px- py-1'>
										Contact
									</NavLink>
								</li>
								<li>
									<NavLink
										to='/how-it-works'
										className='hover:border-b-4 border-secondary  hover:text-gray-200 transition duration-300 px- py-1'>
										How It Works
									</NavLink>
								</li>
								<li>
									<NavLink
										to='/schema'
										className='hover:border-b-4 border-secondary  hover:text-gray-200 transition duration-300 px- py-1'>
										Schema
									</NavLink>
								</li>
								<li>
									<NavLink
										to='/ranking'
										className='hover:border-b-4 border-secondary  hover:text-gray-200 transition duration-300 px- py-1'>
										Ranking
									</NavLink>
								</li>
							</ul>
						</div>

						<div className='mt-10'>
							<div className='flex gap-3'>
								<Link
									to='/register'
									className='bg-gray-200 hover:bg-gradient-to-r from-secondary via-primary to-secondary text-base transition duration-300 hover:text-gray-100 text-primary font-semibold rounded-lg px-4 py-1'>
									Register
								</Link>
								<Link
									to='/login'
									className='bg-[#e5f33d] text-gray-600 font-semibold rounded-lg px-5 py-1'>
									Login
								</Link>
							</div>
						</div>
					</div>
				</div>
			</nav>
		</>
	);
};

export default Nav;
