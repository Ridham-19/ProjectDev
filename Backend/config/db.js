import mongoose from "mongoose";

export const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "ProjectDev",
    })
    .then(()=> {
        console.log("Database Connected");
    })
    .catch((err) => {
        console.log("Database Connection Failed",err);
    });
    }