import React from 'react'
import Footer from '../components/Footer'
import ContactForm from '../components/ContactForm'

const Contact = () => {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
          <ContactForm />
        </div>
      </div>
    </div>
      <Footer /> 
    </>
  )
}

export default Contact