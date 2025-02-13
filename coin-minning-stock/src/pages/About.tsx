/** @format */

// import React from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import CryptoMarquee from "../components/CryptoMarquee";

const whatWeOffer = [
	{
		title: "State-of-the-Art Mining Infrastructure",
		description:
			"We utilize advanced mining equipment and data centers optimized for efficiency, ensuring maximum returns on your investments. Our facilities are designed to operate sustainably, minimizing environmental impact while maximizing profitability",
	},
	{
		title: "Comprehensive Investment Solutions",
		description:
			"Coin Mining Stock provides a seamless and integrated platform for cryptocurrency mining and trading. Whether you're interested in mining Bitcoin, Ethereum, or other digital currencies, our solutions are tailored to meet your specific needs and investment goals.",
	},
	{
		title: "Unmatched Security and Transparency",
		description:
			"Security is at the core of everything we do. Our platform employs robust encryption protocols, secure data storage, and multi-layered authentication processes to safeguard your assets and personal information.",
	},
	{
		title: "User-Centric Tools and Insights",
		description:
			"We understand the importance of informed decision-making. Our platform features intuitive tools, detailed analytics, and real-time insights to help you monitor performance and optimize your investment strategies.",
	},
	{
		title: "Dedicated Customer Support",
		description:
			"Our team of experts is available to provide personalized assistance, ensuring that your experience with Coin Mining Stock is smooth, rewarding, and stress-free.",
	},
];

const whyChoose = [
	{
		title: "Proven Expertise:",
		description:
			"With years of experience in the cryptocurrency space, we bring unmatched knowledge and insights to our clients.",
	},
	{
		title: "Global Reach:",
		description:
			"We cater to a diverse clientele across the globe, enabling individuals and businesses to participate in the cryptocurrency revolution.",
	},
	{
		title: "Sustainability Commitment:",
		description:
			"We prioritize eco-friendly practices, ensuring that our mining operations are as energy-efficient as possible.",
	},
	{
		title: "Future-Forward Approach:",
		description:
			"By staying ahead of industry trends and technological advancements, we ensure our clients are well-positioned for success in the dynamic world of digital assets.",
	},
];

const About = () => {
	return (
		<>
			<div className='bg-aboutImage  h-[250px] md:h-[500px] bg-cover bg-center bg-no-repeat'>
				<div className=''>
					<Nav />
				</div>
			</div>

			<div className='px-5 relative  md:px-10 py-3 md:py-5 bg-gray-100'>
				

				<div>
					<h2 className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-bold text-2xl md:text-4xl mb-5 text-center'>
						About <span className=''>Us</span>
					</h2>
					<p className='text-gray-500'>
						Coin Mining Stock is a pioneering platform dedicated to empowering
						individuals and organizations to capitalize on the transformative
						potential of cryptocurrency mining and investments. With a steadfast
						commitment to innovation, transparency, and security, we provide
						cutting-edge solutions that simplify the complexities of
						cryptocurrency mining and portfolio management.
					</p>
				</div>

				<div>
					<h2 className='mt-10 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-bold text-2xl md:text-3xl mb-5'>
						Who We Are
					</h2>

					<div className='md:flex justify-between'>
						<div className='md:w-[50%] mb-8 md:mb-0'>
							<img
								src='https://media.licdn.com/dms/image/v2/C4E12AQGgkm5WMvfvhQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1612219483504?e=2147483647&v=beta&t=T0FQzVfEhJ2vuGZTu7W4JtFjlcs6fxXxkT8Eoqskz6Q'
								alt='Who wer are'
								className='md:w-[89%] rounded'
							/>
						</div>

						<div className='md:w-[50%]'>
							<p className='text-gray-500'>
								At Coin Mining Stock, we are more than just a cryptocurrency
								mining platform; we are a trusted partner in your journey toward
								financial growth in the digital era. Our team comprises seasoned
								professionals with expertise in blockchain technology, financial
								markets, and mining operations. Together, we work tirelessly to
								deliver an unparalleled investment experience that aligns with
								the ever-evolving landscape of cryptocurrencies.
							</p>
							<p className='text-gray-500 mt-4'>
								This platform is suitable for both beginners and experienced
								traders and investors, providing profit opportunities from the
								markets. Furthermore, if you refer family or friends to the
								company, you’ll earn a certain amount of bonus.
							</p>
							<p className='text-gray-500 mt-4'>
								we believe in the transformative power of cryptocurrency and are
								committed to helping people worldwide unlock its potential
								through innovative and automated trading solutions.
							</p>
						</div>
					</div>
				</div>

				<div>
					<div className='md:flex gap-16'>
						<div className=''>
							<h2 className='mt-10 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-bold text-2xl md:text-3xl'>
								Our Mission
							</h2>

							<div>
								<p className='text-gray-500'>
									Our mission is to revolutionize the world of cryptocurrency
									investments by offering a platform that combines advanced
									technology, secure infrastructure, and user-friendly tools. We
									aim to make cryptocurrency mining and portfolio management
									accessible to everyone, fostering trust and confidence in an
									increasingly decentralized financial ecosystem.
								</p>

								<p className='text-gray-500 mt-4'>
									We are dedicated to using cutting-edge technology to
									streamline the investment process, offering a user-friendly
									interface and automated tools designed to optimize returns
								</p>
							</div>
						</div>
						<div>
							<h2 className='text-primary mt-10 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-bold text-2xl md:text-3xl mt-10'>
								Our Vision
							</h2>

							<div>
								<p className='text-gray-500'>
									At Coin Mining Stock, we envision a future where
									cryptocurrency mining is not just a specialized activity but a
									cornerstone of mainstream investment portfolios. We strive to
									empower investors at all levels, enabling them to harness the
									potential of blockchain technology and digital assets to
									achieve financial independence and success.
								</p>
							</div>
						</div>
					</div>
				</div>

				<div>
					<h2 className='text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-secondary font-bold text-2xl md:text-3xl mb-5 mt-10'>
						What We Offer
					</h2>

					<div className='md:px-12'>
						<h3>
							{whatWeOffer.map((offer) => (
								<div className='mb-6'>
									<h3 className='text-lg md:text-2xl text-gray-600 font-semibold md:font-medium'>
										{offer.title} <span></span>
									</h3>
									<p className='text-gray-500 mt-1'>{offer.description}</p>
								</div>
							))}
						</h3>
					</div>
				</div>
			</div>

			<div className='bg-gradient-to-br from-primary  to-secondary h-[450px] md:h-[300px] pt-5  md:py-5 md:pt-10'>
				<h2 className='text-gray-700 font-bold text-3xl mb-4'>Join Us</h2>

				<div className="md:px-10 px-5">
					<p className='text-gray-200 mb-3'>
						At Coin Mining Stock, we believe that cryptocurrency mining and
						investments should be accessible to everyone, regardless of
						technical expertise or financial background. Our platform is
						designed to simplify the process, empower decision-making, and
						deliver consistent value to our clients.
					</p>
					<p className='text-gray-200 mb-'>
						Start your journey with Coin Mining Stock today and unlock the
						limitless potential of the cryptocurrency revolution. Together,
						let’s shape the future of finance.
					</p>
				</div>

				<div className='mt-3'>
				<CryptoMarquee />
			</div>
			</div>

			<div className='px-5 mb-10 md:px-10 md:mb-10'>
				<h2 className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-bold text-2xl md:text-3xl mb-5 mt-10'>
					Why Choose CMS?
				</h2>

				<div>
					<div className='mb-3'>
						<p className='text-gray-500'>
							By choosing Coin Mining Stock, you’re partnering with a platform
							that has your financial goals in mind. With our automated trading
							approach, you can invest confidently without dedicating hours to
							market analysis.
						</p>
					</div>
					{whyChoose.map((choice) => (
						<div>
							<ul>
								<li className='text-gray-700 font-bold mb-1'>
									{choice.title}{" "}
									<span className='text-gray-500 font-normal'>
										{choice.description}
									</span>
								</li>
							</ul>
						</div>
					))}
				</div>
			</div>
			<Footer />
		</>
	);
};

export default About;
