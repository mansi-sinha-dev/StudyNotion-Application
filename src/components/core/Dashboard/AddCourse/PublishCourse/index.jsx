import { useState } from "react";
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../../../common/IconBtn";
import { resetCourseState, setStep } from "../../../../../slices/courseSlice";
import { useEffect } from "react";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI";


export default function PublishCourse(){

    const {
        register,
        handleSubmit,
        setValue,
        getValues
    }  = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {token} = useSelector((state)=> state.auth);
    const {course} = useSelector((state)=> state.course);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if (course?.status === COURSE_STATUS.PUBLISHED){
            setValue("public", true)
        }
    },[]);

    const goBack = ()=>{
        dispatch(setStep(2));
    }
    const gotToCourses = ()=>{
        dispatch(resetCourseState());
        // navigate(/dashboard/my-course)
        navigate("/dashboard/my-courses")
    }

    const handleCoursePublish = async ()=>{
        // agar form /course update hi nhi hua , kuch changes save nhi kare toh api call nhi krna chaiye
        if (course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true 
        || (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)){
            // no updation in form
            // no need to make api call

            gotToCourses(); 
            // it will show all the courses created
            return;
        } 

        // maan lo form update hua hai to form ka data create karo bhai
        const formData = new FormData();
        formData.append("courseId", course._id);
        const courseStatus = getValues("public")  ? COURSE_STATUS.PUBLISHED
        : COURSE_STATUS.DRAFT
        // console.log("courseStatus", courseStatus);
        formData.append("status", courseStatus);
        // course details ko update karne hai 
        // api call
        setLoading(true);
        const result = await editCourseDetails(formData,token);
        if(result){
            gotToCourses();
        }
        setLoading(false);
    }

    const onSubmit = (data)=>{
        console.log("data of form to be publish", data);
        handleCoursePublish();
    }


    return (
        <div className=" rounded-md border-[1px] bg-richblack-800 p-6 border-richblack-700">
            <p className="text-2xl font-semibold text-richblack-5">Publish Settings</p>
            <form onSubmit={handleSubmit(onSubmit)}>
            {/* checkbox */}
                <div className="my-6 mb-8">
                    <label htmlFor="public" className="inline-flex items-center text-lg">
                        <input type="checkbox"
                            id="public"
                            {...register("public")}
                            className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
                        />
                        <span className="ml-2 text-richblack-400">Make this course as public</span>
                    </label>
                </div>
                {/* next prev button */}
                <div className="ml-auto flex max-w-max items-center gap-x-4">
                    <button disabled={loading}
                    type="button"
                    onClick={goBack}
                    className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900">
                        Back
                    </button>
                    <IconBtn disabled={loading} text="Save Changes"/>
                </div>
            </form>
        </div>
    )
}