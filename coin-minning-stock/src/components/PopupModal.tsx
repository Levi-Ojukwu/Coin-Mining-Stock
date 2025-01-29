/** @format */

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const contents = [
	{
		title: "Recent Withdrawal",
		name: "Partie Kirlin",
		description:
			"Who lives in the city of South Herpa Japan, withdrew the sum of",
		amount: "$1,580.17",
	},
	{
		title: "Recent Withdrawal",
		name: "Rowland Harvey",
		description:
			"Who lives in the city of Fort Laperrine, Algeria, withdrew the sum of",
		amount: "$2,115.14",
	},
	{
		title: "Recent Withdrawal",
		name: "Curta Colins",
		description:
			"Who lives in the city of Green Valley, Arizona, withdrew the sum of",
		amount: "$8,600.39",
	},
	{
		title: "Recent Withdrawal",
		name: "Mirniva Veum",
		description:
			"Who lives in the city of North Bloomington, withdrew the sum of",
		amount: "$9,120.06",
	},
	{
		title: "Recent Withdrawal",
		name: "Morris Kayes",
		description:
			"Who lives in the city of Manila Philippines, withdrew the sum of",
		amount: "$1,209.49",
	},
	{
		title: "Recent Withdrawal",
		name: "Chris pfeffer",
		description: "Who lives in the city of Aleppo Syria, withdrew the sum of",
		amount: "$5,980.00",
	},
	{
		title: "Recent Withdrawal",
		name: "Piggie Hermiston",
		description:
			"Who lives in the city of Tunbridge Wells, England, withdrew the sum of",
		amount: "$12,300,120.57",
	},
	{
		title: "Recent Withdrawal",
		name: "Shane Linkgderd",
		description:
			"Who lives in the city of Makaweli, Hawaii, withdrew the sum of",
		amount: "$25,000.10",
	},
	{
		title: "Recent Withdrawal",
		name: "Bettye Koch",
		description:
			"Who lives in the city of Santiago de León de Caracas, Venezuela, withdrew the sum of",
		amount: "$1,760.90",
	},
	{
		title: "Recent Withdrawal",
		name: "Mustafa Larson",
		description:
			"Who lives in the city of Yakima, Washington, withdrew the sum of",
		amount: "$112.54",
	},
];

const PopupModal = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [contentIndex, setContentIndex] = useState(0);
	const [isVisible, setIsVisible] = useState(true);
	const [isFirstPopup, setIsFirstPopup] = useState(true);

	useEffect(() => {
		//Open the modal after every 3 seconds
		const openTimer = setTimeout(() => {
			setIsOpen(true);
			setIsVisible(true);
		}, 3000);

		// Function to handle the modal cycle
		const cycleModal = () => {
			setIsVisible(false); // Start fade out
			setTimeout(() => {
				setContentIndex((prevIndex) => (prevIndex + 1) % contents.length);
				setIsFirstPopup(false);
			}, 300); // Wait for fade out to complete
			setTimeout(
				() => {
					setIsVisible(true); // Start fade in
				},
				isFirstPopup ? 3300 : 10300,
			); // 3 seconds for first popup, 10 seconds for subsequent popups
		};

		// Start the cycle after the initial 3 seconds
		const initialCycleTimer = setTimeout(cycleModal, 6000);

		// Set up the recurring cycle
		const cycleTimer = setInterval(cycleModal, 13300); // 3 seconds visible + 10 seconds hidden + 300ms fade

		// Change content every 28.3 seconds (3 seconds visible + 25 seconds hidden + 300ms fade)
		// const contentTimer = setInterval(() => {
		// 	setIsVisible(false); // Start fade out
		// 	setTimeout(() => {
		// 		setContentIndex((prevIndex) => (prevIndex + 1) % contents.length);
		// 	}, 25000); // Wait for 25 seconds before changing content
		// 	setTimeout(() => {
		// 		setIsVisible(true); // Start fade in after 25 seconds
		// 	}, 25300); // 25 seconds + 300ms for fade out
		// }, 28300);

		// const contentTimer = setInterval(() => {
		// 	setIsVisible(false); // Start fade out
		// 	setTimeout(() => {
		// 		setContentIndex((prevIndex) => (prevIndex + 1) % contents.length);
		// 		setIsVisible(true); // Start fade in
		// 	}, 300); // Wait for fade out to complete
		// }, 5000);

		return () => {
			clearTimeout(openTimer);
			clearTimeout(initialCycleTimer);
			clearInterval(cycleTimer);
		};
	}, [isFirstPopup]);

	if (!isOpen) return null;

	return (
		<>
			<div className='fixed bottom-32 md:bottom-5 left-5 z-50'>
				<div
					className={`bg-gradient-to-br from-[#e4f33df4] via-gray-400 to-[#849003fb] rounded-lg shadow-lg max-w-sm w-[80%] transition-opacity duration-300 ease-in-out ${
						isVisible ? "opacity-100" : "opacity-0"
					}`}>
					<div className='p-6'>
						<div className='flex justify-between items-center mb-4'>
							<h2 className='text-xl font-bold text-primary'>
								{contents[contentIndex].title}
							</h2>
							<button
								onClick={() => setIsOpen(false)}
								className='text-primary hover:text-secondary transition-colors'
								aria-label='Close modal'>
								<X size={24} />
							</button>
						</div>
						<p className='text-gray-50'>
							<span className='font-semibold text-gray-600'>
								{contents[contentIndex].name}
							</span>{" "}
							{contents[contentIndex].description}{" "}
							<span className='font-semibold text-green-500'>
								{contents[contentIndex].amount}
							</span>
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default PopupModal;
