import React from 'react'
import { Dialog, DialogContent } from './ui/dialog'
import img from '../assets/cat.jpg'
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from './ui/button'
import { Link } from 'react-router-dom';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { MoreHorizontal } from 'lucide-react';
import Comment from './Comment.jsx';



const CommentDialog = ({ open, setOpen }) => {
 
    const [text, setText] = React.useState("");
    const changeEventHandler= (e)=>{
        const inputText= e.target.value;
        if(inputText.trim()){
            setText(inputText);
        }else{
            setText("");

        }
    }

    const sendMessageHandler = async ()=>{
        alert(text);
        setText("");
        setOpen(false);
    }

    return (
        <div>

            <Dialog open={open} className=''>
                < DialogContent onInteractOutside={() => setOpen(false)} className=' max-w-3xl p-0 flex flex-col ' >
                    <div className=' flex flex-1    '>
                        <div className='w-1/2 '>
                            <img src={img} alt="post_img" className='w-full h-full ' />

                        </div>
                        <div className='w-1/2 flex flex-col justify-between'>


                            <div className='flex justify-between items-center p-4'>
                                <div className="flex items-center gap-3">
                                    <Link>
                                        <Avatar className="w-10 h-10 rounded-full">
                                            <AvatarImage
                                                src="https://via.placeholder.com/150"
                                                alt="post_image"
                                            />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>

                                    </Link>

                                    <div>
                                        <Link className='font-semibold text-xs'> username</Link>
                                        <span className='text-gray-600 text-sm ml-2'>Bio here ...</span>
                                    </div>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <MoreHorizontal className='cursor-pointer' />

                                    </DialogTrigger>
                                    <DialogContent className="w-[90vw] sm:max-w-[425px] flex flex-col items-center text-sm text-center">
                                        <div className='p-4'>
                                            <Button variant='ghost' className='cursor-pointer text-red-500 font-bold'>Unfollow</Button>
                                        </div>
                                        <div className='p-4'>
                                            <Button variant='ghost' className='cursor-pointer text-red-500 font-bold'>Add to Favourites</Button>
                                        </div>
                                        <div className='p-4'>
                                            <Button variant='ghost' className='cursor-pointer text-red-500 font-bold'>Unfollow</Button>
                                        </div>
                                       
                                    </DialogContent>
                                </Dialog>

                            </div>
                            <hr />
                            <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                                {/*  all comments will be shown here */}
                                {[1,2,3,4].map((item,index) => <Comment key={index}/>)}
                            </div>

                            <div className='flex items-center justify-between p-4'>
                                <input type="text" value={text} placeholder='Add a comment...' className='w-full border-gray-200 border-2 p-2 m-3  rounded text-gray-600'
                                onChange={changeEventHandler} />
                           <Button disabled={!text.trim()}  onClick={sendMessageHandler} variant='outline'  >Send </Button>
                            </div>
                        </div>
                    </div>


                </DialogContent>
            </Dialog >
        </div>
    )
}

export default CommentDialog
