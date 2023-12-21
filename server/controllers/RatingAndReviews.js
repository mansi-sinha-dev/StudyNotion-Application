const RatingAndReviews = require("../models/RatingAndReviews");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");


// create rating handler function
exports.creatingRating = async(req,res)=>{
    try {
        // get user id
        const userId = req.existUser.id;
        // fetch data from req body
        const { rating, review, courseId } = req.body;
        // check if user is enrolled in course or not
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled :{$elemMatch: {$eq: userId}}
        });
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"Student is not enrolled in the course"
            })
        }
        // check if user already reviewed the course
        const alreadyReviewed  = await RatingAndReviews.findOne({
            user: userId,
            course : courseId
        });
        if(alreadyReviewed){
            return res.status(400).json({
                success:false,
                message:"Course is already reviewed by the user"
            });
        }

        // creating rating and review
        const ratingReview = await RatingAndReviews.create({
            rating, review,
            course: courseId,
            user: userId
        });

        // update course with this rating and review
        const updatedCourseDetails =  await Course.findByIdAndUpdate(
             {_id : courseId},
            {
                $push :{
                    ratingAndReviews: ratingReview._id
                }
            },{new:true}
        );
        console.log(updatedCourseDetails);

        // return
        return res.status(200).json({
            success:true,
            message:" Rating and review created successfully ",
            ratingReview
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


// getAverageRating handler function
exports.getAverageRating = async(req,res) =>{
    try {
        // get courseId
        const courseId = req.body.courseId;
        // calculate average rating
        const result = await RatingAndReviews.aggregate([
            {
                $match:{
                    course : new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating : {$avg : "$rating"}
                     },
            },
        ])
        // return rating 
        if(result?.length > 0 ){
            return res.status(200).json({
                success:true,
                averageRating : result[0].averageRating
            });
        }
        // if no rating and review
        return res.status(200).json({
            success:true,
            message:"No rating is given til now",
            averageRating : 0
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}

// getAllRatingReview handler function
exports.getAllRating = async(req,res) =>{
    try {
        const allReviews = await RatingAndReviews.find({})
        .sort({rating: "desc" })
        .populate({
            path: "user",
            // select: " firstName, lastName, email, image"
        })
        .populate({
            path: "course",
            select:"courseName"
        })
        .exec();
        // return
        return res.status(200).json({
            success:true,
            message: "All reviews fetched successfully",
            data: allReviews,
        })
        

    
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}