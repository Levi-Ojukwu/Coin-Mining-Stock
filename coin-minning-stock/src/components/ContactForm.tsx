/** @format */

import React, { useState } from "react";
import { sendEmail } from "../action/Actions";

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
			await sendEmail(formData);
			setStatus("success");
			setFormData({ name: "", email: "", subject: "", message: "" });
		} catch (error) {
			setStatus("error");
		}
	};

	return <></>;
};

export default ContactForm;
