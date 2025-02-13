/** @format */

// import React from "react";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { MdOutlineLightMode, MdOutlineLocalPlay } from "react-icons/md";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { GiChampions, GiFallingOvoid, GiGoldBar } from "react-icons/gi";
import { TbBrandCupra } from "react-icons/tb";
import { TiArrowMaximise } from "react-icons/ti";
import { SlDiamond } from "react-icons/sl";
import { motion } from "framer-motion";
import { fadeIn } from "../variants";

const plans = [
	{
		icon: (
			<MdOutlineLightMode className='w-16 h-16 mb-3 text-primary group-hover:text-secondary border p-3 bg-gray-100 rounded-tl-3xl rounded-br-3xl group-hover:bg-gray-300 transition duration-300' />
		),
		title: "Rookie Plan",
		checkmarkIcon: (
			<IoShieldCheckmarkSharp className='w-3 h-3 text-[#00c30b]' />
		),
		investAmount: "$20.00   ",
		receive: "TO RECEIVE",
		receiveAmount: "$60.00",
		duration: "24/hrs Antiminar",
		button: "INVEST NOW",
	},
	{
		icon: (
			<GiFallingOvoid className='w-16 h-16 mb-3 text-primary group-hover:text-secondary border p-3 bg-gray-100 rounded-tl-3xl rounded-br-3xl group-hover:bg-gray-300 transition duration-300' />
		),
		title: "Dexi Plan",
		checkmarkIcon: (
			<IoShieldCheckmarkSharp className='w-3 h-3 text-[#00c30b]' />
		),
		investAmount: "$500.00",
		receive: "TO RECEIVE",
		receiveAmount: "$1,500.00",
		duration: "24/hrs",
		button: "INVEST NOW",
	},
	{
		icon: (
			<GiChampions className='w-16 h-16 mb-3 text-primary group-hover:text-secondary border p-3 bg-gray-100 rounded-tl-3xl rounded-br-3xl group-hover:bg-gray-300 transition duration-300' />
		),
		title: "Onic Plan",
		checkmarkIcon: (
			<IoShieldCheckmarkSharp className='w-3 h-3 text-[#00c30b]' />
		),
		investAmount: "$1,000.00",
		receive: "TO RECEIVE",
		receiveAmount: "$3,000.00",
		duration: "12/hrs Mining",
		button: "INVEST NOW",
	},
	{
		icon: (
			<TbBrandCupra className='w-16 h-16 mb-3 text-primary group-hover:text-secondary border p-3 bg-gray-100 rounded-tl-3xl rounded-br-3xl group-hover:bg-gray-300 transition duration-300' />
		),
		title: "Apex Plan",
		checkmarkIcon: (
			<IoShieldCheckmarkSharp className='w-3 h-3 text-[#00c30b]' />
		),
		investAmount: "$2,000.00",
		receive: "TO RECEIVE",
		receiveAmount: "$6,000.00",
		duration: "12/hrs Mining",
		button: "INVEST NOW",
	},
	{
		icon: (
			<TiArrowMaximise className='w-16 h-16 mb-3 text-primary group-hover:text-secondary border p-3 bg-gray-100 rounded-tl-3xl rounded-br-3xl group-hover:bg-gray-300 transition duration-300' />
		),
		title: "Max Plan",
		checkmarkIcon: (
			<IoShieldCheckmarkSharp className='w-3 h-3 text-[#00c30b]' />
		),
		investAmount: "$5,000.00",
		receive: "TO RECEIVE",
		receiveAmount: "$20,000.00",
		duration: "12/hrs Mining",
		limit: "Unlimited Withdrawal",
		button: "INVEST NOW",
	},
	{
		icon: (
			<GiGoldBar className='w-16 h-16 mb-3 text-primary group-hover:text-secondary border p-3 bg-gray-100 rounded-tl-3xl rounded-br-3xl group-hover:bg-gray-300 transition duration-300' />
		),
		title: "GOLD PLATINUM",
		checkmarkIcon: (
			<IoShieldCheckmarkSharp className='w-3 h-3 text-[#00c30b]' />
		),
		investAmount: "$10,000.00",
		receive: "TO RECEIVE",
		receiveAmount: "$45,000.00",
		duration: "12/hrs Mining",
		limit: "Unlimited Withdrawal",
		button: "INVEST NOW",
	},
	{
		icon: (
			<SlDiamond className='w-16 h-16 mb-3 text-primary group-hover:text-secondary border p-3 bg-gray-100 rounded-tl-3xl rounded-br-3xl group-hover:bg-gray-300 transition duration-300' />
		),
		title: "DIAMOND PLATINUM",
		checkmarkIcon: (
			<IoShieldCheckmarkSharp className='w-3 h-3 text-[#00c30b]' />
		),
		investAmount: "$20,000.00",
		receive: "TO RECEIVE",
		receiveAmount: "$100,000.00",
		duration: "12/hrs Mining",
		limit: "Unlimited Withdrawal",
		principle: "Principle Included",
		button: "INVEST NOW",
	},
	{
		icon: (
			<MdOutlineLocalPlay className='w-16 h-16 mb-3 text-primary group-hover:text-secondary border p-3 bg-gray-100 rounded-tl-3xl rounded-br-3xl group-hover:bg-gray-300 transition duration-300' />
		),
		title: "CLASSIC PLATINUM",
		checkmarkIcon: (
			<IoShieldCheckmarkSharp className='w-3 h-3 text-[#00c30b]' />
		),
		investAmount: "$50,000.00",
		receive: "TO RECEIVE",
		receiveAmount: "$200,000.00",
		duration: "24/hrs",
		limit: "Unlimited Withdrawal",
		earning: "Receive earning Every 5 minutes",
		button: "INVEST NOW",
	},
];

const Schema = () => {
	return (
		<>
			<div className='bg-primary rounded-br-3xl rounded-bl-3xl'>
				<Nav />
			</div>

			<div className='container mx-auto px-4 py-16 md:pb-32 bg-gray-200'>
				<motion.div
					variants={fadeIn("down", 0.2)}
					initial='hidden'
					whileInView={"show"}
					// viewport={once:false, amount: 0.7}
					className='md:text-center'>
					<h2 className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-center text-3xl md:text-4xl font-bold mb-10'>
						Choose You<span className=''>r Right Plan!</span>
					</h2>
					<p className='text-gray-500 ml-4 md:text-lg font-medium md:mx-28'>
						Select from the best plans, ensuring a perfect match.
					</p>
					<p className='text-gray-500 ml-4 md:text-lg font-medium md:mx-28'>
						The plans we offer is specifically made for you.
					</p>
				</motion.div>

				<motion.div
					variants={fadeIn("up", 0.3)}
					initial='hidden'
					whileInView={"show"}
					className='mt-5'>
					<div className='md:flex items-center justify-between md:gap-36 bg-gray-100 shadow-md mx-4 md:mx-72 px-3 md:px-32 md:pl-3 py-3 rounded-2xl mb-16 md:mb-0'>
						<p className='text-primary bg-gradient-to-r from-secondary mb-4 md:mb-0 to-secondary text-center md:px-32 rounded-2xl shadow-md font-semibold py-2'>
							Monthly
						</p>
						<p className='text-primary font-semibold text-center'>Quarterly</p>
					</div>
				</motion.div>

				<motion.div className='md:mt-24 container mx-auto px-4'>
					<div className='grid md:grid-cols-4 gap-10 md:gap-4'>
						{plans.map((plan) => (
							<motion.div
								variants={fadeIn("down", 0.3)}
								initial='hidden'
								whileInView={"show"}
								className='group px-3 py-10 pb-5 border-[0.5px] bg-gray-100 hover:bg-[#1e656c0c] shadow-md'>
								<div className='mb-9 border-b-[1px] border-primary pb-3'>
									<span>{plan.icon}</span>
									<h2 className='text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary text-2xl font-medium'>
										{plan.title}
									</h2>
								</div>

								<div className=''>
									<div className='mb-14 border-b-[1px] border-secondary pb-3'>
										<p className='flex items-center gap-2 mb-2  text-gray-500 text-base'>
											<span>{plan.checkmarkIcon}</span>{" "}
											<span className='text-red-600 text-xs'>
												{plan.investAmount}
											</span>{" "}
											<span>{plan.receive}</span>{" "}
											<span className='text-green-600 text-xs'>
												{plan.receiveAmount}
											</span>
										</p>
										<p className='flex items-center gap-2 mb-3  text-gray-500 text-base'>
											<span>{plan.checkmarkIcon}</span> {plan.duration}
										</p>
										<p className='flex items-center gap-2 mb-3  text-gray-500 text-base'>
											<span>{plan.checkmarkIcon}</span> {plan.limit}
										</p>
										<p className='flex items-center gap-2 mb-3  text-gray-500 text-base'>
											<span>{plan.checkmarkIcon}</span> {plan.principle}
										</p>
										<p className='flex items-center gap-2 mb-3  text-gray-500 text-base'>
											<span>{plan.checkmarkIcon}</span> {plan.earning}
										</p>
									</div>

									<div className='flex items-center justify-center'>
										<a
											href='#'
											className='border px-8 rounded-3xl py-2 text-gray-200 group-hover:text-white bg-primary group-hover:bg-gradient-to-r group-hover:animate-bounce from-primary via-secondary transition duration-300 font-semibold text-sm  to-primary'>
											{plan.button}
										</a>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
			<Footer />
		</>
	);
};

export default Schema;
