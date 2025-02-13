/** @format */

import React, { useState } from "react";
// import { sendEmail } from "../action/Action";
import { motion } from "framer-motion";
import { fadeIn } from "../variants";

const ContactForm = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setStatus("loading");
		try {
			// await sendEmail(formData);
			setStatus("success");
			setFormData({ name: "", email: "", subject: "", message: "" });
		} catch (error) {
			setStatus("error");
		}
	};

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className='space-y-6'>
				<motion.div
					variants={fadeIn("down", 0.1)}
					initial='hidden'
					whileInView={"show"}>
					<label
						htmlFor='name'
						className='block text-sm font-medium text-gray-700'>
						Name
						<span className='text-red-500 ml-1'>*</span>
					</label>
					<input
						type='text'
						id='name'
						name='name'
						value={formData.name}
						onChange={handleChange}
						required
						className='mt-1 block w-full border-[0.2px] shadow-md bg-gray-50 text-gray-400 text-sm px-2 py-3'
					/>
				</motion.div>

				<motion.div variants={fadeIn("down", 0.2)}
                                                            initial='hidden'
                                                            whileInView={"show"}>
					<label
						htmlFor='email'
						className='block text-sm font-medium text-gray-700'>
						Email
						<span className='text-red-500 ml-1'>*</span>
					</label>
					<input
						type='email'
						id='email'
						name='email'
						value={formData.email}
						onChange={handleChange}
						required
						className='mt-1 block w-full border-[0.2px] shadow-md bg-gray-50 text-gray-400 text-sm px-2 py-3'
					/>
				</motion.div>

				<motion.div variants={fadeIn("down", 0.3)}
                                                            initial='hidden'
                                                            whileInView={"show"}>
					<label
						htmlFor='subject'
						className='block text-sm font-medium text-gray-700'>
						Subject
						<span className='text-red-500 ml-1'>*</span>
					</label>
					<input
						type='text'
						id='subject'
						name='subject'
						value={formData.subject}
						onChange={handleChange}
						required
						className='mt-1 block w-full border-[0.2px] shadow-md bg-gray-50 text-gray-400 text-sm px-2 py-3'
					/>
				</motion.div>

				<motion.div variants={fadeIn("down", 0.4)}
                                                            initial='hidden'
                                                            whileInView={"show"}>
					<label
						htmlFor='message'
						className='block text-sm font-medium text-gray-700'>
						Message
						<span className='text-red-500 ml-1'>*</span>
					</label>
					<textarea
						id='message'
						name='message'
						rows={4}
						value={formData.message}
						onChange={handleChange}
						required
						className='mt-1 block w-full border-[0.2px] shadow-md bg-gray-50 text-gray-400 text-sm px-2 py-3'></textarea>
				</motion.div>

				<motion.div variants={fadeIn("down", 0.5)}
                                                            initial='hidden'
                                                            whileInView={"show"}>
					<button
						type='submit'
						disabled={status === "loading"}
						className='py-2 px-8 border rounded-md shadow-sm text-base font-medium text-gray-100 bg-primary hover:bg-gradient-to-r from-primary via-secondary to-primary focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition duration-300'>
						{status === "loading" ? "Sending..." : "Send Message"}
					</button>
				</motion.div>
				{status === "success" && (
					<div className='text-green-600 text-center'>
						Your message has been sent successfully!
					</div>
				)}
				{status === "error" && (
					<div className='text-red-600 text-center'>
						There was an error sending your message. Please try again.
					</div>
				)}
			</form>
		</>
	);
};

export default ContactForm;
