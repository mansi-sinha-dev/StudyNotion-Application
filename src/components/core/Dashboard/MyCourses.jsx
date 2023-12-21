import { useEffect } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import IconBtn from "../../common/IconBtn"
import {VscAdd} from "react-icons/vsc"
import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import CoursesTable from "./InstructorCourses/CoursesTable"


export default function MyCourses (){

    const {token} = useSelector((state)=> state.auth)
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])

    // fetch all courses of instructor
    useEffect(()=>{
        // api call
        const fetchCourses = async()=>{
            const result = await fetchInstructorCourses(token);
            
            if(result){
                setCourses(result);
            }
        }
        // function call
        fetchCourses();
    },[])

    return(
        <div>
            <div className="mb-14 flex items-center justify-between">
                <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
                <IconBtn text="Add Course"
                onclick={()=>navigate("/dashboard/add-course")} >
                    <VscAdd/>
                </IconBtn>
            </div>

            {/* if courses exist then only show the courses */}
            {courses && <CoursesTable courses={courses} setCourses={setCourses} />}
        </div>
    )
}