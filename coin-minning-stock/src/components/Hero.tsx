/** @format */

import React, { useState, useRef, useEffect } from "react";
import Nav from "./Nav";
import { IoIosArrowForward } from "react-icons/io";
// import { Link } from "react-router-dom";

interface Slide {
	imageURL: string;
	description: string;
}
const slides: Slide[] = [
	{
		imageURL:
			"https://miro.medium.com/v2/resize:fit:1198/1*0MCiaGgT8-updmsPiKYQtg.jpeg",
		description:
			"Coinminingstock specializes in cryptocurrency mining investments, offering a streamlined trading experience that empowers users to efficiently manage their portfolios without the complexities of manual exchange interactions",
	},
	{
		imageURL:
			"https://cryptodaily.blob.core.windows.net/space/BTCUSD%20-%2011%20January%202024%20-%20720%20-%201920%201080.jpg",
		description:
			"Coinminingstock specializes in cryptocurrency mining investments, offering a streamlined trading experience that empowers users to efficiently manage their portfolios without the complexities of manual exchange interactions",
	},
	{
		imageURL:
			"https://cdn.prod.website-files.com/5e5fcd39a7ed2643c8f70a6a/6704e4ce1946b9303f928b01_64b55ec1da278e73df3573ce_mining%2520bitcoin.jpeg",
		description:
			"Coinminingstock specializes in cryptocurrency mining investments, offering a streamlined trading experience that empowers users to efficiently manage their portfolios without the complexities of manual exchange interactions",
	},
	{
		imageURL:
			"https://image.blockchain.news/features/F3C70D4AEFECE557444CFAA1DEC15F9F51AB86BAD8FC8A4B16DCE513DC50DBDC.jpg",
		description:
			"Coinminingstock specializes in cryptocurrency mining investments, offering a streamlined trading experience that empowers users to efficiently manage their portfolios without the complexities of manual exchange interactions",
	},
];

const Hero: React.FC = () => {
	const [currentSlide, setCurrentSlide] = useState<number>(0);
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
		}, 5000); // Change slide every 5 seconds
		return () => clearInterval(intervalId);
	}, []);

	useEffect(() => {
		let intervalId: NodeJS.Timeout;
		if (!isHovered) {
			intervalId = setInterval(() => {
				if (containerRef.current) {
					containerRef.current.scrollLeft += 2; // Adjust scroll speed

					// Check if scrolled to the end
					if (
						containerRef.current.scrollLeft +
							containerRef.current.clientWidth >=
						containerRef.current.scrollWidth
					) {
						// Reset scroll position to the beginning
						containerRef.current.scrollLeft = 0;
					}
				}
			}, 50); // Adjust interval as needed
		}
		return () => clearInterval(intervalId);
	}, [isHovered]);

	return (
		<>
			<div
				ref={containerRef}
				className='bg-cover bg-no-repeat relative h-[450px] md:h-screen'
				style={{ backgroundImage: `url(${slides[currentSlide].imageURL})` }}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}>
				<Nav />

				<div className="absolute top-0 left-0 h-[450px] md:h-screen w-full z-10 bg-[#00000076]"></div>

				<div className=' px-5 md:px-10 flex flex-col md:w-[60%] mt-10 md:mt-14 '>
					<h1 className='text-transparent bg-clip-text bg-gradient-to-br from-red-400 via-secondary to-primary text-4xl md:text-[52px] font-bold text-gray-50 z-50 md:tracking-wider md:leading-[1.2]'>
						Digital Currency Mining Made Simple With Auto Trading.
					</h1>
					<p className='text-gray-100 mt-6 md:mt-10 md:text-xl z-50 font-medium tracking-wide leading-[1.3]'>
						Coin Mining Stock simplifies the trading experience by making it
						possible to manage your portfolio without manual dealing with
						exchanges.
					</p>

					<a href="/register" className="mt-10 md:mt-5 rounded-lg shadow-md shadow-primary flex items-center gap-3 justify-center py-3  bg-secondary z-50 w-[60%] md:w-[30%]">
						<span className="text-transparent bg-clip-text text-xl font-semibold bg-gradient-to-r from-primary to-red-400">Get Started</span> <span><IoIosArrowForward  className="text-red-400 w-5 h-5"/></span>
					</a>
				</div>
			</div>
		</>
	);
};

export default Hero;
