/** @format */

import React, { useState } from "react";
import axios from "axios"; // Import axios for making API requests
import { TfiPencilAlt } from "react-icons/tfi";
import { useNavigate } from "react-router-dom"

const countries = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BR", name: "Brazil" },
  { code: "BN", name: "Brunei" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "CV", name: "Cabo Verde" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo, Democratic Republic of the" },
  { code: "CR", name: "Costa Rica" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "SZ", name: "Eswatini" },
  { code: "ET", name: "Ethiopia" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GR", name: "Greece" },
  { code: "GD", name: "Grenada" },
  { code: "GT", name: "Guatemala" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HN", name: "Honduras" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KP", name: "Korea, Democratic People's Republic of" },
  { code: "KR", name: "Korea, Republic of" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Lao People's Democratic Republic" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia, Federated States of" },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "MK", name: "North Macedonia" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russian Federation" },
  { code: "RW", name: "Rwanda" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome and Principe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syrian Arab Republic" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania, United Republic of" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Viet Nam" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
]

const Register = () => {
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [country, setCountry] = useState("");
	const [phone_number, setPhone_number] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(""); // State to store error message
	const [success, setSuccess] = useState(""); // State to store success message
	const [loading, setLoading] = useState(false); // State to manage loading state
  const navigate = useNavigate(); // Initializing the navigate function

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true); //Set loading to true while waiting for response
		setError(""); //Clear any previous errors
		setSuccess(""); //Clear all previous success

		// Basic form validation
		if (
			!name ||
			!username ||
			!email ||
			!country ||
			!phone_number ||
			!password
		) {
			setError("All fields are required");
			setLoading(false);
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters long");
			setLoading(false);
			return;
		}

		try {
			const response = await axios.post("http://127.0.0.1:8000/api/register", {
				name,
				username,
				email,
				country,
				phone_number,
				password,
			});

			console.log("Response:", response.data); // Log the response to check success

			// Handle success response: display the success message and handle further actions
			setSuccess("Registration successful! Redirecting to login...");
			setLoading(false);

      //Delay navigation to show success message
      setTimeout(() => {
        navigate("/login")
      }, 2000)
		} catch (err: any) {
			setLoading(false); //Set loading to false when the request is done

			//Check if there are validation errors
			if (err.response?.data?.errors) {
				setError(
					err.response.data.errors.email ||
						"Registration failed. Please try again.",
				);
			} else {
				setError("Something went wrong.");
			}
		}
	};

	return (
		<>
			<div className='bg-[#00565c10] min-h-screen py-24 flex items-center justify-center'>
				<div className='mx-auto bg-gradient-to-br from-[#e4f33d3d] via-[#e4f33d11] to-[#e4f33d92] px-5 md:px-12 py-10 rounded-lg shadow-lg w-full max-w-xl'>
					
          <div className=" mb-7">
						<div></div>

						<div className="flex items-center gap-2 mb-1">
              <span><TfiPencilAlt className="w-12 h-12 text-primary"/></span>
							<h2 className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r  from-primary  to-secondary'>
								Create An Account
							</h2>
						</div>

            <div>
              <p className='text-gray-500 text-lg font-medium'>Register to start mining with CMS.</p>
            </div>
					</div>

					<form
						onSubmit={handleSubmit}
						className='space-y-6'>
						<div>
							<label
								htmlFor='name'
								className='block text-sm font-medium text-gray-700'>
								Name <span className="text-lg text-red-500">*</span>
							</label>
							<input
								type='text'
								className='mt-1 block w-full border-gray-300 shadow-md focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 bg-gray-50 text-gray-400 text-sm px-2 py-3'
								id='name'
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>

						<div>
							<label
								htmlFor='username'
								className='block text-sm font-medium text-gray-700'>
								Username <span className="text-lg text-red-500">*</span>
							</label>
							<input
								type='text'
								className='mt-1 block w-full  border-gray-300 shadow-md focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 bg-gray-50 text-gray-400 text-sm px-2 py-3'
								id='username'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
							/>
						</div>

						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-700'>
								Email <span className="text-lg text-red-500">*</span>
							</label>
							<input
								type='email'
								className='mt-1 block w-full border-gray-300 shadow-md focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 bg-gray-50 text-gray-400 text-sm px-2 py-3'
								id='email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

            <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country <span className="text-lg text-red-500">*</span>
            </label>
            <select
              id="country"
              className="mt-1 block w-full rounded-sm border-gray-300 shadow-md focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 bg-gray-50 text-gray-400 text-sm px-2 py-3 "
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

						<div>
							<label
								htmlFor='phone_number'
								className='block text-sm font-medium text-gray-700'>
								Phone Number <span className="text-lg text-red-500">*</span>
							</label>
							<input
								type='tel'
								className='mt-1 block w-full rounded-sm border-gray-300 shadow-md focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 bg-gray-50 text-gray-400 text-sm px-2 py-3'
								id='phone_number'
								value={phone_number}
								onChange={(e) => setPhone_number(e.target.value)}
								required
							/>
						</div>

						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-gray-700'>
								Password <span className="text-lg text-red-500">*</span>
							</label>
							<input
								type='password'
								className='mt-1 block w-full rounded-sm border-gray-300 shadow-md focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 bg-gray-50 text-gray-400 text-sm px-2 py-3'
								id='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						<button
							type='submit'
							className='py-2 px-10 border border-transparent rounded-md shadow-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
							disabled={loading}>
							{loading ? "Registering..." : "Register"}
						</button>

            <div>
              <p className="text-center">Already have an account? <span className=" font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-300"><a href="/login">Login</a></span></p>
            </div>
					</form>

					{/* Display error or success messages */}
					{error && (
						<div className='mt-4 text-sm text-red-600 bg-red-100 border border-red-400 rounded-md p-3'>
							{error}
						</div>
					)}
					{success && (
						<div className='mt-4 text-sm text-green-600 bg-green-100 border border-green-400 rounded-md p-3'>
							{success}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Register;
