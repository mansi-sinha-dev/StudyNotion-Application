import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import {RxDropdownMenu} from "react-icons/rx"
import {MdEdit} from "react-icons/md"
import {RiDeleteBin6Line} from "react-icons/ri"
import {BiDownArrow} from "react-icons/bi"
import {AiOutlinePlus} from "react-icons/ai"
import SubSectionModal from './SubSectionModal';
import ConfirmationModal from '../../../../common/ConfirmationModal';
import { deleteSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { deleteSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../slices/courseSlice';

const NestedView = ({handleChangeEditSectionName}) => {
    const {course} = useSelector((state)=> state.course);
    const {token} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const [addSubSection, setAddSubSection] = useState(null);
    const [editSubSection, setEditSubSection] = useState(null);
    const [viewSubSection, setViewSubSection] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null);

    useEffect(() => {
        console.log("REndering it again");
    });

    // const handleDeleteSection = async(sectionId) => {
    //     console.log("handleDelete Section clicked")
    //     const result = await deleteSection({
    //         sectionId,
    //         courseId: course._id,
    //         token
    // });
    //     console.log("PRINTING AFTER DELETE SECTIOn", result);
    //     if(result) {
    //         dispatch(setCourse(result))
    //     }
    //     setConfirmationModal(null);

    // }

    const handleDeleteSection = async (sectionId) => {
        console.log("handle delete section is clicked");
        const result = await deleteSection({
          sectionId,
          courseId: course._id,
          token,
        })
        if (result) {
          dispatch(setCourse(result))
        }
        setConfirmationModal(null)
      }

    const handleDeleteSubSection = async(subSectionId, sectionId)=>{
        const result = await deleteSubSection({
            subSectionId, sectionId, token
        })

        if (result){
            const updatedCourseContent = course.courseContent.map((section)=>section._id === sectionId ? result : section);
            const updatedCourse = {...course, courseContent : updatedCourseContent};
            dispatch(setCourse(updatedCourse));
        }
        setConfirmationModal(null);
    }

  return (
    <div className=' text-white'>
    {/* section and subsection  */}
        <div className=' mt-10 rounded-lg bg-richblack-700 p-6 px-8'>
            {
                course?.courseContent?.map((section)=>(
                    <details key={section._id} open>
                        <summary className=' flex items-center justify-between gap-x-3 border-b-2'>
                        {/* label of section */}
                            <div className=' flex items-center gap-x-3'>
                                <RxDropdownMenu/>
                                <p> {section.sectionName} </p>
                            </div>
                            {/* button of right side */}
                            <div className=' flex items-center gap-x-3'>
                                {/* edit button */}
                                <button
                                onClick={()=>handleChangeEditSectionName(section._id, section.sectionName)}> 
                                    <MdEdit/>                                   
                                </button>
                                {/* delete button */}
                               
                                <button
                                     onClick={() =>{
                                        console.log("Clicked the button of confirmation modal");
                                        setConfirmationModal({
                                        text1: "Delete this Section?",
                                        text2: "All the lectures in this section will be deleted",
                                        btn1Text: "Delete",
                                        btn2Text: "Cancel",
                                        btn1Handler: () => handleDeleteSection(section._id),
                                        btn2Handler: () => setConfirmationModal(null),
                                        })
                                     }
                                     
                  }
                >
                  <RiDeleteBin6Line className="text-xl text-richblack-300" />
                </button>
                                <span>|</span>
                                <BiDownArrow className={`text-xl text-richblack-300`} />

                            </div>
                        </summary>

                        {/* now all subsection will render */}
                        <div className="px-6 pb-4">
                            {
                                section.subSection.map((data)=>(
                                    <div key={data?._id} onClick={()=>setViewSubSection(data)}
                                    className=' flex items-center justify-between gap-x-3 border-b-2'>
                                        {/* subsection label */}
                                        <div className=' flex items-center gap-x-3'>
                                            <RxDropdownMenu/>
                                            <p>{data.title}</p>
                                        </div>
                                        {/* edit and delete button */}
                                        <div className=' flex items-center gap-x-3'
                                        onClick ={(e)=> e.stopPropagation()}>
                                            {/* edit */}
                                            <button onClick={()=>setEditSubSection({...data, sectionId:section._id})}>
                                                <MdEdit/>
                                            </button>
                                            {/* delete */}
                                            <button
                                             onClick={() => setConfirmationModal({
                                             text1: "Delete this Sub Section",
                                             text2: "selected Lecture will be deleted",
                                             btn1Text: "Delete",
                                             btn2Text: "Cancel",
                                             btn1Handler: () => handleDeleteSubSection(data._id, section._id),
                                             btn2Handler: () => setConfirmationModal(null), })}
                                    >
                                                   <RiDeleteBin6Line />
                                        
                                            </button>
                                        </div>
                                    </div>
                                ))
                            }

                            {/* add lecture button */}
                            <button onClick={()=>setAddSubSection(section._id)}
                            className=' flex items-center text-yellow-50 gap-x-2'>
                                <AiOutlinePlus/>
                                <p>Add Lecture</p>
                            </button>
                        </div>
                    </details>
                )) 
            }
        </div>
        {/* modal add karna hai */}
        {addSubSection ? 

        (<SubSectionModal modalData={addSubSection} setModalData={setAddSubSection} add={true}/>)
        :viewSubSection ? 
        (<SubSectionModal modalData={viewSubSection} setModalData={setViewSubSection} view={true}/>)
        :
        editSubSection ?

        (<SubSectionModal modalData={editSubSection} setModalData={setEditSubSection} edit={true}/>)
        :
        (<div></div>) 
        }

        {/* confirmation Modal */}
        {
            confirmationModal ? (<ConfirmationModal modalData={confirmationModal}/>)
            :
            (<div></div>)
        }
    </div>
    
  )
}

export default NestedView