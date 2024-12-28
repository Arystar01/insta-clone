import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Signup = () => {
  const [input, setInput] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false); // Corrected spelling
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const res = await axios.post(
        'http://localhost:3000/api/users/register',
        input,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message); // Use variable instead of string
        setInput({
          username: '',
          email: '',
          password: '',
        });
        navigate('/login'); // Removed trailing space
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred during signup.';
      toast.error(errorMessage); // Display meaningful error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <form
        onSubmit={signupHandler}
        className="shadow-lg border-2 flex flex-col gap-5 p-8 border-black-2px bg-pink-300"
      >
        <div>
          <h1 className="flex justify-center items-center font-bold text-center">
            logo
          </h1>
          <p>Signup to see photos and videos</p>
        </div>
        <div>
          <label htmlFor="username" className="font-medium block">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-1 bg-slate-100"
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="email" className="font-medium block">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-1 bg-slate-100"
          />
        </div>
        <div>
          <label htmlFor="password" className="font-medium block">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="focus-visible:ring-transparent my-1 bg-slate-100"
          />
        </div>
        <div className="flex justify-center items-center">
          {loading ? (
            <button
              type="submit"
              className="bg-black text-white w-full h-cover p-1 rounded-md"
              disabled
            >
              <Loader2 className="animate-spin" />
              Please wait
            </button>
          ) : (
            <button
              type="submit"
              className="bg-black text-white w-full h-cover p-1 rounded-md"
            >
              Sign up
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Signup;
