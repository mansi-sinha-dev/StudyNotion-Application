const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type: Date,
        default : Date.now,
        expries:60 * 5,// The document will be automatically deleted after 5 minutes of its creation time
    }
});

// function --> to send mails
async function sendVerificationEmail(email,otp){
    // Create a transporter to send emails

	// Define the email options

	// Send the email
    try {
        const mailResponse = await mailSender(email, "Verification Email from StudyNotion", 
        emailTemplate(otp)
        );
        console.log("Email sent successfully:", mailResponse.response);
        
    } catch (error) {
        console.log("error occured while sending email:", error);
        throw error;
        
    }
}
// pre hook
OTPSchema.pre("save", async function (next) {
	console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp);
	}
	next();
});
// OTPSchema.pre("save", async function(next){
//     await sendVerificationEmail(this.email, this.otp);
//     next();
// });

// aternative of prehook
// OTPSchema.pre("save", async function(next){
//     await mailSender(this.email,"Verification Email from StudyNotion", this.otp);
//     next();
// });

// module.exports = mongoose.model("OTP", OTPSchema);


const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;