/** @format */

// import React from "react";
import { GiChampions, GiFallingOvoid } from "react-icons/gi";
import { IoShieldCheckmarkSharp } from "react-icons/io5";
import { MdOutlineLightMode } from "react-icons/md";
import { TbBrandCupra } from "react-icons/tb";
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
];

const HomeSchema = () => {
	return (
		<>
			<div className='md:py-20 py-10 md:px-10 px-5'>
				<div className='mb-10'>
					<h2 className='text-lg mb-3 uppercase font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-primary to-secondary'>
						Investment Package
					</h2>
					<h1 className='text-4xl font-semibold font-serif text-gray-700 mb-3'>
						Choose The Best Plan That Best Suits You.
					</h1>
					<p className='text-gray-500 w-[60%] mb-3'>
						Select from the best plans, ensuring a perfect match. The plans we
						offer is specifically made for you.
					</p>
				</div>

				<motion.div className='md:mt- container mx-auto '>
					<div className='grid md:grid-cols-4 gap-5 md:gap-4'>
						{plans.map((plan, index) => (
							<motion.div
								key={index}
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
									<div className='mb-14 border-b-[1px] border-secondary pb-3 py-10'>
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

				<div className='mt-14 flex justify-center'>
					<a
						href='/schema'
						className='bg-secondary hover:shadow-lg transition duration-300 px-5 py-2 text-lg font-semibold rounded-lg '>
						{" "}
						<span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-400'>
							View All Plans
						</span>
					</a>
				</div>
			</div>
		</>
	);
};

export default HomeSchema;
