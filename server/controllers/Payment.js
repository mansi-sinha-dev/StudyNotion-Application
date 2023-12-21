const { default: mongoose } = require("mongoose");
const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");
// const app = express();
// app.use(express.json());



// initate the razorpay order
exports.capturePayment = async(req, res) => {
    
    // const {courses} = req.body;
    const {courses} = req.body;
    console.log("request", req.body);
    
    const userId = req.existUser?.id;

    if(courses.length === 0){
        return res.json({success:false,
        message:"Please provide course id"});
    }

    let totalAmount = 0;
    for(const course_id of courses){
        let course;
        try {
            course = await Course.findById(course_id);
            if(!course){
                return res.status(200).json({success:false, message:"Could not find the course"});
            }

            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)){
                return res.status(200).json({success:false, message:"Student is already Enrolled"});
            }
            // console.log("course price", course.price);
            // console.log("course price", course?.price);
            totalAmount += course.price;
            

        } catch (error) {
            console.log(error);
            return res.status(500).json({success:false, message:error.message});
        }
    }

    // create options
    const currency ="INR";
    const options ={
        amount : totalAmount * 100,
        currency,
        receipt : Math.random(Date.now()).toString(),
    }
// create order
    try {
        const paymentResponse = await instance.orders.create(options);
        console.log("Payment options is created ", options);
        res.json({
            success:true,
            message:paymentResponse,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, mesage:"Could not Initiate Order"});
    }

}

// verify the payment
exports.verifyPayment = async(req, res) =>{
    console.log("Verification of payment entered");
    console.log("request",req.body);
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.existUser.id;

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId){
        return res.status(200).json({success:false, message:"Payment Failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET).update(body.toString()).digest("hex");

    if(expectedSignature === razorpay_signature){
        // enroll karwao student ko
        await enrollStudents(courses, userId, res);
        //return res
        return res.status(200).json({success:true, message:"Payment Verified"});
    }
    return res.status(200).json({success:"false", message:"Payment Failed"});
}


const enrollStudents = async(courses, userId, res) =>{
    if(!courses || !userId){
        return res.status(400).json({success:false,message:"Please Provide data for Courses or UserId"});
    }
    for(const courseId of courses){
        try {
            // find the course and enroll the student in  it
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id:courseId},
                {$push:{studentsEnrolled:userId}},
                {new:true},
            )
            if(!enrolledCourse){
                return res.status(500).json({success:false,message:"Course not Found"});
            }

            const courseProgress = await CourseProgress.create({
                courseID:courseId,
                userId:userId,
                completedVideos: [],
            })

            // find the student and add the course to their list of enrolled courses
            const enrolledStudent = await User.findByIdAndUpdate(userId,
                {$push:{
                    course: courseId,
                    courseProgress: courseProgress._id,
                }},{new:true})

            // bacche ko mail send krdo
            const emailResponse = await mailSender(enrollStudents.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
        )
            //console.log("Email Sent Successfully", emailResponse.response);

        } catch (error) {
            console.log(error);
            return res.status(500).json({success:false, message:error.message});
        }
    }
}

exports.sendPaymentSuccessEmail = async(req,res)=>{
    const {orderId, paymentId, amount} = req.body;
    const userId = req.existUser.id;

    if(!orderId || !paymentId || !amount || !userId){
        return res.status(400).json({success:false, message:"Please provide all the fields"});
    }
    try {
        // student ko dhundho
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
             paymentSuccessEmail(`${enrolledStudent.firstName}`,
             amount/100,orderId, paymentId)
        )
    } catch (error) {
        console.log("error in sending mail", error)
        return res.status(500).json({success:false, message:"Could not send email"})
    }
}

// capture payment and initiate the order
// exports.capturePayment = async (req,res) =>{
//     // get courseId and userId
//     const {course_id} = req.body;
//     const userId = req.existUser.id;
//     // validation 
//     // valid courseId
//     if(!course_id){
//         return res.status(400).json({
//             success:false,
//             message:"please provide valid course_id"
//         })
//     }

//     // valid course details from database
//     let course 
//     try {
//         course = await Course.findById(course_id);
//         if(!course){
//             return res.json({
//                 success:false,
//                 message:"Could not found the course"
//             })
//         }
//         // user is already paid for the course or not
//         const uid = new mongoose.Types.ObjectId(userId);
//         if(course.studentsEnrolled.includes(uid)){
//             return res.status(200).json({
//                 success:false,
//                 message:"student/user is already enrolled"
//             });
//         }

//     } catch (error) {
//         console.log(error);

//         return res.json({
//             success:false,
//             message:error.message
//         });
//     }

//     // order create
//     const amount = course.price;
//     const currency = "INR";

//     const options={
//         amount:amount*100,
//         currency,
//         receipt : Math.random(Date.now()).toString(),
//         notes:{
//             courseId :course_id,
//             userId
//         }
//     }
//     // function call to create an order
//     try {
//         // initiate the payment using razorpay
//         const paymentResponse = await instance.orders.create(options);
//         console.log(paymentResponse);

//         // return response
//         return res.status(200).json({
//             success:true,
//             courseName :course.courseName,
//             courseDescription: course.courseDescription,
//             thumbnail: course.thumbnail,
//             orderId : paymentResponse.id,
//             currency: paymentResponse.currency,
//             amount: paymentResponse.amount
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:"Could not initiate the order"
//         });
//     }
  
// }

// authorize
// handler function--> verifySignature
// exports.verifySignature = async (req,res) =>{
//     // matching of server secret and razorpay secret
//     // secret of server
//     const webhookSecret = "12345678";

//     // razorpay signature 
//     const signature = req.header["x-razorpay-signature"];


//     // webhook secret ko convert kr rhe taki matching kr paye
//     const shasum = crypto.createHmac("sha256",webhookSecret);
//     // convert it into string format
//     shasum.update(JSON.stringify(req.body));
//     // output in hexadecimal format
//     const digest = shasum.digest("hex");

//     // now match them
//     if(signature === digest){
//         console.log("Payment is authorized");
//         // actions to do after payment
//         const {courseId, userId } = req.body.payload.payment.entity.notes;

//         try {
//             // fulfil the action-->find the course and enroll the student in it
//             const enrolledCourse = await Course.findOneAndUpdate({_id:courseId},
//                 {$push:{studentsEnrolled : userId}},
//                 {new:true});
//             // verify the response
//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success:false,
//                     message:"could not found enrolled course"
//                 });
//             }
//             console.log(enrolledCourse);
            
//             //find the student and add the course to their list enrolled course me
//             const enrolledStudent = await User.findOneAndUpdate({_id:userId},
//                 {$push: {course:courseId}},
//                 {new: true});

//             console.log(enrolledStudent);

//             // send mail to user about course enrolled confirmation
//             const emailResponse = await mailSender(enrolledStudent.email,
//                 "Congratulations from StudyNotio",
//                 "Congratulations, you are onboard into new StudyNotion course");
//             console.log(emailResponse);
//             return res.status(200).json({
//                 success:true,
//                 message:"Signature is verified and course added"
//             });
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 error:error.message
//             });
//         }
//     }else{
//         return res.status(400).json({
//             success:false,
//             message:"Invalid request"
//         });
//     }
// }