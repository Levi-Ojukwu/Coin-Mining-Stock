/** @format */

import React from "react";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import Nav from "../components/Nav";
import { motion } from "framer-motion";
import { fadeIn } from "../variants";

const Contact = () => {
	return (
		<>
			<div className='bg-primary rounded-br-3xl rounded-bl-3xl'>
				<Nav />
			</div>
			<div className='min-h-screen bg-gray-200  pb-20'>
				<div className='container mx-auto px-4 md:px-10 pt-10 md:pt-16 py-16 bg-gray-200'>
					<motion.h1 variants={fadeIn("down", 0.2)}
                                initial='hidden'
                                whileInView={"show"} className='text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-center mb-8'>
						Conta<span className=''>ct Us</span>
					</motion.h1>

        
					<div className='mt-20'>
            <div className="max-w-2xl mx-auto mb-5">
              <motion.h2 variants={fadeIn("right", 0.4)}
                                    initial='hidden'
                                    whileInView={"show"} className="mt-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-secondary font-bold text-2xl">Get In Touch</motion.h2>
            </div>
						<div className='max-w-2xl mx-auto bg-gradient-to-br from-[#e4f33d2d] via-[#e4f33d01] to-[#e4f33d92] md:w-[70%]  shadow-lg p-8'>
							<ContactForm />
						</div>
						{/* <div className="md:w-[50%] bg-gradient-to-tr from-secondary via-primary to-primary shadow-md">
              <img src="https://st2.depositphotos.com/41512158/48083/v/450/depositphotos_480833454-stock-illustration-cryptocurrency-blockchain-abstract-futuristic-background.jpg" alt="Contact Image" />
              <div>
                p j jnkj
              </div>
            </div> */}
					</div>
				</div>
			</div>
			<Footer />
		</>
	);
};

export default Contact;
