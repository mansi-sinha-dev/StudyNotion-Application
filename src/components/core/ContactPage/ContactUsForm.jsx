import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';

import { apiConnector } from '../../../services/apiconnector';
import { contactusEndpoint } from "./../../../services/apis";
import CountryCode from "./../../../data/countrycode.json"



const ContactUsForm = () => {

    const [loading, setLoading] = useState(false);
    // it will handle the form 
    const {register,
        handleSubmit,
        reset,
        formState:{errors, isSubmitSuccessful}} = useForm();
    // any change will handle by useEffect
    useEffect( ()=> {
        if(isSubmitSuccessful){
            reset({email:"", 
            firstName:"",
            lastName:"",
            message:"",
            phoneNo:""})
        }
    },[isSubmitSuccessful, reset])
    const submitContactForm = async(data)=>{
        console.log("Logging data", data);
        try {
            setLoading(true);
            // const response = await apiConnector("POST",contactusEndpoint.CONTACT_US_API, data);
            const response = {status:"OK"};
            console.log("Logging response", response);
            setLoading(false);
        } catch (error) {
            
        }

    }
    

  return (
    <form onSubmit={handleSubmit(submitContactForm)} >
        <div className='gap-7 flex flex-col'>
        {/* firstname and lastname */}
            <div className='flex flex-col gap-5 lg:flex-row'>
                {/* fN */}
                <div className='flex flex-col gap-2 lg:w-[48%]'>
                    <label htmlFor=' firstName'>FirstName</label>
                    <input type='text' name='firstName' id='firstName' className='bg-richblack-700 p-3 text-richblack-300 text-base leading-6 rounded-lg drop-shadow-[0_1.5px_rgba(255,255,255,0.55)]' placeholder='Enter first name' {...register("firstName",{required:true})}  />
                    {errors.firstName && <span>Please Enter your first name</span>}
                </div>
                {/* lastName */}
                <div className='flex flex-col gap-2 lg:w-[48%]'>
                    <label htmlFor=' lastName'>LastName</label>
                    <input type='text' name='lastName' id='lastName' className='bg-richblack-700 p-3 text-richblack-300 text-base leading-6 rounded-lg drop-shadow-[0_1.5px_rgba(255,255,255,0.55)]' placeholder='Enter last name' {...register("lastName",{required:true})}  />
                    {errors.firstName && <span>Please Enter your last name</span>}
                </div>
            </div>
            {/*email  */}
            <div className='flex flex-col gap-2'>
                <label htmlFor='email'>Email Address</label>
                <input type='email' name='email' id='email' className='bg-richblack-700 p-3 text-richblack-300 text-base leading-6 rounded-lg drop-shadow-[0_1.5px_rgba(255,255,255,0.55)]' placeholder='Enter email address'
                    {...register("email",{required:true})}
                />
                {errors.email && <span>Please enter your email</span>}
            </div>
            {/* phoneNo */}
           <div className='flex flex-col'>

                <label htmlFor='phonenumber'>Phone Number</label>

                <div className='flex flex-row gap-1'>
                    {/* dropdown */}
                   
                        <select
                            name='dropdown'
                            id="dropdown"
                            className='bg-richblack-700 p-3 text-richblack-300 text-base leading-6 rounded-lg drop-shadow-[0_1.5px_rgba(255,255,255,0.55)] w-[80px]'
                            {...register("countrycode", {required:true})}
                        >
                            {
                                CountryCode.map( (element , index) => {
                                    return (
                                        <option key={index} value={element.code}>
                                            {element.code} -{element.country}
                                        </option>
                                    )
                                } )
                            }
                        </select>
                        
                        <input
                            type='number'
                            name='phonenumber'
                            id='phonenumber'
                            placeholder='12345 67890'
                            className='bg-richblack-700 p-3 text-richblack-300 text-base leading-6 rounded-lg drop-shadow-[0_1.5px_rgba(255,255,255,0.55)]  w-[calc(100%-90px)] '
                            {...register("phoneNo",  
                            {
                                required:{value:true, message:"Please enter Phone Number"},
                                maxLength: {value:10, message:"Invalid Phone Number"},
                                minLength:{value:8, message:"Invalid Phone Number"} })}
                        />
                  
                </div>
                {
                    errors.phoneNo && (
                        <span>
                            {errors.phoneNo.message}
                        </span>
                    )
                }

            </div>
            {/* message */}
            <div className=' flex flex-col mt-5 '>
                <label htmlFor='message'>Message</label>
                <textarea type='text' name='message' id='message' placeholder='Enter your message' rows={"7"} cols={"30"} className='bg-richblack-700 p-3 text-richblack-300 text-base leading-6 rounded-lg drop-shadow-[0_1.5px_rgba(255,255,255,0.55)]'
                    {...register("message",{required:true})}
                />
                {errors.message && <span>Please enter your message</span>}
            </div>
            {/* button */}
            <button type='submit' className="rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         transition-all duration-200 hover:scale-95 hover:shadow-none  disabled:bg-richblack-500 sm:text-[16px] ">Send Message</button>
        </div>
    </form>
  )
}

export default ContactUsForm