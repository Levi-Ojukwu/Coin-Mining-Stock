/** @format */

import React, { useState, useRef, useEffect } from "react";
import Nav from "./Nav";

interface Slide {
	imageURL: string;
	description: string;
}
const slides: Slide[] = [
	{
		imageURL:
			"https://m.foolcdn.com/media/dubs/images/original_imagesoriginal_imageshttpsg.foolcdn.c.width-880_SfbkM9V.jpg",
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
			"https://m.foolcdn.com/media/dubs/images/original_imagesoriginal_imageshttpsg.foolcdn.c.width-880_SfbkM9V.jpg",
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
				className=''
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}>
				<div
					className=''
					style={{ backgroundImage: `url(${slides[currentSlide].imageURL})` }}>
					<Nav />
				</div>
			</div>
		</>
	);
};

export default Hero;
