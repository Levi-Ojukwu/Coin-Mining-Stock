/** @format */

import React from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import {
	TbCircleDashedNumber1,
	TbCircleDashedNumber2,
	TbCircleDashedNumber3,
	TbCircleDashedNumber4,
	TbHexagonNumber1,
} from "react-icons/tb";
import { PiShootingStarDuotone } from "react-icons/pi";
import { motion } from "framer-motion";
import { fadeIn } from "../variants";

const badges = [
	{
		icon: <TbCircleDashedNumber1 className="w-16 h-16 text-gray-200 rounded-full shadow-md border p-2 bg-gradient-to-b from-[#1e666c57] via-primary to-secondary"/>,
		title: "Member",
		description: "Sign up to the platform, to become a Member",
	},
	{
		icon: <TbCircleDashedNumber2 className="w-16 h-16 text-gray-200 rounded-full shadow-md border p-2 bg-gradient-to-b from-[#1e666c57] via-primary to-secondary"/>,
		title: "Leader",
		description:
			"You achieve Leadership status upon earning $50 from the platform",
	},
	{
		icon: <TbCircleDashedNumber3 className="w-16 h-16 text-gray-200 rounded-full shadow-md border p-2 bg-gradient-to-b from-[#1e666c57] via-primary to-secondary"/>,
		title: "Captain",
		description:
			"You achieve Captain status upon earning $200 from the platform",
	},
	{
		icon: <PiShootingStarDuotone className="w-16 h-16 text-gray-200 rounded-full shadow-md border p-2 bg-gradient-to-b from-[#1e666c57] via-primary to-secondary"/>,
		title: "Victor",
		description:
			"You achieve Victor status upon earning $500 from the platform",
	},
];

const Ranking = () => {
	return (
		<>
			<div className='bg-primary rounded-br-3xl rounded-bl-3xl'>
				<Nav />
			</div>
			<div className='container mx-auto px-4 py-16 md:pb-16'>
				<div className='text-center'>
					<motion.h2 variants={fadeIn("down", 0.2)}
                    initial='hidden'
                    whileInView={"show"} className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-center text-4xl font-bold mb-10'>
						Ranking<span className=''> Page</span>
					</motion.h2>
					<motion.p variants={fadeIn("down", 0.2)}
                    initial='hidden'
                    whileInView={"show"} className='text-gray-500 text-lg font-medium md:mx-28'>
						Explore all the badges here
					</motion.p>
				</div>

				<div>
					<div className=' flex flex-col md:grid grid-cols-4 gap-4 items-center justify-center mt-5 md:mt-24'>
						{badges.map((badge) => (
							<motion.div variants={fadeIn("down", 0.1)}
              initial='hidden'
              whileInView={"show"} className="flex flex-col rounded-xl group hover:bg-gradient-to-br transition duration-300 from-[#1e666c28] via-[#e6fb0434] to-[#1e666c57] items-enter justify-center px-4 py-10 bg-gray-50 shadow-sm border-[0.5px] gap-5">
                <div className='flex items-end gap-2 mb-8'>
								<span className="group-hover:animate-bounce">{badge.icon}</span>
								<h2 className="text-lg text-primary font-semibold">{badge.title}</h2>
							</div>

              <div>
                <p className="text-gray-500 group-hover:text-white text-sm font-medium">{badge.description}</p>
              </div>
              </motion.div>
						))}
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default Ranking;
