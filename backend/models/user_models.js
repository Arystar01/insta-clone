import mongoose, { model } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    bio: {
        type: String, default: ""
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        default: "none"
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    post: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ], bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
},
    { timestamps: true }
);

const  User = mongoose.model("User", userSchema);
export default User;
