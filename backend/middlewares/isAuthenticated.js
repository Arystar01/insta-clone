import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Please login first",
        success: false,
      });
    }

    //  verifing the token
    const decoded= await jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
        return res.status(401).json({
            message: "Invalid token",
            success: false,
          });
    }
    req.user = await User.findById(decoded.id);
    next(); // tells now u can implement the next function
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in isAuthenticated middleware" });
  }
};

export default isAuthenticated;