import React from 'react'
import { BiLogoWhatsappSquare } from 'react-icons/bi'
import { BsWhatsapp } from 'react-icons/bs'
import { FaSquareWhatsapp } from 'react-icons/fa6'
import { IoLogoWhatsapp } from 'react-icons/io5'

const WhatsAppLink = () => {
  return (
    <>
        <a href="https://api.whatsapp.com/send?phone=2347048952008&text=Hello!%20I%20have%20questions%20about%20Coin%20Mining%20Stock" target='_blank' className='fixed right-3 md:right-[28px] bottom-2 md:bottom-[60px] flex gap-2 flex-col items-end'>
            <p className='bg-gray-100 px-4 py-1 rounded-lg shadow-md border border-gray-400 shadow-[#25D366]'>Chat with us</p>
            <span className=''><FaSquareWhatsapp className='w-14 h-14 text-[#25D366]'/></span>
        </a>
    </>
  )
}

export default WhatsAppLink