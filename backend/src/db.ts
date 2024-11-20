import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL as string)
        console.log("Successfully connected to the database");
    } catch (error) {
        console.error("Error while connecting to MongoDB instance:", error);
    }
}
