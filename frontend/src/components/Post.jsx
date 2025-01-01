// Import necessary dependencies
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useState, useEffect } from "react"; // Added useEffect
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; 
import { MessageCircle, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { FaBookmark, FaHeart, FaRegComment, FaShare } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import CommentDialog from "./CommentDialog.jsx";
import  setPosts  from "@/redux/PostSlice";
import { use } from "react";



const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector(state => state.auth);
    const { posts } = useSelector(state => state.post);
    const [liked, setLiked] = useState(post.likedBy.includes(user?._id));
    const [postLike, setPostLike] = useState(0); // Updated initial state to 0
    const dispatch = useDispatch();
    const {comments}= useSelector(state => state.post);
    const [commentT,setCommentT] = useState(post.comments);











    useEffect(() => {
        if (Array.isArray(post.likes)) {
            setLiked(post.likes.includes(user?._id));
            setPostLike(post.likes.length); // Initialize the number of likes
        }
    }, [post.likes, user]); // Dependencies ensure it updates when `post.likes` or `user` changes

    // Handle like or dislike action
    const likedOrDislikedHandler = async (postId) => {
        try {
            // Determine action based on `liked` state
            const action = liked ? 'dislike' : 'like';
    
            // Make API request
            const res = await axios.put(
                `http://localhost:8000/api/posts/${action}/${postId}`, 
                {}, 
                { withCredentials: true }
            );
    
            if (res.data.success) {
                // Success feedback
                toast.success(res.data.message);
    
                const updatedPost = res.data.post; // Updated post from response
    
                // Update local state
                setPostLike(updatedPost.likedBy.length); // Update the like count
                setLiked(updatedPost.likedBy.includes(user?._id)); // Update the liked state
                dispatch(setPosts(updatedPost));

    
                // Optionally update global state if needed
                // dispatch(setPosts((prevPosts) =>
                //     prevPosts.map((p) => 
                //         p._id === updatedPost._id ? updatedPost : p
                //     )
                // ));
            }
        } catch (error) {
            // Error feedback
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    // Handle delete post
    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`http://localhost:8000/api/posts/deletePost/${post._id}`, { withCredentials: true });

            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id); 
                toast.success(res.data.message);
                dispatch(setPosts(updatedPostData));
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error in deletepost handler, ignoring it");
        }
    };

    // Handle text change in comment input
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    };











    // Handle comment submission
    const commentHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/api/posts/comment/${post._id}`, 
                { text },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                const updatedPost = [...comments, res.data.message];
                setCommentT(updatedPost);
                const updatedPostData = posts.map((postItem) =>
                    postItem._id === post._id ? { ...postItem, comments: updatedPost } : postItem);
                toast.success(res.data.message);
                setText("");
                dispatch(setPosts(updatedPostData));
            } else {
                toast.error("it is a error in comment handler, ignoring it");
            }
            // Optionally, you can update the post state here if needed
        } catch (error) {
            console.error(error);
            toast.error("Error in comment handler, ignoring it");
        }
    };










    return (
        <div className="flex flex-col gap-1 p-3 border-b-2 border-b-gray-500 max-w-screen-sm mx-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                {/* Avatar and Username */}
                <div className="flex items-center gap-2">
                    <Avatar className="w-10 h-10 rounded-full">
                        <AvatarImage className="rounded-full" src="https://github.com/shadcn.png" alt="post_image" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className="font-semibold">{post.author.username}</h1>
                </div>

                {/* Options Menu */}
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent className="w-[90vw] sm:max-w-[425px] flex flex-col items-center text-sm text-center">
                        <div className="p-4">
                            <Button variant='ghost' className=" cursor-pointer text-red-500 font-bold">Unfollow</Button>
                        </div>
                        <div className="p-4">
                            <Button variant='ghost' className="  cursor-pointer text-red-500 font-bold">Add to Favourites</Button>
                        </div>
                        {user._id === post.author._id && (
                            <div className="p-4">
                                <Button onClick={deletePostHandler} variant='ghost' className=" cursor-pointer text-red-500 font-bold">Delete Post</Button>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            {/* Post Content */}
            <div>
                <img src={post.image} alt="Post_img" className=" w-full aspect-square object-contain  rounded-md " />
            </div>

            {/* Post Actions */}
            <div className="flex items-center justify-between">
                <div className=" flex ">
                    <FaHeart  className={`mr-3 text-xl ${liked ? 'text-red-500' : ''}`} onClick={() => likedOrDislikedHandler(post._id)} />
                        <MessageCircle className="mr-3 text-xl cursor-pointer" onClick={() => {
                            dispatch(setSelectedPost(posts),
                        );
                       
                        }} />
                    <FaRegComment onClick={() => setOpen(true)} className="mr-3 text-xl cursor-pointer" />
                    <FaShare className="mr-3 text-xl" />
                </div>
                <div>
                    <FaBookmark className="mr-3 text-xl" />
                </div>
            </div>

            {/* Likes and Caption */}
            <span className="font-medium block mb-2">Liked by {postLike} people</span> {/* Updated text to make it more user-friendly */}
            <p>
                <span className="font-medium mr-2">{post.author.username}</span>
                {post.caption}
            </p>
            <span onClick={() => setOpen(true)} className="cursor-pointer text-sm text-gray-200">View all {commentT.length} comments</span>
            <CommentDialog open={open} setOpen={setOpen} />

            {/* Comment Section */}
            <div className="flex items-center justify-between">
                <input
                    type="text"
                    placeholder="add a comment..."
                    className="border-none outline-none text-sm w-full"
                    value={text}
                    onChange={changeEventHandler}
                />
                {text && <button className="text-[#3897f0] font-semibold cursor-pointer" onClick={commentHandler} >Post</button>}
            </div>
        </div>
    );
};

export default Post;
