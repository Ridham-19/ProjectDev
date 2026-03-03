import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.js";
import * as userServices from "../services/userServices.js" 

export const createStudent = asyncHandler(async (req,res,next) => {
    const {name, email, password, department} = req.body;
    if(!name || !email || !password ||!department) {
        return next(new ErrorHandler("Please provide all required fields",400))
    }

    const user = await userServices.createUser({
        name,
        email,
        password,
        department,
        role: "Student"
    });
    res.status(201).json({
        success: true,
        message: "Student created successfully",
        data: {user},
    })
});

export const updateStudent = asyncHandler(async (req,res,next) => {
    const {id} = req.params;
    const updateData = {...req.body};
    
    delete updateData.role; // Prevent role updates

    const user = await userServices.updateUser(id, updateData);

    if(!user) {
        return next(new ErrorHandler("Student not found",404))
    }

    res.status(200).json({
        success: true,
        message: "Student updated successfully",
        data: {user},
    })
});