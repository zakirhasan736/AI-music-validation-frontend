'use client';

import { GoogleIcon } from '@/icons';
import Link from 'next/link';
import React, { useState } from 'react';
import { EyeIcon, EyeClosed } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const SignupPageMain = () => {
  const [subscribed, setSubscribed] = useState(true);
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [agreed, setAgreed] = useState(false);
 const [error, setError] = useState('');
 const router = useRouter();
const searchParams = useSearchParams();
const redirectTo = searchParams?.get('redirect') || '/';
const [showPassword, setShowPassword] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   if (!agreed) return setError('You must accept the Terms of Use.');
   try {
     await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
       email,
       password,
     });
     await signIn('credentials', { redirect: false, email, password });
     router.push(redirectTo);
   } catch (err) {
     setError(`'Signup failed.' ${err}`);
   }
 };
const handleGoogleLogin = async () => {
  try {
    await signIn('google', { callbackUrl: redirectTo }); // ✅ Will redirect automatically
    // toast will be shown after redirect, if needed show one before:
    toast.loading('🔄 Redirecting to Google...');
  } catch (err) {
    toast.error(`'Google login failed.' ${err}`);
  }
};
  return (
    <div className="auth-page-main-wrapper flex flex-col items-center justify-center h-full pt-[25px] pb-14">
      <div className="custom-container max-w-[480px] mx-auto">
        <div className="auth-content-area p-12">
          <h2 className="auth-title mb-8 font-roboto font-bold leading-[120%] text-[48px] text-mono-01 text-center">
            Sign Up
          </h2>

          <div className="auth-middle-area">
            <form
              onSubmit={handleSubmit}
              className="auth-form flex flex-col gap-0"
            >
              {/* Email */}
              <div className="form-group mb-4">
                <label
                  htmlFor="email"
                  className="form-label mb-1 text-[16px] text-mono-0 font-roboto block"
                >
                  Email <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="Email"
                  className="form-input  pl-3 pr-4 py-3 bg-transparent text-mono-0 w-full h-12 border border-mono-60 placeholder:text-neutral-light focus:outline-none focus:border-mono-0 focus:ring-1 focus:ring-mono-0"
                />
              </div>

              {/* Password */}
              <div className="form-group mb-4 relative">
                <label
                  htmlFor="password"
                  className="form-label mb-1 text-[16px] text-mono-0 font-roboto block"
                >
                  Password <span className="text-error">*</span>
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="form-input  pl-3 pr-4 py-3 bg-transparent text-mono-0 w-full h-12 border border-mono-60 placeholder:text-neutral-light focus:outline-none focus:outline-mono-0 focus:border-mono-0 focus:ring-1 focus:ring-mono-0"
                />
                <button
                  type="button"
                  className="absolute password-indicator variant-white bottom-[14px] cursor-pointer right-4 z-50 !text-mono-100 hover:!text-mono-100"
                  onClick={() => setShowPassword(prev => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeIcon size={20} />
                  ) : (
                    <EyeClosed size={20} />
                  )}
                </button>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col gap-2 text-sm text-mono-0 font-roboto">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    className="accent-white"
                  />
                  I accept the{' '}
                  <Link href="/terms" className="underline">
                    Terms of Use
                  </Link>
                </label>

                {/* {showError && !agreed && (
                  <p className="text-red-500 text-xs pl-6 -mt-1">
                    You must accept the Terms of Use.
                  </p>
                )} */}

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subscribed}
                    onChange={e => setSubscribed(e.target.checked)}
                    className="accent-white"
                  />
                  Count me in for updates and exclusive content
                </label>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="divider my-4" />

              {/* Buttons */}
              <div className="form-btn-area w-full">
                <button
                  type="submit"
                  className="primary-btn w-full cursor-pointer px-6 py-3 bg-mono-0 border border-mono-0 font-roboto text-[16px] text-mono-100 mb-4"
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="secondary-btn w-full px-6 py-3 flex items-center justify-center gap-3 border border-mono-0 text-mono-0 cursor-pointer"
                >
                  <GoogleIcon /> Sign Up with Google
                </button>
              </div>
            </form>

            <div className="auth-footer text-center mt-6">
              <p className="font-roboto text-mono-0 text-[16px]">
                Already have an account?{' '}
                <Link
                  href={`/auth/login?redirect=${encodeURIComponent(
                    redirectTo
                  )}`}
                  className="underline"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPageMain;
