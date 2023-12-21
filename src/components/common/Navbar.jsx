import React, { useEffect, useState } from 'react'
import { Link, matchPath } from 'react-router-dom';
import logo from "../../assets/Logo/Logo-Full-Light.png";
import {NavbarLinks} from "../../data/navbar-links";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {FaShoppingCart} from "react-icons/fa";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from '../../services/apiconnector';
import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import { BsChevronDown } from "react-icons/bs"




const Navbar = () => {
    console.log("Printing base url: ",process.env.REACT_APP_BASE_URL);
    const {token} = useSelector( (state) => state.auth);
    const {user} = useSelector( (state) => state.profile);
    const {totalItems} = useSelector( (state) => state.cart);
    const[loading , setLoading] = useState(false);

    const [subLinks, setSubLinks] = useState([])


    useEffect(() => {
        ;(async () => {
          setLoading(true)
          try {
            const res = await apiConnector("GET", categories.CATEGORIES_API)
            // console.log("Print the categories of links", res);
            setSubLinks(res?.data?.data)
            console.log("catalog data",res?.data?.data);
            
          } catch (error) {
            console.log("Could not fetch Categories.", error)
          }
          setLoading(false)
        })()
      }, [])

      console.log("Print the categories of sublinks", subLinks);


    const location = useLocation();
    const matchRoute = (route) =>{
        return matchPath({path:route}, location.pathname);
    }
  return (
    <div className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
      location.pathname !== "/" ? "bg-richblack-800" : ""
    } transition-all duration-200`}>
        <div className=' flex items-center justify-between w-11/12 max-w-maxContent '>
        {/* image */}
            <Link to="/">
                <img src={logo} alt='Logo' loading=' lazy' width={160} height={32}/>
            </Link>
            {/* nav links */}
            <nav className=' md:block hidden'>
                <ul className=' flex gap-x-6 text-richblue-25'>
                    {NavbarLinks.map( (link, index) =>(
                        <li key={index}>
                        {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : subLinks.length ? (
                          <>
                            {subLinks?.filter((subLink)=> subLink?.courses?.length > 0)
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))}
                          </>
                        ) : (
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                                <Link to ={link?.path}>
                                    <p className={`${matchRoute(link?.path) ? " text-yellow-25":
                                    " text-richblack-25"}`}>
                                        {
                                            link.title
                                        }
                                    </p>
                                </Link>
                            )
                        }</li>
                    ))}
                </ul>
            </nav>

            {/* login/signup/dashboard */}
            <div className=' flex gap-x-6 items-center'>
                {
                    user && user?.accountType != "Instructor" && (
                        <Link to="/dashboard/cart" className='flex flex-row text-white relative'>
                            <FaShoppingCart />
                            {totalItems > 0 && (
                                <span className=" absolute -top-1 -right-3 bg-caribbeangreen-600 animate-bounce rounded-full text-white flex justify-center items-center text-xs w-5 h-5">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )
                }

                {/* login button */}
                {
                    token === null && (
                        <Link to="/login">
                            <button className=' border border-richblack-700 rounded-[8px] text-richblack-100 bg-richblack-800 px-[12px] py-[8px]'>
                              Log in
                            </button>
                        </Link>
                    )
                }

                {/* signup button */}
                {
                    token === null && (
                        <Link to="/signup">
                            <button className=' border border-richblack-700 rounded-[8px] text-richblack-100 bg-richblack-800 px-[12px] py-[8px]'>
                              Sign Up
                            </button>
                        </Link>
                    )
                }

                {
                    token !== null && <ProfileDropDown/>
                }
            </div>
            

        </div>
    </div>
  )
}

export default Navbar