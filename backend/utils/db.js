import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        console.log("Mongo URI:", process.env.MONGO_URI); // Log to ensure it's loaded correctly

        if (!process.env.MONGO_URI) {
            throw new Error("Mongo URI not defined");
        }

        // Removed the deprecated options
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, // This is still valid
            useUnifiedTopology: true, // This is still valid
        });

        console.log("Connected to MongoDB 123 ");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); // Exit process if connection fails
    }
};

export default connectDB;
