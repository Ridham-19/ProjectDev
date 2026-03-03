import { User } from "../models/user.js";

export const createUser = async (userData) => {
    try {
        const user = new User(userData);
        return await user.save()
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
}