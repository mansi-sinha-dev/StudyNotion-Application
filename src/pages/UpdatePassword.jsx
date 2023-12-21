import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {AiFillEye,AiFillEyeInvisible} from "react-icons/ai";
import { resetPassword } from '../services/operations/authAPI';
import { Link } from 'react-router-dom';
import { BsArrowLeft} from "react-icons/bs";
import { useSelector } from 'react-redux/es/hooks/useSelector';

const UpdatePassword = () => {
    const [formData, setFormData] = useState({
        password : "",
        confirmPassword: "",
    })

    const navigate = useNavigate();
    
    const {loading} = useSelector((state)=> state.auth);
    const [showPassword, setShowPassword] = useState(false);
    const [confirmShowPassword, setConfirmShowPassword] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    const {password, confirmPassword} = formData;
    

    const handleOnChange = (e)=>{
        setFormData((prevData)=>(
            {
                ...prevData,
                [e.target.name] : e.target.value,
            }
        ))
    }
    const handleOnSubmit =(e) =>{
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        // call the backend 
        dispatch(resetPassword(password, confirmPassword,token, navigate))
    }

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        {
            loading ? (
                <div className='spinner'>
                    
                </div>
            ) :(
                <div className='  max-w-[500px] p-4 lg:p-8'>
                    <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
                        Choose new password
                    </h1>
                    <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
                    Almost done. Enter your new password and youre all set.
                    </p>
                    <form onSubmit={handleOnSubmit}>
                        <label className=' relative'>
                            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">New Password <sup className="text-pink-200">*</sup></p>
                            <input
                                required
                                // text bhi or password bhi using flag show password
                                type={ showPassword ? "text" : "password"}
                                name='password'
                                value={password}
                                onChange={handleOnChange}
                                placeholder='password'
                                className="form-style w-full !pr-10"
                            />
                            <span onClick={()=>setShowPassword((prev)=>!prev)}
                            className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                                {
                                    showPassword ? <AiFillEye fontSize={24} fill='#AFB2BF'/> 
                                    : <AiFillEyeInvisible fontSize={24} fill="#AFB2BF"/>
                                }
                            </span>
                        </label>
                        <label className="relative mt-3 block">
                            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">Confirm New Password <sup className=' text-pink-200'>*</sup></p>
                            <input
                                required
                                // text bhi or password bhi using flag show password
                                type={ confirmShowPassword ? "text" : "password"}
                                name='confirmPassword'
                                value={confirmPassword}
                                onChange={handleOnChange}
                                placeholder='confirm password'
                                className=' "form-style w-full !pr-10"'
                            />
                            <span onClick={()=>setConfirmShowPassword((prev)=>!prev)} className="absolute right-3 top-[38px] z-[10] cursor-pointer">
                                {
                                    confirmShowPassword ? <AiFillEye fontSize={24} fill="#AFB2BF"/> 
                                    : <AiFillEyeInvisible fontSize={24} fill="#AFB2BF"/>
                                }
                            </span>
                        </label>
                        <button type='Submit' className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900">
                                Reset Password
                        </button>
                    </form>
                    <div className="mt-6 flex items-center justify-between">
                        <Link to="/login">
                            
                            <p className="flex items-center gap-x-2 text-richblack-5">
                            <BsArrowLeft/> Back to login</p>
                        </Link>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default UpdatePassword