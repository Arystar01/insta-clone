import bcrypt from "bcrypt";
import User from "../models/user_models.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", succes: false });
    }
    const userExist = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({
          message: "User already exists, please find new email id ....",
          succes: false,
        });
    }
    const hashpassworded = await bcrypt.hash(password, 12);
    await User.create({ username, email, password: hashpassworded });
    res
      .status(401)
      .json({ message: "User created successfully", succes: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in register controller" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", succes: false });
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, userExist.password);
    if (!isPasswordMatch) {
      return req.status(400).json({
        message: "Wrong credentials.",
        succes: false,
      });
    }

    const user = {
      id: userExist._id,
      username: userExist.username,
      email: userExist.email,
      profilePicture: userExist.profilePicture,
      bio: userExist.bio,
      gender: userExist.gender,
      followers: userExist.followers,
      following: userExist.following,
      post: userExist.post,
    };

    // create token
    const token = await jwt.sign(
      { id: userExist._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24,
      })
      .json({
        message: "Login successfully for ${userExist.username}",
        success: true,
        user: user,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in login controller" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    });
    return res.status(200).json({
      message: "Logout successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in logout controller" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
        success: false,
      });
    }
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      gender: user.gender,
      followers: user.followers,
      following: user.following,
      post: user.post,
    };
    return res.status(400).json({
      message: "User data",
      success: true,
      user: userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in getProfile controller" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;

    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
        success: false,
      });
    }
    if (bio) {
      user.bio = bio;
    }
    if (gender) {
      user.gender = gender;
    }
    if (profilePicture) {
      user.profilePicture = cloudResponse.secure_url;
    }
    await user.save();
    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in editProfile controller" });
  }
};

export const suggestUser = async (req, res) => {
  try {
    const suggestedUser = await User.find({ _id: { $ne: req.user._id } })
      .select("-password")
      .limit(5);
    if (!suggestedUser) {
      return res.status(400).json({
        message: "No user found to suggest",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Suggested users",
      success: true,
      users: suggestedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in suggestUser controller" });
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const userId = req.id;
    const followUserId = req.params.id;
    const user = await User.findById(userId);
    const followUser = await User.findById(followUserId);
    //  checking whether user and followUser exist or not
    if (!user || !followUser) {
      return res.status(400).json({
        message: "User does not exist",
        success: false,
      });
    }
    //  checking whether the current follow user is already following or not
    const isfollowing = user.following.includes(followUserId);
    if (isfollowing) {
      user.following.pull(followUserId);
      followUser.followers.pull(userId);
      await user.save();
      await followUser.save();
      return res.status(200).json({
        message: "Unfollowed successfully",
        success: true,
      });
    } else {
      user.following.push(followUserId);
      followUser.followers.push(userId);
      await user.save();
      await followUser.save();
      return res.status(200).json({
        message: "Followed successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in followOrUnfollow controller" });
  }
};

