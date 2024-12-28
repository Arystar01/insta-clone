
import axios from 'axios';
import { Loader, Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '@/redux/AuthSlice';

const Login = () => {
  const [input, setInput] = useState({

    email: '',
    password: ''
  });

  const [laoding, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const changeEventhandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }
  const LoginHandler = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      const res = await axios.post('http://localhost:3000/api/users/login', input, {
        headers: {
          'Content-Type': 'application/json'

        }, withCredentials: true
      });
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate('/');
        toast.success('res.data.message');
        setInput({

          email: '',
          password: ''
        })
      }
    } catch (error) {
      console.log(error)
      toast.error(error, "error in toast in Login ")
    } finally {
      setLoading(false)
    }
  }


  return (

    <div className='flex justify-center items-center w-screen h-screen ' >

      <form onSubmit={LoginHandler} className=' shadow-lg border-2  flex flex-col gap-5 p-8 border-black-2px  bg-pink-300'>
        <div className=''>
          <h1 className='flex justify-center items-center font-bold  text-center '>logo</h1>
          <p>Login to see photos and videos</p>
        </div>

        <div>
          <label htmlFor="email" className='  font-medium  block'>Email</label>
          <input type="email" name='email' value={input.email} onChange={changeEventhandler} className=' focus-visible:ring-transparent my-1 bg-slate-100' />
        </div>
        <div>
          <label htmlFor="password" className='  font-medium block'>Password</label>
          <input type="password" name='password' value={input.password} onChange={changeEventhandler} className=' focus-visible:ring-transparent my-1 bg-slate-100' />
        </div>

        <div className=' justify-center items-center text-center'>
          {
            laoding ? <button type='submit' className='bg-black text-white w-full  h-cover p-1 rounded-md'>
              <Loader2 className='animate-spin' />
              please wait

            </button> :
              <button type='submit' className='bg-black text-white w-full  h-cover p-1 rounded-md'>Login</button>
          }
          <span className='text-center '>Doesnt have an account ?
            <a href="/signup" className='text-blue-500'>Signup</a>
          </span>

        </div>


      </form>
    </div>
  )
}

export default Login;
