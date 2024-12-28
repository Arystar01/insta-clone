import { Dialog, DialogContent, DialogHeader } from '../components/ui/dialog.jsx';
import React, { useState } from 'react';
import { Avatar, AvatarImage } from './ui/avatar.jsx';
import { readFileASDataURL } from '../lib/utils.js';
import { Textarea } from './ui/textarea.jsx';
import { Button } from './ui/button.jsx';
import { useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef(); // Used for image upload
  const [file, setFile] = useState(""); // Stores the selected file
  const [caption, setCaption] = useState(''); // Stores caption input
  const [imagePreview, setImagePreview] = useState(""); // Stores image preview URL
  const [loading, setLoading] = useState(false); // Handles loading state

  const createPostHandler = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!caption.trim()) {
      return toast.error("Caption is required");
    }
    if (!imagePreview) {
      return toast.error("Please select an image to post");
    }

    const formData = new FormData();
    formData.append('caption', caption);
    if (imagePreview) formData.append('image', file); // Only append image if it's available

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3000/api/posts/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Ensures cookies are sent
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setOpen(false); // Close the modal on success
        setFile(null); // Reset file state
        setImagePreview(null); // Reset image preview
        setCaption(''); // Reset caption
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong while creating the post');
    } finally {
      setLoading(false); // End loading state
    }
  };

  const fileChangeHandler = async (e) => {
    const getfile = e.target.files?.[0];
    if (getfile) {
      setFile(getfile);
      const dataUrl = await readFileASDataURL(getfile);
      setImagePreview(dataUrl); // Set image preview after selecting file
    } else {
      setFile(null); // If no file is selected, reset the file
    }
  };

  return (
    <div>
      <Dialog open={open}>
        <DialogContent onInteractOutside={() => setOpen(false)}>
          <DialogHeader className={"text-center font-semibold"}>Create new Post</DialogHeader>
          <div className='flex flex-col gap-3 items-center'>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt='img_box' />
            </Avatar>
            <div>
              <h1 className='font-semibold text-xs'>Username</h1>
              <span className='text-gray-600 text-xs'>Bio here...</span>
            </div>
            <div>
              {/* Textarea for Caption */}
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className='focus-visible:ring-transparent border-none'
                placeholder='What is happening?'
              />
              {/* Display image preview */}
              {imagePreview && <img src={imagePreview} className='w-full h-96 object-cover' />}
              {/* Hidden file input */}
              <input ref={imageRef} type="file" className='hidden' onChange={fileChangeHandler} />
              {/* Button to trigger file selection */}
              <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#0095f6] hover:bg-[#258bcf] flex mt-2'>
                Select from device
              </Button>
            </div>
          </div>

          {/* Button handling post creation */}
          {imagePreview && loading ? (
            <Button disabled>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button onClick={createPostHandler} type='submit' className='w-full bg-[#0095f6] hover:bg-[#258bcf] flex mt-2'>
              <span className='text-white'>Post</span>
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreatePost;
