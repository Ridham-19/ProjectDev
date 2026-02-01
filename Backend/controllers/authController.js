import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import { getResetPasswordEmailTemplate } from "../utils/emailTemplates.js";
import { generateToken } from "../utils/generateToken.js";

// <--- Register User --->

export const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role} = req.body;
    if(!name || !email || !password || !role){
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    let user = await User.findOne({ email });
    if(user){
        return next(new ErrorHandler("User already exists", 400));
    }

    user =new User({
        name,
        email,
        password,
        role})
    await user.save();
    generateToken(user,201,"Registered Successfully",res);
    
});

// <--- Login User --->

export const login = asyncHandler(async (req, res, next) => {
    const { email, password, role } = req.body;
    if(!email || !password || !role){
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    const user = await User.findOne({ email, role }).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid Email, Password or Role", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email, Password or Role", 401));
    }
    
    generateToken(user,200,"Logged In Successfully",res);
});

// <--- Logout User --->

export const logout = asyncHandler(async (req, res, next) => {
    res
    .status(200)
    .cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    .json({
        success: true,
        message: "Logged Out Successfully",
    })
});


export const getUser = asyncHandler(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });

});


export const forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if(!user){
        return next(new ErrorHandler("User not found with this email", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset/password?token=${resetToken}`;

    const message = getResetPasswordEmailTemplate(resetPasswordUrl);

    try{
        await sendEmail({
            to: user.email,
            subject: "ProjectDev - 🔐 Password Recovery",
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message || "Failed to send reset password email", 500));
    }
});


export const resetPassword = asyncHandler(async (req, res, next) => {});