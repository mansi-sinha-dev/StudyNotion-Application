const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth
exports.auth = (req,res,next)=>{
    try {
        
        console.log("cookie-- ",req.cookies.token);
        console.log("body-- ",req.body.token);
        console.log("header-- ",req.header("Authorization"));
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ","");
        if(!token){
            return res.status(401).json({
            success:false,
            message:"Token missing"
            });
        }
        // verify the token
        try {
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            console.log("verifying the token",decode);
            req.existUser = decode;
            
        } catch (error) {
            console.log("Error occuredd while validating the token :", error);
            return res.status(401).json({
                success:false,
                message:"Token is invalid"
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"something went wrong, while verifying the token"
        });
    }
}

// isStudent
exports.isStudent = (req,res,next) =>{
    try {
        if(req.existUser.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for students"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"user accountType cannot be verified"
        });
    }
}

// isInstructor
exports.isInstructor = (req,res,next) =>{
    try {
        if(req.existUser.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for instructor"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"user accountType cannot be verified"
        });
    }
}


// isAdmin
exports.isAdmin = (req,res,next) =>{
    try {
        if(req.existUser.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for admin"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"user accountType cannot be verified"
        });
    }
}