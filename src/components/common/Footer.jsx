import React from 'react'
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link } from 'react-router-dom';
import {FaFacebook,FaGoogle,FaTwitter,FaYoutube,FaHeart} from "react-icons/fa";
import { FooterLink2 } from '../../data/footer-links';

const Resources = ["Articles", "Blog", "Chart Sheet", "Code Challenges", "Docs", "Projects", "Videos", "Workspaces"];
const Plans =["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums","Chapters", "Events"];
const BottomFooter = ["Privacy Policy","Cookie Policy", "Terms"];

const Footer = () => {
  return (
    <div className=' bg-richblack-800'>
      <div className=' flex lg:flex-row w-11/12 max-w-maxContent justify-between text-richblack-400 leading-6 gap-8 relative py-14 mx-auto'>
        <div className=' border-b border-richblack-700 w-[100%] flex flex-col lg:flex-row pb-5'>
          {/* Section 1 */}
          <div className=' w-[50%] border-r border-richblack-700 flex flex-wrap flex-row justify-between pl-3 lg:pr-5 gap-3'>
            <div className=' w-[30%] flex flex-col gap-3 lg:w-[30%] mb-7 lg:pl-0'>
              <img src={Logo}/>
              <h1 className='text-richblack-50 font-semibold text-[16px]'>Company</h1>
              <div className=' flex flex-col gap-2'>
                {["About", "Careers", "Affiliates"].map((ele,i)=>{
                  return (
                    <div key={i}
                    className='text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200'>
                      <Link to={ele.toLowerCase()} > {ele}</Link>
                    </div>

                  );
                })}
              </div>
              <div className=' flex gap-3 text-lg'>
                <FaFacebook/>
                <FaGoogle/>
                <FaTwitter/>
                <FaYoutube/>
              </div>
            </div>
            <div className='w-[48%] lg:w-[30%] mb-7 lg:pl-0'>
              <h1 className=' text-richblack-50 font-semibold text-[16px]'>Resources</h1>
              <div className=' flex flex-col gap-2 mt-2'>
                {Resources.map((element , index) =>{
                  return (
                    <div key={index}
                    className='text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200'>
                      <Link to={element.split(" ").join("-").toLowerCase()}>{element}</Link>
                    </div>
                  )
                })}
              </div>
              <h1 className='text-richblack-50 font-semibold text-[16px] mt-7'>Support</h1>
              <div className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200 mt-2">
                <Link to={"/help-center"}>Help Center</Link>
              </div>
            </div>
            <div className='w-[48%] lg:w-[30%] mb-7 lg:pl-0'>
              <h1 className=' text-richblack-50 font-semibold text-[16px]'>Plans</h1>
              <div className=' flex flex-col gap-2 mt-2'>
                {Plans.map((element,index) => {
                  return (
                    <div key={index}
                    className='text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200'>
                      <Link to={element.split(" ").join("-").toLowerCase()}>{element}</Link>
                    </div>
                  )
                })}
              </div>
              <h1 className=' text-richblack-50 font-semibold text-[16px] mt-7'>Community</h1>
              <div className=' flex flex-col gap-2 mt-2'>
                {Community.map((element,index) => {
                  return (
                    <div key={index}
                    className='text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200'>
                      <Link to={element.split(" ").join("-").toLowerCase()}>{element}</Link>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          {/* Section 2 */}
          <div className="lg:w-[50%] flex flex-wrap flex-row justify-between pl-3 lg:pl-5 gap-3">
            {FooterLink2.map((ele,index) => {
              return (
                <div key={index} className="w-[48%] lg:w-[30%] mb-7 lg:pl-0">
                  <h1 className=' text-richblack-50 font-semibold text-[16px]'>{ele.title}</h1>
                  <div className=' flex flex-col mt-2 gap-2'>
                    {ele.links.map((link,index)=>{
                      return (<div key={index}
                      className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
                        <Link to={link.link}>{link.title}</Link>
                      </div>)
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>


      <div className=' flex lg:flex-row w-11/12 max-w-maxContent justify-between text-richblack-400 pb-14 mx-auto text-sm '>
        {/* section 1 */}
        <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">
          <div className=' flex flex-row '>
            {BottomFooter.map((ele, index) =>{
              return (
                <div key={index}
                className={`${
                  BottomFooter.length - 1 === index
                ? "" :
                "border-r border-richblack-700 cursor-pointer hover:text-richblack-50 transition-all duration-200"
                } px-3`}>
                  <Link to={ele.split(" ").join("-").toLocaleLowerCase()}>
                    {ele}
                  </Link>

                </div>
              );
            })}
          </div>
          <div className='text-center flex items-center gap-1'> Made with <FaHeart className=' text-[#FF0000]'/> CodeHelp © 2023 Studynotion</div>
        </div>
      </div>
    </div>
  )
}

export default Footer