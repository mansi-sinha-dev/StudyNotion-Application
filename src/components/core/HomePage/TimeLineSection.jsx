import React from 'react'
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import TimeLine from "../../../assets/Images/TimelineImage.png";


// create an array to get data for your ui
const timeline = [
    {
        Logo : Logo1,
        Heading : "Leadership",
        Description : "Fully committed to the success company"

    },
    {
        Logo : Logo2,
        Heading : "Responsibility",
        Description : "Students will always be our top priority"

    },
    {
        Logo : Logo3,
        Heading : "Flexibility",
        Description : "The ability to switch is an important skills"

    },
    {
        Logo : Logo4,
        Heading : "Slove the problem",
        Description : "Code your way to a solution"

    },
]

const TimeLineSection = () => {
  return (
    <div>
        <div className=' flex flex-row gap-20 mb-20 items-center'>
            {/* left */}
            <div className=' flex flex-col w-[45%] gap-5'>
                {
                    timeline.map((element, index) =>{
                       
                        return(
                            <div className=' flex flex-col gap-3' key={index}>
                                <div className='flex flex-row gap-6 ' key={index}>
                                    {/* left side logo */}
                                    <div className=' w-[50px] h-[50px] bg-white rounded-full  flex items-center justify-center shadow-[#00000012]'>
                                        <img src={element.Logo}/>
                                    </div>
                                    {/* right side description */}
                                    <div className=' flex flex-col'>
                                        <div className=' font-semibold text-[18px]'>
                                            {element.Heading}
                                        </div>
                                       <div className=' text-base'>
                                        {element.Description}
                                       </div> 
                                    </div>
                                </div>
                                <div className={` ${(index===3) ? "" : "border-r h-14 border-dotted border-richblack-100 bg-richblack-400/0 w-[26px]"}`} ></div>
                            </div>
                        )
                    })
                }
            </div>
            {/* right */}
            <div className=' relative w-fit h-fit shadow-blue-200 shadow-[0px_0px_30px_0px]'>

                <img src={TimeLine} alt='TimeLine Image' className=' object-cover h-fit shadow-white shadow-[20px_20px_0_0]'/>
                
                <div className=' absolute left-[50%] translate-x-[-50%] translate-y-[-50%] bg-caribbeangreen-700 flex flex-row text-white uppercase py-10'>

                    <div className=' flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-7 lg:px-14'>
                        <p className=' text-3xl font-bold w-[75px]'>10</p>
                        <p className=' text-caribbeangreen-300 text-sm w-[75px]'>Years Experience</p>
                    </div>
                    <div className=' flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-10'>
                        <p className=' text-3xl font-bold w-[75px]'>250</p>
                        <p className=' text-caribbeangreen-300 text-sm w-[75px]'>Type of Courses</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TimeLineSection