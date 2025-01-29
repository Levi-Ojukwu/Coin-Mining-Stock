/** @format */

import React from "react";
import Hero from "../components/Hero";
import Nav from "../components/Nav";
import WhatsAppLink from "../components/WhatsAppLink";
import PopupModal from "../components/PopupModal";
import Footer from "../components/Footer";
import {
	GiCircleSparks,
	GiRollingEnergy,
	GiStaticWaves,
	GiSupersonicArrow,
} from "react-icons/gi";
import { MdOutlineSecurity } from "react-icons/md";
import { AiTwotoneTool } from "react-icons/ai";
import { div } from "framer-motion/client";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";
import { DiRuby } from "react-icons/di";
import { TbLockBitcoin } from "react-icons/tb";
import { RiStockFill, RiStockLine } from "react-icons/ri";
import { FaAccusoft } from "react-icons/fa6";
import HomeSchema from "../components/HomeSchema";
import { Link, Links } from "react-router-dom";

const products = [
	{
		logoIcon: <GiCircleSparks className='w-12 h-12 text-red-400' />,
		title: "Forex",
		rating: "4.5",
		description:
			"Access global currency markets and trade with top-tier spreads and leverage options. Stay ahead with in-depth analytics and market insights.",
		exchangeTitle: "Exchange:",
		exchange: "EUR/USD, USD/JPY, GPB/USD, ETC",
	},
	{
		logoIcon: <TbLockBitcoin className='w-12 h-12 text-indigo-600' />,
		title: "Crypto",
		rating: "4.0",
		description:
			"Invest in leading cryptocurrencies with robust security and real-time market data. Maximize your opportunities in the fast-paced crypto landscape.",
		exchangeTitle: "Exchange:",
		exchange: "EUR/USD, USD/JPY, GPB/USD, ETC",
	},
	{
		logoIcon: <GiStaticWaves className='w-12 h-12 text-pink-800' />,
		title: "Atica",
		rating: "3.8",
		description:
			"Diversify your portfolio with digital assets tailored for growth and stability. Experience seamless trading with top-tier risk management tools.",
		exchangeTitle: "Exchange:",
		exchange: "EUR/USD, USD/JPY, GPB/USD, ETC",
	},
	{
		logoIcon: <RiStockLine className='w-12 h-12 text-green-500' />,
		title: "Stock",
		rating: "4.6",
		description:
			"Invest in leading global companies and diversify your portfolio with our comprehensive range of stock trading options.",
		exchangeTitle: "Exchange:",
		exchange: "EUR/USD, USD/JPY, GPB/USD, ETC",
	},
	{
		logoIcon: <FaAccusoft className='w-12 h-12 text-yellow-500' />,
		title: "Indices",
		rating: "4.1",
		description:
			"Trade popular market indices and gain exposure to the performance of top economies worldwide.",
		exchangeTitle: "Exchange:",
		exchange: "EUR/USD, USD/JPY, GPB/USD, ETC",
	},
	{
		logoIcon: <GiRollingEnergy className='w-12 h-12 text-cyan-400' />,
		title: "Energies",
		rating: "4.5",
		description:
			"Invest in global energy markets, including oil, gas, and renewables. Capitalize on price movements and diversify your portfolio with our comprehensive energy trading solutions.",
		exchangeTitle: "Exchange:",
		exchange: "EUR/USD, USD/JPY, GPB/USD, ETC",
	},
];

const Home = () => {
	return (
		<>
			<Hero />
			<WhatsAppLink />
			<PopupModal />

			<div className='md:mx-10'>
				<div></div>
			</div>

			<div className='md:px-10 grid gap-5 py-20 grid-cols-3 bg-gray-100'>
				<div className='px-3 md:pb-7 py-10 bg-primary relative shadow-md rounded-lg'>
					<div className='mb-8'>
						<GiSupersonicArrow className='text-secondary w-6 h-6 absolute right-5 top-5' />
					</div>
					<h2 className='text-2xl font-semibold mb-4 text-gray-50'>
						Diverse Investment Options
					</h2>
					<p className='text-gray-400 mb-5'>
						Gain access to a wide range of cryptocurrencies and projects. Invest
						confidently and expand your portfolio.
					</p>
				</div>

				<div className='px-3 md:pb-7 py-10 bg-secondary relative shadow-md rounded-lg'>
					<div className='mb-8'>
						<MdOutlineSecurity className='text-primary w-7 h-7 absolute right-5 top-5' />
					</div>
					<h2 className='text-2xl font-semibold mb-4 text-primary'>
						Secure & Transparent Transactions
					</h2>
					<p className='text-gray-500 mb-5'>
						Benefit from a clear and secure trading environment with no hidden
						fees. Trust and transparency at every step.
					</p>
				</div>

				<div className='px-3 md:pb-7 py-10 bg-red-50 relative shadow-md rounded-lg'>
					<div className='mb-8'>
						<AiTwotoneTool className='text-red-800 w-8 h-8 absolute right-5 top-5' />
					</div>
					<h2 className='text-2xl font-semibold mb-4 text-red-400'>
						Advanced Analytical Tools
					</h2>
					<p className='text-gray-500 mb-5'>
						Leverage state-of-the-art tools and insights to stay ahead in the
						crypto market. Make informed investment decisions.
					</p>
				</div>
			</div>

			<div className='md:px-20 md:py-24'>
				<div className='flex w-full items-center gap-14'>
					<div className='w-[60%]'>
						<img
							className='rounded relative'
							src='https://cryptocoinspy.com/wp-content/uploads/2018/07/diamond-bitcoin-and-stock-charts.jpg'
							alt='About image'
						/>

						<div className='absolute left-7 border-[5px] border-secondary top-[1100px] py-9 px-3 rounded-full bg-gradient-to-br from-red-300 to-primary flex flex-col items-center'>
							<p className='text-white'>
								<span className='font-bold'>Over</span>
								<span className='text-5xl font-semibold'>15+</span>
							</p>
							<p className='text-gray-900 font-semibold text-sm '>
								Years Experience
							</p>
						</div>
					</div>
					<div className='w-[40%]'>
						<div>
							<h2 className='text-lg mb-3 uppercase font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-primary to-secondary'>
								Who We Are
							</h2>
							<h1 className='text-4xl font-semibold font-serif text-gray-700 mb-4'>
								Building prosperity, one investment at a time.
							</h1>
							<p className='text-gray-500 mb-3'>
								Our mission is to revolutionize the world of cryptocurrency
								investments by offering a platform that combines advanced
								technology, secure infrastructure, and user-friendly tools.
							</p>

							<p className='text-gray-500 mb-7'>
								We aim to make cryptocurrency mining and portfolio management
								accessible to everyone.
							</p>
							<a
								href='/about'
								className='bg-secondary hover:shadow-lg transition duration-300 px-5 py-2 text-lg font-semibold rounded-lg '>
								{" "}
								<span className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-400'>
									See More About Us
								</span>
							</a>
						</div>
					</div>
				</div>
			</div>

			<div className='bg-red-50 md:px-10 md:py-14 md:pb-28'>
				<div className='mb-10'>
					<h2 className='text-lg mb-3 uppercase font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-primary to-secondary'>
						Our Products
					</h2>
					<h1 className='text-4xl font-semibold font-serif text-gray-700 mb-4'>
						Explore Our Investment Products.
					</h1>
					<p className='text-gray-500 w-[60%] mb-3'>
						Discover our diverse range of trading and investment solutions,
						designed to empower you in navigating the financial markets with
						confidence and expertise.
					</p>
				</div>

				<div className='grid grid-cols-3 gap-5'>
					{products.map((product) => (
						<div className='px-7 rounded-md shadow-md py-10 bg-[#c0eb751b]'>
							<div className='flex justify-between mb-4 items-center'>
								<div className='flex items-center gap-2'>
									<span className=''>{product.logoIcon}</span>
									<h2 className='text-2xl font-medium text-gray-700 font-serif'>
										{product.title}
									</h2>
								</div>

								<div className='flex items-center gap-2'>
									<p className='text-sm text-gray-500'>{product.rating}</p>
									<div className='flex gap-[3px]'>
										<BsStarFill className='w-3 text-green-300 h-3' />
										<BsStarFill className='w-3 text-green-300 h-3' />
										<BsStarFill className='w-3 text-green-300 h-3' />
										<BsStarHalf className='w-3 text-green-300 h-3' />
										<BsStar className='w-3 h-3' />
									</div>
								</div>
							</div>

							<div className='mb-8'>
								<p className='text-gray-500 text-sm tracking-wide'>
									{product.description}
								</p>
							</div>

							<div className='px-2'>
								<h2 className='text-red-500 font-medium'>
									{product.exchangeTitle}
								</h2>
								<p className='text font-semibold tracking-widest text-gray-700'>
									{product.exchange}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className='bg-planImage  relative md:h-[500px] w-full bg-cover bg-no-repeat'>
				<div className='absolute top-0 md:px-10 md:py-24 left-0 md:h-[500px] w-full z-10 bg-[#000000bf]'>
					<div className='md:w-[50%]'>
						<h1 className=' z-50 text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-primary to-secondary mb-7'>
							Your Journey to Financial Greatness Begins Here
						</h1>

						<p className='z-50 text-gray-300 mb-12'>
							Take control of your future. Start investing today and build the
							financial freedom you deserve. With the right guidance and smart
							strategies, you can grow your wealth, secure your goals, and
							achieve true financial independence. Let’s make greatness your
							reality.
						</p>
						<a href='/sign-up' className="text-transparent rounded-lg bg-secondary px-7 py-3"><span className="bg-clip-text bg-gradient-to-r from-primary to-red-400 text-lg font-semibold">Register Now</span></a>
					</div>
				</div>
			</div>

			<HomeSchema />

      <div>
        <div className="flex items-center">
          <div>
            CMS is proud to partner with over <span>2 million</span> users in 75+ countries
          </div>
          <div></div>
        </div>
      </div>

			<Footer />
		</>
	);
};

export default Home;
