'use client';

import { localURI } from '@/components/source';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

export default function Signup() {
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordMatch, setPasswordMatch] = useState<boolean>(true);

  const handleSignup = async () => {
    try {
      const response = await fetch(`${localURI}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('signup Successfull');
        return router.push(`/dashboard/${data.user.userId}`);
      } else {
        toast.error('Signup Failed!');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        return;
      }
    } catch (error: any) {
      console.log('something went wrong : ', error.message);
    }
  };

  useEffect(() => {
    setPasswordMatch(password === confirmPassword);
  }, [confirmPassword]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-bl from-custom-gradient-start via-custom-gradient-middle to-custom-gradient-end">
      <div className="w-10/12 h-full sm:min-w-full md:min-w-80 md:min-h-screen lg:max-w-80 xl:max-w-80">
        <div className="md:pt-2 xl:pt-3 2xl:pt-16">
          <Toaster />
          <div className="font-sans font-semibold md:mt-2 xl:mt-5 text-4xl">
            Sign Up
          </div>
          <div className="font-sans text-base py-3 font-medium">
            Join us today and start exploring
          </div>
          <div className="font-sans mt-2 text-lg font-semibold mb-1.5">
            Username
          </div>
          <input
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            value={username}
            className="block w-full rounded-lg border-0 py-3.5 pl-4 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Enter Username"
          />

          <div className="font-sans text-lg font-semibold md:mt-2 xl:mt-5 mb-1.5">
            Password
          </div>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={password}
            className="block w-full rounded-lg border-0 py-3.5 pl-4 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Enter Password"
          />

          <div className="font-sans text-lg font-semibold md:mt-2 xl:mt-5 mb-1.5">
            Confirm Password
          </div>
          <input
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            value={confirmPassword}
            className="block w-full rounded-lg border-0 py-3.5 pl-4 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Confirm Password"
          />
          {!passwordMatch && (
            <div className="text-red-600 text-sm mt-1">
              Passwords do not match
            </div>
          )}

          <button
            onClick={handleSignup}
            className="bg-slate-800 text-white font-semibold text-xl pt-3 pb-4 px-4 rounded-lg w-full md:mt-4 xl:mt-8"
          >
            Sign Up
          </button>
          <div className="text-center font-sans text-base text-gray-500 md:mt-11 lg:mt-15 xl:mt-8 mb-7">
            Already have an account ?
            <span
              className="font-sans font-semibold text-base text-blue-500 cursor-pointer underline-offset-2 ml-2"
              onClick={() => router.push('/signin')}
            >
              Sign In
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
