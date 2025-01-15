/** @format */

import React from "react";
import Footer from "../components/Footer";
import { RxRocket } from "react-icons/rx";
import { RiLuggageDepositLine, RiMailCheckLine } from "react-icons/ri";
import { PiUserCircleCheckLight } from "react-icons/pi";
import { IoPersonOutline } from "react-icons/io5";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GoPeople } from "react-icons/go";
import Nav from "../components/Nav";
import { motion } from "framer-motion";
import { fadeIn } from "../variants";

const guides = [
	{
		icon: (
			<IoPersonOutline className='w-14 h-14 font-bold text-secondary border-2 mb-3 border-primary bg-gray-400 p-3 rounded-tl-2xl rounded-br-2xl group-hover:animate-bounce' />
		),
		title: "Sign Up",
		description:
			"Signing up on the website enables you to commence your operations seamlessly.",
	},
	{
		icon: (
			<RiMailCheckLine className='w-14 h-14 font-bold text-secondary border-2 mb-3 border-primary bg-gray-400 p-3 rounded-tl-2xl rounded-br-2xl group-hover:animate-bounce' />
		),
		title: "Email Verification",
		description:
			"Once an account is created, users are required to verify their email address to ensure the activation and security of their account.",
	},
	{
		icon: (
			<PiUserCircleCheckLight className='w-14 h-14 font-bold text-secondary border-2 mb-3 border-primary bg-gray-400 p-3 rounded-tl-2xl rounded-br-2xl group-hover:animate-bounce' />
		),
		title: "KYC Verification",
		description:
			"User must complete KYC verification before making withdrawals.",
	},
	{
		icon: (
			<RiLuggageDepositLine className='w-14 h-14 font-bold text-secondary border-2 mb-3 border-primary bg-gray-400 p-3 rounded-tl-2xl rounded-br-2xl group-hover:animate-bounce' />
		),
		title: "Deposit Money",
		description:
			"Users can deposit funds either through automated or manual payment gateways.",
	},
	{
		icon: (
			<RxRocket className='w-14 h-14 font-bold text-secondary border-2 mb-3 border-primary bg-gray-400 p-3 rounded-tl-2xl rounded-br-2xl group-hover:animate-bounce' />
		),
		title: "Schema Plans",
		description:
			"Users can invest in any available plan or scheme to earn profits, which will be credited to their profit wallet.",
	},
	{
		icon: (
			<FaMoneyBillTransfer className='w-14 h-14 font-bold text-secondary border-2 mb-3 border-primary bg-gray-400 p-3 rounded-tl-2xl rounded-br-2xl group-hover:animate-bounce' />
		),
		title: "Send/Transfer Money",
		description:
			"Users can transfer funds to other accounts seamlessly and in real-time.",
	},
	{
		icon: (
			<GoPeople className='w-14 h-14 font-bold text-secondary border-2 mb-3 border-primary bg-gray-400 p-3 rounded-tl-2xl rounded-br-2xl group-hover:animate-bounce' />
		),
		title: "Refer Friends",
		description:
			"Users are eligible to earn bonuses by successfully referring friends to the platform.",
	},
	{
		icon: (
			<RxRocket className='w-14 h-14 font-bold text-secondary border-2 mb-3 border-primary bg-gray-400 p-3 rounded-tl-2xl rounded-br-2xl group-hover:animate-bounce' />
		),
		title: "Withdraw Money",
		description:
			"Users can make withdrawals at any time, with various withdrawal options to meet their needs.",
	},
];

const HowItWorks = () => {
	return (
		<>
			<div className='bg-primary rounded-br-3xl rounded-bl-3xl'>
				<Nav />
			</div>
			<div className='container mx-auto px-4 py-16 md:pb-16'>
				<motion.div
					variants={fadeIn("down", 0.2)}
					initial='hidden'
					whileInView={"show"}
					className='text-center'>
					<h2 className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-center text-4xl font-bold mb-10'>
						How I<span className='text-secondary'>t Works</span>
					</h2>
					<p className='text-gray-500 text-lg font-medium md:mx-28'>
						This page serves as a comprehensive guide to understanding the
						functionality and workflow of the application
					</p>
				</motion.div>
			</div>

			<div className='bg-gradient-to-br from-secondary to-primary h-[1850px] md:h-[800px] pt-16'>
				<div className='bg-gray-100 h-[95%] mx-5 md:mx-10 md:px-4 md:py-10 shadow-lg'>
					<motion.h2
						variants={fadeIn("up", 0.4)}
						initial='hidden'
						whileInView={"show"}
						className='text-primary font-bold text-center md:text-left  text-lg md:text-2xl'>
						Get Started With 8 Easy Steps
					</motion.h2>

					<div className='md:mt-10 px-5 md:px-5'>
						<div className='grid md:grid-cols-4 gap-8 md:gap-0'>
							{guides.map((guide) => (
								<div>
									<div className='flex flex-col justify-center items-center md:px-5 md:py-6 group'>
										<motion.span
											variants={fadeIn("down", 0.2)}
											initial='hidden'
											whileInView={"show"}>
											{guide.icon}
										</motion.span>
										<motion.h2
											variants={fadeIn("down", 0.3)}
											initial='hidden'
											whileInView={"show"}
											className='text-center text-gray-700 font-bold text-lg mb-4'>
											{guide.title}
										</motion.h2>
										<motion.p
											variants={fadeIn("down", 0.4)}
											initial='hidden'
											whileInView={"show"}
											className='text-center text-gray-500 text-md'>
											{guide.description}
										</motion.p>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default HowItWorks;
