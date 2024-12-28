import Post from "../models/post_model.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import User from "../models/user_models.js";
import Comment from "../models/comment_model.js";
export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const author = req.user._id; // Getting author from req.user
        const image = req.file;

        // Validate inputs
        if (!caption || !image || !author) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Image optimization using sharp
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({
                width: 800,  // Resize to a max of 800x800
                height: 800,
                fit: "inside", // Fit image within the dimensions
            })
            .toFormat("jpeg", { quality: 80 }) // Convert to jpeg with 80% quality
            .toBuffer();

        // Upload the image to Cloudinary directly from the buffer
        const cloudResponse = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'image', format: 'jpeg', quality: 'auto' },
                (error, result) => {
                    if (error) {
                        return reject(error);  // Reject the promise if upload fails
                    }
                    resolve(result);  // Resolve with the Cloudinary result
                }
            );
            stream.end(optimizedImageBuffer);  // Send the buffer to Cloudinary
        });

        // Find the user and update their 'Post' field directly
        const user = await User.findById(author);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Ensure that the user only has one post and replace it with the new one
        user.Post = {  // Replace the current Post with the new one
            caption: caption,
            image: cloudResponse.secure_url, // Use Cloudinary URL for the image
            createdAt: new Date(), // Add created date if needed
        };

        // Save the updated user document with the new Post
        await user.save();

        return res.status(200).json({
            message: "Post created successfully",
            success: true,
            post: {
                caption: caption,
                image: cloudResponse.secure_url,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error in addNewPost controller" });
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
        
        if (user.bookmarks.includes(postId)) {
            user.bookmarks.pull(postId);
            await user.save();
            return res.status(200).json({ message: "Post unbookmarked successfully" });
        } else {
            user.bookmarks.push(postId);
            await user.save();
            return res.status(200).json({ message: "Post bookmarked successfully" });
        }
        
      
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in bookmark controller" });
    }
}