import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY

const {COURSE_PAYMENT_API, 
    COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints;

// Load the Razorpay SDK from the CDN
function loadScript(src){
    return new Promise((resolve) =>{
        const script = document.createElement("script");
        script.src = src;
        script.onload =() =>{
            resolve(true);
        }
        script.onerror =() =>{
            resolve(false);
        }
        document.body.appendChild(script);
    })
}
// Buy the Course
export async function buyCourse(
    token, 
    courses,
    user_details,
    navigate,
     dispatch){
    const toastId = toast.loading("Loading...");
    try {
        // load the script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        // console.log("res", res);

        if(!res){
            toast.error( "Razorpay SDK failed to load. Check your Internet Connection.")
            return
        }

        // initiate the order in backend
        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API,
        {courses},
        {
            Authorization:`Bearer ${token}`,
        })

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message);
        }
        console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse.data);
        
        // Opening the Razorpay SDK
        const options = {
            key:RAZORPAY_KEY,           
            currency: orderResponse.data.message.currency,
            amount:`${orderResponse.data.message.amount}`,
            order_id:orderResponse.data.message.id,
            name: "Study Notion",
            description:"Thank you for purchasing the course",
            image:rzpLogo,
            prefill: {
                name:`${user_details.firstName}`,
                email:user_details.email
            },
            handler: function(response) {
                //send successful wala mail
                sendPaymentSuccessEmail(response, orderResponse.data.message.amount,token );
                //verifyPayment
                verifyPayment({...response, courses}, token, navigate, dispatch);
            }
        }
        
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        console.log(paymentObject);
        paymentObject.on("payment.failed", function(response) {
            // console.log("ERROR");
            toast.error("Oops!, Payment failed");
            console.log(response.error);
        })
    } catch (error) {
        console.log("PAYMENT API ERROR.....", error);
        toast.error("Could not make Payment");
    }
    toast.dismiss(toastId);
    
}


//verify payment
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try{
        const response  = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization:`Bearer ${token}`,
        })
        console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)

        if(!response.data.success) {
            throw new Error(response.data.message);
        }
        toast.success("payment Successful. You are addded to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    }   
    catch(error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}

// send the payment success email
async function sendPaymentSuccessEmail(response, amount, token) {
    try{
        
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount,
        },{
            Authorization: `Bearer ${token}`
        })
    }
    catch(error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}

