'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing eye icons
import { signin } from '@/utils/api';
import Loader from '@/components/Loader';

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const router = useRouter();

  const onSubmit = async (data) => {
    const response = await signin(data);
    console.log(response);
    if (response.msg === 'Logged in!') {
      router.push('/');
      toast.success('Signed in successfully!');
    } else {
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-cyan-500 to-blue-500">
      {/* {loading ? (<Loader />) : ( */}
      <>
        <div className="p-6 rounded-lg shadow-xl w-full max-w-sm bg-white">
          <h2 className="text-2xl font-bold mb-6 text-center text-black">
            Sign In
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-large font-bold text-black">
                Email
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                    message: 'Invalid email address',
                  },
                })}
                className="mt-1 p-2 w-full border rounded-md text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-6 relative">
              <label className="block text-sm font-large font-bold text-black">
                Password
              </label>
              <input
                type={passwordVisible ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className="mt-1 p-2 w-full border rounded-md text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" // Adjust padding to accommodate icon
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}

              {/* Eye icon for toggling password visibility */}
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-white"
                onClick={() => setPasswordVisible(!passwordVisible)}
                style={{ top: '65%', transform: 'translateY(-50%)' }}
              >
                {passwordVisible ? (
                  <FaEyeSlash color="#000000" />
                ) : (
                  <FaEye color="#000000" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-500"
            >
              Sign In
            </button>
          </form>
        </div>
        <ToastContainer />
      </>
      {/* )
      } */}
    </div>
  );
}
