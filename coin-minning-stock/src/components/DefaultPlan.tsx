// import React from 'react'
import { GiChampions, GiFallingOvoid, GiGoldBar } from 'react-icons/gi';
import { IoShieldCheckmarkSharp } from 'react-icons/io5';
import { MdOutlineLightMode, MdOutlineLocalPlay } from 'react-icons/md';
import { SlDiamond } from 'react-icons/sl';
import { TbBrandCupra } from 'react-icons/tb';
import { TiArrowMaximise } from 'react-icons/ti';

const plans = [
    {
        icon: (
            <MdOutlineLightMode className='w-16 h-16 mb-3 text-primary group-hover:text-secondary border p-3 bg-gray-100 rounded-tl-3xl rounded-br-3xl group-hover:bg-gray-300 transition duration-300' />
        ),
        title: "Rookie Plan",
        checkmarkIcon: (
            <IoShieldCheckmarkSharp className='w-3 h-3 text-[#00c30b]' />
        ),
        investAmount: "$20.00   ",
        receive: "TO RECEIVE",
        receiveAmount: "$60.00",
        duration: "24/hrs Antiminar",
        button: "INVEST NOW",
    },
    {
        icon: (
            <GiFallingOvoid className='w-16 h-16 mb-3 text-primary group-hover:text-secondary border p-3 bg-gray-100 rounded-tl-3xl rounded-br-3xl group-hover:bg-gray-300 transition duration-300' />
        ),
        title: "Dexi Plan",
        checkmarkIcon: (
            <IoShieldCheckmarkSharp className='w-3 h-3 text-[#00c30b]' />
        ),
        investAmount: "$500.00",
        receive: "TO RECEIVE",
        receiveAmount: "$1,500.00",
        duration: "24/hrs",
        button: "INVEST NOW",
    },
    {
        icon: (
            <GiChampions className='w-16 h-16 mb-3 text-primary group-hover:text-secondary border p-3 bg-gray-100 rounded-tl-3xl rounded-br-3xl group-hover:bg-gray-300 transition duration-300' />
        ),
        title: "Onic Plan",
        checkmarkIcon: (
            <IoShieldCheckmarkSharp className='w-3 h-3 text-[#00c30b]' />
        ),
        investAmount: "$1,000.00",
        receive: "TO RECEIVE",
        receiveAmount: "$3,000.00",
        duration: "12/hrs Mining",
        button: "INVEST NOW",
    },
    {
        icon: (
            <TbBrandCupra className='w-16 h-16 mb-3 text-primary group-hover:text-secondary border p-3 bg-gray-100 rounded-tl-3xl rounded-br-3xl group-hover:bg-gray-300 transition duration-300' />
        ),
        title: "Apex Plan",
        checkmarkIcon: (
            <IoShieldCheckmarkSharp className='w-3 h-3 text-[#00c30b]' />
        ),
        investAmount: "$2,000.00",
        receive: "TO RECEIVE",
        receiveAmount: "$6,000.00",
        duration: "12/hrs Mining",
        button: "INVEST NOW",
    },
    {
        icon: (
            <TiArrowMaximise className='w-16 h-16 mb-3 text-primary group-hover:text-secondary border p-3 bg-gray-100 rounded-tl-3xl rounded-br-3xl group-hover:bg-gray-300 transition duration-300' />
        ),
        title: "Max Plan",
        checkmarkIcon: (
            <IoShieldCheckmarkSharp className='w-3 h-3 text-[#00c30b]' />
        ),
        investAmount: "$5,000.00",
        receive: "TO RECEIVE",
        receiveAmount: "$20,000.00",
        duration: "12/hrs Mining",
        limit: "Unlimited Withdrawal",
        button: "INVEST NOW",
    },
    {
        icon: (
            <GiGoldBar className='w-16 h-16 mb-3 text-primary group-hover:text-secondary border p-3 bg-gray-100 rounded-tl-3xl rounded-br-3xl group-hover:bg-gray-300 transition duration-300' />
        ),
        title: "GOLD PLATINUM",
        checkmarkIcon: (
            <IoShieldCheckmarkSharp className='w-3 h-3 text-[#00c30b]' />
        ),
        investAmount: "$10,000.00",
        receive: "TO RECEIVE",
        receiveAmount: "$45,000.00",
        duration: "12/hrs Mining",
        limit: "Unlimited Withdrawal",
        button: "INVEST NOW",
    },
    {
        icon: (
            <SlDiamond className='w-16 h-16 mb-3 text-primary group-hover:text-secondary border p-3 bg-gray-100 rounded-tl-3xl rounded-br-3xl group-hover:bg-gray-300 transition duration-300' />
        ),
        title: "DIAMOND PLATINUM",
        checkmarkIcon: (
            <IoShieldCheckmarkSharp className='w-3 h-3 text-[#00c30b]' />
        ),
        investAmount: "$20,000.00",
        receive: "TO RECEIVE",
        receiveAmount: "$100,000.00",
        duration: "12/hrs Mining",
        limit: "Unlimited Withdrawal",
        principle: "Principle Included",
        button: "INVEST NOW",
    },
    {
        icon: (
            <MdOutlineLocalPlay className='w-16 h-16 mb-3 text-primary group-hover:text-secondary border p-3 bg-gray-100 rounded-tl-3xl rounded-br-3xl group-hover:bg-gray-300 transition duration-300' />
        ),
        title: "CLASSIC PLATINUM",
        checkmarkIcon: (
            <IoShieldCheckmarkSharp className='w-3 h-3 text-[#00c30b]' />
        ),
        investAmount: "$50,000.00",
        receive: "TO RECEIVE",
        receiveAmount: "$200,000.00",
        duration: "24/hrs",
        limit: "Unlimited Withdrawal",
        earning: "Receive earning Every 5 minutes",
        button: "INVEST NOW",
    },
];

const DefaultPlan = () => {
  return (
    <>
        <div className='md:mt-10 container mx-auto px-4'>
					<div className='grid md:grid-cols-3 gap-10 md:gap-4'>
						{plans.map((plan) => (
							<div
								className='group px-3 py-10 pb-5 border-[0.5px] bg-gray-100 hover:bg-[#1e656c0c] shadow-md'>
								<div className='mb-9 border-b-[1px] border-primary pb-3'>
									<span>{plan.icon}</span>
									<h2 className='text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary text-2xl font-medium'>
										{plan.title}
									</h2>
								</div>

								<div className=''>
									<div className='mb-14 border-b-[1px] border-secondary pb-3'>
										<p className='flex items-center gap-2 mb-2  text-gray-500 text-base'>
											<span>{plan.checkmarkIcon}</span>{" "}
											<span className='text-red-600 text-xs'>
												{plan.investAmount}
											</span>{" "}
											<span>{plan.receive}</span>{" "}
											<span className='text-green-600 text-xs'>
												{plan.receiveAmount}
											</span>
										</p>
										<p className='flex items-center gap-2 mb-3  text-gray-500 text-base'>
											<span>{plan.checkmarkIcon}</span> {plan.duration}
										</p>
										<p className='flex items-center gap-2 mb-3  text-gray-500 text-base'>
											<span>{plan.checkmarkIcon}</span> {plan.limit}
										</p>
										<p className='flex items-center gap-2 mb-3  text-gray-500 text-base'>
											<span>{plan.checkmarkIcon}</span> {plan.principle}
										</p>
										<p className='flex items-center gap-2 mb-3  text-gray-500 text-base'>
											<span>{plan.checkmarkIcon}</span> {plan.earning}
										</p>
									</div>

									<div className='flex items-center justify-center'>
										<a
											href='/deposit'
											className='border px-8 rounded-3xl py-2 text-gray-200 group-hover:text-white bg-primary group-hover:bg-gradient-to-r group-hover:animate-bounce from-primary via-secondary transition duration-300 font-semibold text-sm  to-primary'>
											{plan.button}
										</a>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
    </>
  )
}

export default DefaultPlan