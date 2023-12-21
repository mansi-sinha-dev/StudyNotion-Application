import React, { useState } from 'react'
import { sidebarLinks } from '../../../data/dashboard-links'
import { logout } from '../../../services/operations/authAPI'
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import { VscSignOut} from "react-icons/vsc"
import { useNavigate } from 'react-router-dom'
import ConfirmationModal from '../../common/ConfirmationModal'

const Sidebar = () => {
    const {user , loading : profileLoading} = useSelector( (state) =>state.profile);
    const {loading : authLoading} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // state of modal does not have the data that what to show ; when logut button will be click its data will be set 
    const [confirmationModal, setConfirmationModal] = useState(null);

    if(authLoading || profileLoading){
        return(
          <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
          <div className='sipnner'></div>
          </div>
            
        )
    }

  return (
    <>
        <div className='flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10'>
           <div className=' flex flex-col'>
            {
                sidebarLinks.map((link, ) =>{
                    if(link.type  && user?.accountType !== link.type) return null;
                    return(<SidebarLink link={link} iconName={link.icon} key={link.id} />)
                })
            }
           </div>
           <div className='mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700'></div>
           <div className=' flex flex-col'>
              <SidebarLink link={{name:"Settings", path:"dashboard/settings"}} iconName="VscSettingsGear" />
            {/*logout button  */}
            <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="px-8 py-2 text-sm font-medium text-richblack-300"
          >
            <div className="flex items-center gap-x-2">
              <VscSignOut className="text-lg" />
              <span>Logout</span>
            </div>
          </button>
           </div>

        </div>
        {/* agar click hoga to show krna hai */}
        {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </>
  )
}

export default Sidebar