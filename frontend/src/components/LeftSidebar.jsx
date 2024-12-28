import React from 'react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  TrendingUp as Trending,
  MessageSquare as MessageCircle,
  Heart,
  PlusSquare,
  LogOut as Logout,

} from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';

import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar.jsx"

import { setAuthUser } from '@/redux/AuthSlice.js';
import CreatePost from './CreatePost.jsx';

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);


  const logoutHandler = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/users/logout', { withCredentials: true });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        navigate('/login');
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  };


  const sidebarHandler = (textType) => {
    if (textType === 'Logout') {
      logoutHandler();
    } else if (textType === 'Create') {
      setOpen(true);
     
    }
  };

  const sidebarItems = [
    { icon: <Home />, text: 'Home' },
    { icon: <Search />, text: 'Search' },
    { icon: <Trending />, text: 'Trending' },
    { icon: <MessageCircle />, text: 'Messages' },
    { icon: <Heart />, text: 'Notifications' },
    { icon: <PlusSquare />, text: 'Create' },
    {
      icon: (
        <Avatar>
          <AvatarImage src={user ? user.profilePicture : ''} alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: 'Avatar',
    },
    { icon: <Logout />, text: 'Logout' },
  ];

  return (
    <div className="fixed top-0 left-0 z-10 w-[16%] h-screen px-4 border-r border-gray-300">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-4">LOGO</h1>
        <div>
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              onClick={() => sidebarHandler(item.text)}
              className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3"           >
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};
export default LeftSidebar;
