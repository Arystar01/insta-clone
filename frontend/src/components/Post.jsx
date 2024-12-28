import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { Dialog, DialogContent, DialogTrigger, } from "@/components/ui/dialog"; // Ensure this path is correct
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import img from "../assets/cat.jpg";
import CommentDialog from "./CommentDialog.jsx";
import { useState } from "react";
import { FaBookmark, FaHeart, FaRegComment, FaShare } from "react-icons/fa";

const Post = () => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);





    const changeEventhandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    };


    return (

        <div className="flex flex-col gap-1 p-3 border-b-2 border-b-gray-500 max-w-screen-sm mx-auto">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                {/* Avatar and Username */}
                <div className="flex items-center gap-2">
                    <Avatar className="w-10 h-10 rounded-full">
                        <AvatarImage
                            src="https://via.placeholder.com/150"
                            alt="post_image"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1 className="font-semibold">Username</h1>
                </div>

                {/* Options Menu */}
                <Dialog className=''>
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
                        <div className="p-4">
                            <Button variant='ghost' className="text-red-500 font-bold cursor-pointer ">Cancel</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>


            {/* Post Content */}
            <div>
                {/* main image */}
                <img src={img} alt="Post_img" srcset="" className=" w-full aspect-square object-contain  rounded-md " />
            </div>
            {/* Post Caption */}


            <div className="flex items-center justify-between">
                <div className=" flex ">
                    <FaHeart className="mr-3 text-xl" />
                    <FaRegComment onClick={() => setOpen(true)} className="mr-3 text-xl cursor-pointer" />
                    <FaShare className="mr-3 text-xl" />
                </div>
                <div>
                    <FaBookmark className="mr-3 text-xl" />
                </div>
            </div>

            {/* Likes and Caption */}
            <span className="font-medium block mb-2">200 Likes by your friends</span>
            <p>
                <span className="font-medium mr-2">Username</span>
                caption
            </p>
            <span onClick={() => setOpen(true)} className="cursor-pointer text-sm text-gray-200">View all 10 comments</span>
            <CommentDialog open={open} setOpen={setOpen} />

            {/* Comment Section writing comment */}
            <div className="flex items-center justify-between">
                <input type="text" placeholder="add a comment..." className="border-none outline-none text-sm w-full"
                    value={text} onChange={changeEventhandler}
                />
                {/* logic for posting comment */}
                {text && <button className="text-[#3897f0] font-semibold cursor-pointer" onClick={() => setText("")}>Post</button>}

            </div>

        </div>
    );
};

export default Post;
