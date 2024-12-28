import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar.jsx';

const Mainlayout = () => {
  return (
    <div>
      
      <LeftSidebar/>
      <Outlet />
    </div>
  );
};

export default Mainlayout;
