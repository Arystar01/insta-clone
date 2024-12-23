import pkg from 'cloudinary';
const { v2: cloudinary } = pkg; // Correct version reference (v2 is typically used)
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

export default cloudinary;
