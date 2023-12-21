import React from 'react'
import HighlightText from '../HomePage/HighlightText'

const Quote = () => {
  return (
    <div className='mx-auto flex w-11/12 max-w-maxContent flex-col justify-between gap-10 text-richblack-500'>
        <div className=' h-[100px]'></div>
        <p className=' text-xl md:text-4xl font-semibold mx-auto py-5 pb-20 text-center text-white'>We are passionate about revolutionizing the way we learn. Our innovative platform <HighlightText text={"combines technology"}/>, <span className='bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold'>{" "} expertise</span>, and community to create an <span className='bg-gradient-to-b from-[#E65C00] to-[#F9D423] text-transparent bg-clip-text font-bold'>{" "}unparalleled educational experience.</span></p>
    </div>
  )
}

export default Quote