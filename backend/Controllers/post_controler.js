import Post from "../models/post_model.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import User from "../models/user_models.js";
import Comment from "../models/comment_model.js";

//  add new post

export const addNewPost = async (req, res) => {
    try {
        const { caption, image, author } = req.body;
        if (!caption || !image || !author) {
            return res.status(400).json({ message: "All fields are required" });
        }
        //  image upload , using sharp package for handling large soze images
        const optimizedImagebuffer = await sharp(req.file.buffer)
            .resize({
                widtth: 800,
                height: 800,
                fit: "inside",
            })
            .toFormat("jpeg", { quality: 80 })
            .toBuffer();
        const fileUri = `data:image/jpeg;base64,${optimizedImagebuffer.toString(
            "base64"
        )}`;

        console.log(fileUri);

        const cloudResponse = await cloudinary.uploader.upload(fileUri);
        //  create a new post
        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: author,
        });

        const User = await User.findById(author);
        if (!User) {
            return res.status(400).json({ message: "User not found" });
        }
        User.posts.push(post._id);
        await User.save();
        // using populate to get the author details, complete for frontend

        await post.populate({ path: "author", select: "-password" });
        return res
            .status(200)
            .json({ message: "Post created successfully", succes: true, post });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in createPost controller" });
    }
};

export const getAllPost = async (req, res) => {
    try {
        // this is the page where we scroll down and get the posts
        const post = await Post.find().sort({ createdAt: -1 }).populate({ path: "author", select: "username,profilePicture" }).populate({
            path: 'comment', options: { sort: { createdAt: -1 } }, populate: {
                path: 'author',
                select: 'username profilePicture'
            }
        });


        res.status(200).json({ success: true, post });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in getAllPost controller" });
    }
}
//  at profile page we will get the user post
export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const post = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({ path: "author", select: "username profilePicture" }).populate({
            path: 'comment', options: { sort: { createdAt: -1 } }, populate: {
                path: 'author',
                select: 'username profilePicture'
            }
        });
        return res.status(200).json({ success: true, post });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in getUserPost controller" });
    }
}

export const likePost = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        //  like logic 
        await post.updateOne({ $addToSet: { likedBy: userId } });
        await post.save();

        //  implementing socket.io for real time update of likeing the image


        return res.status(200).json({ message: "Post liked successfully" });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in likePost controller" });
    }
}

// setting for disliked
export const dislikePost = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        //  like logic 
        await post.updateOne({ $pull: { likedBy: userId } });
        await post.save();


        return res.status(200).json({ message: "Post disliked successfully" });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in dislikePost controller" });
    }
}

// delete post
export const deletePost = async (req, res) => {
    try {

        const postId = req.params.id;
        const userId = req.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(403).json({ message: "Post not found", succes: false });

        }
        if (post.author.toString() != userId) {
            return res.status(403).json({ message: "You are not authorized to delete this post", succes: false });
        }
        //  deleting the post from the posttable 
        await Post.findByIdAndDelete(postId);
        // deleteing the comments on that post from the comment table
        await Comment.deleteMany({ post: postId });


        // deleting the post from the user profile
        const user = await User.findById(userId);
        user.posts.pull(postId);
        await user.save();

        return res.status(200).json({ message: "Post deleted successfully", succes: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in deletePost controller" });

    }
}

export const addComment = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const { text } = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (!text) {
            return res.status(400).json({ message: "Comment text is required" });
        }
        const comment = await Comment.crete({
            text,
            author: userId,
            post: postId
        });
        post.comments.push(comment._id);
        await post.save();
        await comment.populate({ path: "author", select: "username, profilePicture" });
        return res.status(200).json({ message: "Comment added successfully", comment, succes: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in addComment controller" });
    }
}

//  getting all comments for a post
export const getAllComments = async (req, res) => {
    try {

        const postId = req.params.id;
        // const post = await Post.findById(postId).populate({path:"comments", populate:{path:"author", select:"username, profilePicture"}});

        const comment = await Comment.find({ post: postId }).populate({ path: "author", select: "username, profilePicture" });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        return res.status(200).json({ message: "Comment added successfully", comment, succes: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in getAllComments controller" });
    }
}

export const bookmark = async (req,res)=>{
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const user = await User.findById(userId);
        
        if(user.bookmarks.include(postId)){
            user.bookmarks.pull(postId);
            await user.save();
            return res.status(200).json({ message: "Post unbookmarked successfully" });
        }
        else{
            user.bookmarks.push(postId);
            await user.save();
            return res.status(200).json({ message: "Post bookmarked successfully" });

        }
      
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in bookmark controller" });
    }
}