import React from 'react'
import {FaArrowRight, } from "react-icons/fa";
import { Link } from 'react-router-dom';
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import Footer from '../components/common/Footer';
import TimeLineSection from "../components/core/HomePage/TimeLineSection";
import LearnLanguageSection from "../components/core/HomePage/LearnLanguageSection";
import InstructorSection from '../components/core/HomePage/InstructorSection';
import { ExploreMore } from '../components/core/HomePage/ExploreMore';
import ReviewSlider from '../components/common/ReviewSlider';


const Home = () => {
  return (
    <div>
        {/* Section 1 */}
        <div className=' relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between gap-8'>
        
            <Link to={"/signup"}>
                {/* for rounded button */}
                <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
                    {/* for button content */}
                    <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
                        <p>Become an Instructor</p>
                        <FaArrowRight/>
                    </div>
                </div>
            </Link>
            <div className=' font-semibold text-4xl text-center'>
                Empower your Future with <HighlightText text={"Coding Skills"}/>
            </div>
            <div className=' -mt-3 w-[90%] font-bold text-center text-lg text-richblack-300'>
            With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
            </div>
            <div className=' flex flex-row gap-7 mt-8'>
                <CTAButton active={true} linkto={"/signup"}>
                    Learn More
                </CTAButton>
                <CTAButton active={false} linkto={"/login"}>
                    Book a Demo
                </CTAButton>
            </div>
            <div className=' mx-3 my-7 shadow-blue-200 shadow-[10px_-5px_50px_-5px]'>
                <video muted autoPlay loop className=' shadow-[20px_20px_rgba(255,255,255)]'>
                    <source src={Banner}></source>
                </video>
            </div>
            {/* Code Section 1 */}
            <div>
                <CodeBlocks position={" lg:flex-row"}
                heading={
                    <div className=' text-4xl font-semibold'>
                        Unlock your <HighlightText text={"coding potential"}/> with our online courses
                    </div>
                }
                subheading={
                    "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                }
                ctabtn1={
                    {
                        btnText : "Try it Yourself",
                        linkto : "/signup",
                        active : true
                    }
                }
                ctabtn2={
                    {
                        btnText : "Learn More",
                        linkto : "/login",
                        active : false
                    }
                }
                
                codeblock={`<!DOCTYPE html>\n<html>\n<head>\n<title>This is my page</title>\n/head>\n<body>\n<h1><ahref="/">Header</a>\n</h1>\n<nav><ahref="one/">One</a><ahref="two/">Two</a><ahref="three/">Three</a>\n</nav>`}
                backgroundGradient={<div className="codeblock1 absolute"></div>}
                codeColor={" text-yellow-25"}
                >      
                      
                </CodeBlocks>
            </div>
            {/* Code Section 2 */}
            <div>
                <CodeBlocks position={" lg:flex-row-reverse"}
                heading={
                    <div className=' w-[50%] text-4xl font-semibold lg:w-[50%]"'>
                        Start <HighlightText text={"coding in seconds"}/> 
                    </div>
                }
                subheading={
                    
                        "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                   
                }
                ctabtn1={
                    {
                        btnText : "Continue Lesson",
                        linkto : "/signup",
                        active : true
                    }
                }
                ctabtn2={
                    {
                        btnText : "Learn More",
                        linkto : "/login",
                        active : false
                    }
                }
                codeblock={`import React from "react";\nimport CTAButton from "./Button"\nimport { TypeAnimation } from 'react-type-animation';\nimport {FaArrowRight} from "react-icons/fa";\n\nconst Home() =>{\nreturn (\n<div> Home </div>\n)\n}\nexport default Home;`}
                codeColor={`text-blue-25`}
                backgroundGradient={<div className="codeblock2 absolute"></div>}
                >            
                </CodeBlocks>
            </div>
            {/* Unlock the power of code Section */}
            <div>
                <ExploreMore/>
            </div>


        </div>

        {/* Section 2 */}
        <div className=' bg-pure-greys-5 text-richblack-700'>
            <div className="homepage_bg h-[320px]">
            {/* Explore Full Catagory Section */}
                <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
                    <div className="lg:h-[150px]"></div>
                    <div className=' flex gap-7 text-white flex-row lg:mt-8'>
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className=' flex items-center gap-2'>
                                Explore Full Catalog
                                <FaArrowRight/>
                            </div>
                        </CTAButton>
                        <CTAButton active={false} linkto={"/signup"}>
                            <div>
                                Learn More
                            </div>
                        </CTAButton>
                    </div>
                </div>
            </div>

            <div className=' w-11/12 max-w-maxContent mx-auto flex flex-col items-center justify-between gap-8'>
            {/* Job that is in Demand - Section 1 */}
                <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
                    <div className=' text-4xl font-semibold lg:w-[45%] '>
                        Get the skills you need for a <HighlightText text={"job that is in demand."}/>
                    </div>
                    <div className='flex flex-col gap-10 items-start w-[40%]  '>
                        <div className=' text-[16px]'>
                            The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                        </div>
                        <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
                    </div>
                </div>

                <TimeLineSection/>
                <LearnLanguageSection/>
            </div>
        </div>

        {/* Section 3 */}
        <div className=' w-11/12 max-w-maxContent mx-auto  flex-col items-center justify-between gap-8 bg-richblack-900 text-white'>
            <InstructorSection/>
            <h2 className=' text-center text-4xl font-semibold mt-8'>Reviews from other Learners</h2>
            {/* Review Slider */}
            <ReviewSlider />
        </div>



        {/* Footer */}
        <Footer/>
    </div>
  )
}

export default Home