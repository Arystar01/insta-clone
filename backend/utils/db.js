import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    // console.log("Mongo URI:", process.env.MONGO_URI); 

    if (!process.env.MONGO_URI) {
      throw new Error("Mongo URI not defined");
    }

    await mongoose.connect(process.env.MONGO_URI); 

    console.log("Connected to MongoDB 123 ");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); 
  }
};

export default connectDB;