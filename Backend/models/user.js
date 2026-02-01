import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { type } from 'os';
import { timeStamp } from 'console';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxLength: [30, "Name cannot exceed 30 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        maxLength: [30, "Password cannot exceed 30 characters"],
        minLength: [8, "Password should be at least 8 characters"],
        select: false,
    },
    role: {
        type: String,
        default: "Student",
        enum: ["Student", "Teacher", "Admin"],
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    department: {
        type: String,
        trim: true,
        default: null,
    },
    experties: {
        type: [String],
        default: [],
    },
    maxStudents: {
        type: Number,
        default: 10,
        minLength: [1, "Max students must be at least 1"]
    },
    assignedStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null,
    }
} , {
    timestamps: true,
}
);

// <--- encrypting the password before saving the user --->

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// <--- Generating JWT token --->

userSchema.methods.generateToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
}

// <--- Comparing the password --->

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// <--- Generating Password Reset Token --->

userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;  // expire time 15 mins.

    return resetToken;
}

export const User = mongoose.model("User", userSchema);