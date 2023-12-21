import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png";
import HighlightText from './HighlightText';
import CTAButton from "./Button";
import { FaArrowRight } from 'react-icons/fa';

const InstructorSection = () => {
  return (
    <div>
         <div className=' flex flex-row gap-20 items-center'>
            <div className=' w-[50%]'>
                <img src={Instructor} alt='instructot-image' className=' shadow-[-20px_-20px_rgba(255,255,255)]'/>
            </div>
            <div className='w-[50%] flex flex-col gap-10 justify-between'>
                <div className=' w-[50%] text-4xl font-semibold'>
                    Become an <HighlightText text={"instructor"}/>
                </div>
                <p className=' font-medium text-base w-[90%] text-richblack-300'>
                   Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
                </p>
                <div className=' w-fit' >
                    <CTAButton active={true} linkto={"/signup"}>
                        <div className=' flex gap-2 items-center'>
                            Start Teaching Today
                            <FaArrowRight/>
                        </div>
                    </CTAButton>
                </div>
            </div>
        </div>
    </div>
  )
}

export default InstructorSection