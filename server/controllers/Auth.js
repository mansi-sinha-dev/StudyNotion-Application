const User = require("../models/User");
const otpGenerator = require("otp-generator");
const OTP = require("../models/OTP");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");
const {passwordUpdated} = require("../mail/templates/passwordUpdate");


// send otp for email verification
exports.sendOtp = async(req,res)=>{
    try {
        // fetch data from request ki body
        const {email} = req.body;
        // check user already exist or not
        // find user with provided email
        const checkUserPresent = await User.findOne({email});
         
        if(checkUserPresent){
           
            return res.status(401).json({
                success:false,
                message:`User already registered`
            });
        }
        // generate the otp 
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
       
        // check the generated otp is unique or not
        const result = await OTP.findOne({otp:otp});
        
		console.log("Result", result);
        
        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            });
           
        }
        // otp ka object create
        const otpPayload = {email,otp};
        
        const otpBody = await OTP.create(otpPayload);
        res.status(200).json({
            success:true,
            message:'Otp send successfully',
            otp
        });
    } catch (error) {
        console.log("Error occured while generating otp");
        console.error(error.message);
        return res.status(500).json({ success: false, error: error.message });
    }
}
// Signup Controller for Registering USers
exports.signUp = async(req,res)=>{
    try {
        // fetch data from request body
        const {
            firstName,
            lastName, 
            email, 
            password, 
            confirmPassword, 
            accountType, 
            contactNumber,
            otp,
        } = req.body;
        // Check if All Details are there or not
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            });
        }
        // Check if password and confirm password match
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirmPassword does not matched, Please try again later"
            });
        }
        // check user already exist or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already registered, Please sign in to continue."
            });
        }
        // find most recentOtp stored for the user
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
       
        if (recentOtp.length === 0) {
			
			return res.status(400).json({
				success: false,
				message: "The OTP is not found",
			});
		} else if (otp !== recentOtp[0].otp) {
			
			return res.status(400).json({
				success: false,
				message: "The OTP is not valid",
			});
		}

        // hash password
        const hashedPassword = await bcrypt.hash(password,10);

        // Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

       // Create the Additional Profile For User
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth :null,
            about: null,
            contactNumber: null
        });

        const user = await User.create({
            firstName, lastName, email, contactNumber, password:hashedPassword,
            accountType:accountType,
            approved:approved,
            additionalDetails:profileDetails._id, image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });
        // return response
        return res.status(200).json({
            success:true,
            message:"User registered successfully",
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered, Please try again later"
        });
    }
}

// Login controller for authenticating users
exports.login = async(req,res) =>{
    try {
       // Get email and password from request body
        const {email, password} = req.body;
        // Check if email or password is missing
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:`Please fill all the details`
            });
        }
       
        let existUser = await User.findOne({email}).populate("additionalDetails");;
        // If user not found with provided email
        if(!existUser){
            
            return res.status(401).json({
                success:false,
                message:`User is not Registered with Us Please SignUp to Continue`
            });
        }
      
        // verify the token and then generate the JWT token
        // Generate JWT token and Compare Password
        if(await bcrypt.compare(password, existUser.password)){
            // create JWT with sign method
            const token = jwt.sign({ email: existUser.email, id: existUser._id, accountType: existUser.accountType } ,
                process.env.JWT_SECRET,{
                expiresIn:"24h"
            });
            // Save token to user document in database
            existUser.token = token;
            existUser.password = undefined;

            // Set cookie for token and return success response
            const options = {
                expires: new Date(Date.now() +  3 * 24 * 60 * 60 * 1000),
                httpOnly:true
            }
            // cookie in response
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                existUser,
                message : `User Login Success`
            });

        }else{
            // password do not matched
            return res.status(401).json({
                success:false,
                message:`Password is incorrect`,
            });
        }
    } catch (error) {
        console.log("Error occured during login the user:", error);
        // Return 500 Internal Server Error status code with error message
        return res.status(500).json({
            success:false,
            message:`Login Failure Please Try Again`,
        });
    }
};

// Controller for Changing Password
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};