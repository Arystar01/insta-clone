
import React from 'react'

import { Outlet } from 'react-router-dom';
import Feed from './Feed.jsx';
import RightSideBar from './RightSideBar.jsx';
import { useGetAllPost } from '@/hooks/useGetAllPost.js';

const Home = () => {
  useGetAllPost();
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed/>
        <Outlet/>
      </div>
      <RightSideBar/>
     
    </div>
  )
}

export default Home;
