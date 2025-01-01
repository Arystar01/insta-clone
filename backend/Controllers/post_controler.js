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
         // Create the new post object
    const newPost = new Post({
        caption: caption,
        image: cloudResponse.secure_url,
        author: author, 
        createdAt: new Date(),
      });
  
      // Save the new post to the database
      const savedPost = await newPost.save(); 
  
      // Find and update the user (optional: if you need to store the post ID in the user)
      const user = await User.findById(author);
      if (user) {
        user.post.push(savedPost._id); 
        await user.save(); 
      }
  
      return res.status(200).json({
        message: "Post created successfully",
        success: true,
        post: savedPost,
      });

        // Ensure that the user only has one post and replace it with the new one
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error in addNewPost controller" });
    }
};






export const getAllPost = async (req, res) => {
    try {
        // this is the page where we scroll down and get the posts
        const post = await Post.find().sort({ createdAt: -1 }).populate({ path: "author", select: "username profilePicture" }).populate({
            path: 'comments', options: { sort: { createdAt: -1 } }, populate: {
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


// delete post
// Delete Post controller
export const deletePost = async (req, res) => {
    try {
      const postId = req.params.id; // Post ID from URL
      const userId = req.user.id; // User ID from authenticated session (JWT)
      
      // Find the post by ID
      const post = await Post.findById(postId);
  
      // Check if the post exists
      if (!post) {
        return res.status(404).json({ message: "Post not found", success: false });
      }
  
      // Log post and user for debugging
      console.log("Post to be deleted:", post);
      console.log("User trying to delete:", userId);
  
      // Check if the user is the author of the post
      if (post.author.toString() !== userId) {
        console.log("Unauthorized delete attempt by user:", userId);
        return res.status(403).json({ message: "You are not authorized to delete this post", success: false });
      }
  
      // Proceed with deletion
      console.log("Authorized user. Deleting post...");
      
      // Delete the post from the database
      await Post.findByIdAndDelete(postId);
  
      // Delete related comments for the post
      await Comment.deleteMany({ post: postId });
  
      // Remove the post from the user's list of posts
      const user = await User.findById(userId);
      user.post.pull(postId);
      await user.save();
  
      // Log successful deletion
      console.log("Post deleted successfully!");
  
      // Fetch all remaining posts after deletion
      const remainingPosts = await Post.find();
  
      // Send response with success message and updated list of posts
      return res.status(200).json({
        message: "Post deleted successfully",
        success: true,
        posts: remainingPosts, // Return the updated list of posts
      });
      
    } catch (error) {
      console.error("Error during post deletion:", error);
      res.status(500).json({ message: "Error in deletePost controller", success: false });
    }
  };

  
export const addComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;
        const { text } = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (!text) {
            return res.status(400).json({ message: "Comment text is required" });
        }
        const comment = await Comment.create({
            text,
            author: userId,
            post: postId
        });
        post.comments.push(comment._id);
        await post.save();
        await comment.populate({ path: "author", select: "username profilePicture" });
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



export const likePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;
        // console.log("userId:", userId);
        // console.log("postId:", postId);
        // console.log("req.user:", req.user);
        //     console.log("req.user.id:", req.user.id);

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }
        // console.log("post:", post);

        // Add the user to the likedBy array
        if (!post.likedBy.includes(userId)) {
            post.likedBy.push(userId);
            await post.save();
        }

        res.status(200).json({
            success: true,
            message: "Post liked successfully",
            post,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const dislikePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Remove the user from the likedBy array
        post.likedBy = post.likedBy.filter((id) => id.toString() !== userId);
        await post.save();

        res.status(200).json({
            success: true,
            message: "Post disliked successfully",
            post,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
