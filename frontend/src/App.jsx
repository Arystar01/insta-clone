import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './components/Signup.jsx';
import Login from './components/Login.jsx';
import Home from './components/Home.jsx';
import Mainlayout from './components/Mainlayout.jsx';
import Profile from './components/Profile.jsx';

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <Mainlayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/profile',
        element: <Profile />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  }
]);

const App = () => {
  return <RouterProvider router={browserRouter} />;
};

export default App;
