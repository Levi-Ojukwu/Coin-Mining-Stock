import React from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { TbCircleDashedNumber1, TbCircleDashedNumber2, TbCircleDashedNumber3, TbCircleDashedNumber4, TbHexagonNumber1 } from 'react-icons/tb';
import { PiShootingStarDuotone } from 'react-icons/pi';

const badges = [
  {
    icon: <TbCircleDashedNumber1 />,
    title: "Member",
    description: "Upon sign up, you become a member",
  },
  {
    icon: <TbCircleDashedNumber2 />,
    title: "Leader",
    description: "Upon sign up, you become a member",
  },
  {
    icon: <TbCircleDashedNumber3 />,
    title: "Captain",
    description: "Upon sign up, you become a member",
  },
  {
    icon: <PiShootingStarDuotone />,
    title: "Member",
    description: "Upon sign up, you become a member",
  },
];

const Ranking = () => {
  return (
    
    <>
       <div className="bg-primary rounded-br-3xl rounded-bl-3xl">
      <Nav />
      </div>
      <div className='container mx-auto px-4 py-16 md:pb-16'>
				<div className='text-center'>
					<h2 className='text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-center text-4xl font-bold mb-10'>
						Ranking<span className=''> Page</span>
					</h2>
					<p className='text-gray-500 text-lg font-medium md:mx-28'>
						Explore all the badges here
					</p>
				</div>

        <div>
          {badges.map((badge) => (
            <div className='flex'>
              <div></div>
            </div>
          ))}
        </div>
			</div>
      <Footer />
    </>
  )
}

export default Ranking