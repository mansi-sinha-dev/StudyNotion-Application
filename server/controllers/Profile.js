const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress");
const { convertSecondsToDuration } = require("../utils/secToDuration");
const Course = require("../models/Course");


// update Profile handler function because in user we have already created the Profile 
exports.updateProfile = async (req,res) =>{
    try {
        // fetch data
        const {dateOfBirth="", about="", gender="", contactNumber=""} = req.body;
        // get user id
        const id =  req.existUser.id;
        
       // Find the profile by id
		const userDetails = await User.findById(id);
    console.log("userdetails", userDetails)
		const profile = await Profile.findById(userDetails?.additionalDetails);


      	// Update the profile fields
		profile.dateOfBirth = dateOfBirth;
		profile.about = about;
		profile.contactNumber = contactNumber;
    profile.gender = gender;


        // Save the updated profile
		await profile.save();
        //  return
        return res.status(200).json({
            success:true,
            message:"Successfully updated profile",
            data:profile
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update profile",
            error:error.message
        })
    }
}

// delete Account handler function
exports.deleteAccount = async (req,res) =>{
    try {
        // TODO: Find More on Job Schedule
		// const job = schedule.scheduleJob("10 * * * * *", function () {
		// 	console.log("The answer to life, the universe, and everything!");
		// });
		// console.log(job);
        // fetch the user id
        const id = req.existUser.id;
        const userDetails = await User.findById({_id:id});
        // validation
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User not found",
                
            });
        }

       // Delete Assosiated Profile with the User
        await Profile.findByIdAndDelete({_id : userDetails.additionalDetails});
        // await Profile.findByIdAndDelete({ _id: user.userDetails });
        // TODO: Unenroll User From All the Enrolled Courses
        // delete User
        await User.findByIdAndDelete({_id:id});
        // return
        return res.status(200).json({
            success:true,
            message:"User deleted successfully",
            
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to delete profile",
            error:error.message
        });
    }
}

// getAllUserDetails
exports.getAllUserDetails = async(req,res) =>{
    try {
        // get user id
        const id = req.existUser.id;
        // validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        return res.status(200).json({
            success:true,
            message:"User data fetched successfully",
            data:userDetails
            
        }) 
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to fetch user data ",
            error:error.message,
        });
    }
};

//updateDisplayPicture
exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.existUser.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.existUser.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path:"course",
          populate:{
            path:"courseContent",
            populate:{
                path:"subSection",
                // select:"-videoUrl",
            },
        }
        })
        .exec()
      console.log("USER DETAILS backend ", userDetails.course);

      userDetails = userDetails.toObject()
      
	  var SubsectionLength = 0

	  for (var i = 0; i < userDetails.course.length; i++) {

		let totalDurationInSeconds = 0

		SubsectionLength = 0

		for (var j = 0; j < userDetails.course[i].courseContent.length; j++) {

		  totalDurationInSeconds += userDetails.course[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)


		  userDetails.course[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds)


		  SubsectionLength +=
			userDetails.course[i].courseContent[j].subSection.length
		}
		let courseProgressCount = await CourseProgress.findOne({
		  courseID: userDetails.course[i]._id,
		  userId: userId,
		})
		courseProgressCount = courseProgressCount?.completedVideos.length
		if (SubsectionLength === 0) {
		  userDetails.course[i].progressPercentage = 100
		} else {
		  // To make it up to 2 decimal point
		  const multiplier = Math.pow(10, 2)
		  userDetails.course[i].progressPercentage =
			Math.round(
			  (courseProgressCount / SubsectionLength) * 100 * multiplier
			) / multiplier
		}
	  }
      
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails?.course,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};

exports.instructorDashboard = async(req, res) => {
	try{
		const courseDetails = await Course.find({instructor:req.existUser.id});

		const courseData  = courseDetails.map((course)=> {
			const totalStudentsEnrolled = course.studentsEnrolled.length
			const totalAmountGenerated = totalStudentsEnrolled * course.price

			//create an new object with the additional fields
			const courseDataWithStats = {
				_id: course._id,
				courseName: course.courseName,
				courseDescription: course.courseDescription,
				totalStudentsEnrolled,
				totalAmountGenerated,
			}
			return courseDataWithStats
		})

		res.status(200).json({courses:courseData});

	}
	catch(error) {
		console.error(error);
		res.status(500).json({message:"Internal Server Error"});
	}
}