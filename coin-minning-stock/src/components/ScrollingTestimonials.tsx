/** @format */

import { div } from "framer-motion/client";
import { useEffect, useRef } from "react";
import type React from "react";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";

interface iTestimonial {
	name: string;
	role: string;
	description: string;
	image: string;
}

const testimonies: iTestimonial[] = [
	{
		name: "Alice Johnson",
		role: "CEO, TechCorp",
		description:
			"This product has revolutionized our workflow. Highly recommended!",
		image:
			"https://rafflepress.com/wp-content/uploads/2024/01/stacey.jpg",
	},
	{
		name: "John Doe",
		role: "Crypto Enthusiast",
		description:
			"Coin Mining Stock has revolutionized my mining experience. Their efficiency is unmatched!",
		image:
			"https://menlocoa.org/wp-content/uploads/2012/10/Tinyen-RSp.jpg",
	},
	{
		name: "Jane Smith",
		role: "Tech Investor",
		description:
			"I've seen significant returns since investing in Coin Mining Stock. Their technology is cutting-edge.",
		image:
			"https://img.freepik.com/free-photo/close-up-smiley-woman-outdoors_23-2149002410.jpg",
	},
	{
		name: "Mike Johnson",
		role: "Blockchain Developer",
		description:
			"The team at Coin Mining Stock truly understands the intricacies of crypto mining. Impressive operation!",
		image:
			"https://pbs.twimg.com/media/DzeLmXZU0AA1OtZ.jpg",
	},
	{
		name: "Sarah Williams",
		role: "Financial Analyst",
		description:
			"Coin Mining Stock's transparency and consistent performance have made them a standout in the industry.",
		image:
			"https://blog.texasbar.com/files/2013/04/MaryGraceRuden_smaller1.jpg",
	},
	{
		name: "David Brown",
		role: "IT Professional",
		description:
			"The hardware solutions provided by Coin Mining Stock are top-notch. They've thought of everything.",
		image:
			"https://xsgames.co/randomusers/assets/avatars/male/6.jpg",
	},
	{
		name: "Emily Davis",
		role: "Cryptocurrency Journalist",
		description:
			"In my years covering the crypto space, Coin Mining Stock has consistently been a name to watch.",
		image:
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTZu9pxNZTfgUbRF8nYX3HVVT4VUFXECTYsA&s",
	},
	{
		name: "Levi Scot",
		role: "Web3 Full-stack Developer",
		description:
			"This product has revolutionized our workflow. Highly recommended!",
		image:
			"https://img.freepik.com/free-photo/close-up-man-with-curly-hair-beard_1140-140.jpg",
	},
	{
		name: "Olivia Chen",
		role: "Sustainability Expert",
		description:
			"I'm impressed by Coin Mining Stock's commitment to eco-friendly mining practices. They're leading the way in green crypto.",
		image:
			"https://img.freepik.com/premium-photo/portrait-beautiful-asian-woman-smiling-looking-camera-outdoors-student-campus-dur_68060-1758.jpg",
	},
	{
		name: "Alex Lee",
		role: "Mining Rig Engineer",
		description:
			"The efficiency of Coin Mining Stock's rigs is impressive. They're setting new standards in the industry.",
		image:
			"https://st2.depositphotos.com/4342001/6466/i/950/depositphotos_64667083-stock-photo-muslim-guy.jpg",
	},
];

const topRowTestimonial = testimonies.slice(0, 5);
const bottomRowTestimonial = testimonies.slice(5);

const TestimonialCard: React.FC<iTestimonial> = ({
	name,
	role,
	description,
	image,
}) => (
	<div className='md:h-[210px] w-[350px] px-5 py-7 bg-[#e4f33d41] rounded-lg shadow-md mr-5'>
		<div className='flex items-end gap-2'>
			<img
				src={image}
				className='w-12 h-12 rounded-full'
				alt="Testifier's Image"
			/>

			<div>
				<p className='text-[#197379e7] text-sm font-bold'>{name}</p>
				<p className='text-xs'>{role}</p>
			</div>
		</div>

		<div className='mt-7'>
			<p className='text-gray-500 text-sm italic'>
				<span>
					<FaQuoteLeft className='text-[#197379e7] w-4 h-4' />
				</span>{" "}
				{description}{" "}
				<span>
					<FaQuoteRight className='text-[#197379e7] w-4 h-4' />
				</span>
			</p>
		</div>
	</div>
);

const ScrollingTestimonials: React.FC = () => {
	const scrollRef1 = useRef<HTMLDivElement>(null);
	const scrollRef2 = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const scroll1 = scrollRef1.current;
		const scroll2 = scrollRef2.current;

		if (scroll1 && scroll2) {
			const animateScroll = () => {
				if (scroll1.scrollLeft >= scroll1.scrollWidth / 2) {
					scroll1.scrollLeft = 0;
				} else {
					scroll1.scrollLeft += 0.8;
				}

				if (scroll2.scrollLeft <= 0) {
					scroll2.scrollLeft = scroll2.scrollWidth / 2;
				} else {
					scroll2.scrollLeft -= 0.8;
				}

				requestAnimationFrame(animateScroll);
			};

			const animationId = requestAnimationFrame(animateScroll);

			return () => cancelAnimationFrame(animationId);
		}
	}, []);

	return (
		<div className='py-20 bg-[#04ecfc11] overflow-hidden'>
			<div className='mb-10 px-5 md:px-10'>
				<h2 className='text-lg mb-3 uppercase font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-primary to-secondary'>
					Testimonials
				</h2>
				<h1 className='text-4xl font-semibold font-serif text-gray-700 mb-7 md:mb-3'>
					Success Stories from Our Investors
				</h1>
				<p className='text-gray-500 md:w-[60%] mb-3'>
					Our investors’ success stories and feedback inspire us to continue
					delivering secure and innovative crypto investment solutions. See how
					our platform has transformed their financial journeys.
				</p>
			</div>

			<div className='relative'>
				{/* Top row - scrolling left */}
				<div
					ref={scrollRef1}
					className='flex overflow-hidden'>
					<div className='flex'>
						{topRowTestimonial.map((testimony, index) => (
							<TestimonialCard
								key={`left-${index}`}
								{...testimony}
							/>
						))}
					</div>
					<div className='flex'>
						{topRowTestimonial.map((testimony, index) => (
							<TestimonialCard
								key={`left-repeat-${index}`}
								{...testimony}
							/>
						))}
					</div>
				</div>

				{/* Bottom row - scrolling right */}
				<div
					ref={scrollRef2}
					className='flex mt-5 overflow-hidden'>
					<div className='flex'>
						{bottomRowTestimonial.map((testimony, index) => (
							<TestimonialCard
								key={`right-${index}`}
								{...testimony}
							/>
						))}
					</div>
					<div className='flex'>
						{bottomRowTestimonial.map((testimony, index) => (
							<TestimonialCard
								key={`right-repeat-${index}`}
								{...testimony}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ScrollingTestimonials;
