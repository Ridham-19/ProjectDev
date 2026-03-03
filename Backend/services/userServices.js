import { User } from "../models/user.js";

export const createUser = async (userData) => {
    try {
        const user = new User(userData);
        return await user.save()
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
}

export const updateUser = async (id, updateData) => {
    try {
        const user = await User.findByIdAndUpdate(id, updateData, { 
            new: true,
            runValidators: true,
        }).select("-password");   // Exclude password from the returned user
        return user;
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
}