const { Mongoose, default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");

// create section handler function
exports.createSection = async(req,res) =>{
    try {
        // fetch the required data
        const {sectionName, courseId} = req.body;
        // data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        // createSection
        const newSection = await Section.create({sectionName});
        // update your course model with section object id
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId,{
            $push:{
                courseContent: newSection._id,
            }
        },{new:true})
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec();

        // TODO: populate section and subsection 
        // console.log((updatedCourseDetails.populate("courseContent").exec()), newSection.populate("subSection").exec());

        // Return the updated course object in the response
        return res.status(200).json({
            success:true,
            message:"Section created successfully",
            updatedCourseDetails,
        })
    } catch (error) {
        console.log("error occured while trying to create section: ",error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while creating new section, Please try again later",
            error:error.message
        });
    }
}

// update section handler function
exports.updateSection = async (req, res) => {
	try {
		const { sectionName, sectionId, courseId } = req.body;
		const section = await Section.findByIdAndUpdate(
			sectionId,
			{ sectionName },
			{ new: true }
		);

        const course = await Course.findById(courseId).populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            },
        })
        .exec();


		res.status(200).json({
			success: true,
			message: section,
            data:course
		});
	} catch (error) {
		console.error("Error updating section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

// delete section handler function
exports.deleteSection = async (req,res) =>{
    try {

        const {sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});

        
    } catch (error) {
        console.log("error occured while trying to delete section: ",error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while deleting section, Please try again later",
            error:error.message
        });
    }
}

