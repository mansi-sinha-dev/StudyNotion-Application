const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// resetPasswordToken
exports.resetPasswordToken = async (req,res) =>{
    try {
        // fetch email from request body
        const email = req.body.email;
        // check user for this email, email validation
        const existUser = await User.findOne({email:email});
        if(!existUser){
            return res.status(400).json({
                success:false,
                message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
            });
        }
        // generate token
        // const token = crypto.randomUUID();
        const token = crypto.randomBytes(20).toString("hex");

        // update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate({email:email},{
            token:token,
            resetPasswordExpries: Date.now() + 3600000, 
        },{new:true});
        console.log("DETAILS", updatedDetails);

        // create url
        const url = `http://localhost:3000/updated-password/${token}`;
        
        // send mail containing the url
        await mailSender(email,
            "Password Reset",
			`Your Link for email verification is ${url}. Please click this url to reset your password.`);
        // return
        res.status(200).json({
            success:true,
            message:"Email sent successfully, please check your mail and reset your password"
        });
    } catch (error) {
        console.log("Error occured while sending the reset link: ",error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while sending the reset password link"
        });
    }
}


// resetPassword
exports.resetPassword = async (req,res) =>{
    try {
        // fetch data from request body
        const {password,confirmPassword,token} = req.body;
        // validation on new passwords
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"newPassword and confirmNewPassword do not matched"
            })
        }

        // get user details from db using token
        const userDetails = await User.findOne({token:token});
        // if no entry-->invalid token
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"Invalid token"
            });
        }
        console.log("User Detials",userDetails);
        

        // token time check
        if((userDetails.resetPasswordExpries < Date.now())){ 
                        return res.status(403).json({
                success:false,
                message:`Token is Expired, Please Regenerate Your Token`
            });
        }
        // password hashed
        const hashedPassword =  await bcrypt.hash(password,10);
        // Password update
        await User.findOneAndUpdate({token:token},
                                {password: hashedPassword},
                                {new:true});

    
        res.status(200).json({
                success:true,
                message:"Successfully able to reset the password"
            });
    } catch (error) {
        console.log("Error occured while reseting the password : ",error);
        return res.status(500).json({
            success:false,
            message:"Somethinng went wrong while reseting the password, please try again later"
        });
        
    }
};