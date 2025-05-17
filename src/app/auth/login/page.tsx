'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { GoogleIcon } from '@/icons';
import { useSearchParams, useRouter } from 'next/navigation';
import { EyeIcon, EyeClosed } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// toast.success('Login successful!');
// toast.error('Something went wrong');
const LogeInPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect') || '/';
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      toast.success('✅ Login successful!');
      router.push(redirectTo);
    } else {
      toast.error('❌ Invalid credentials');
    }
  };
  const handleGoogleLogin = async () => {
    try {
      await signIn('google', { callbackUrl: redirectTo }); // ✅ Will redirect automatically
      // toast will be shown after redirect, if needed show one before:
      toast.loading('🔄 Redirecting to Google...');
    } catch (error) {
      // Handle error here
      console.error('Error during Google login:', error);
      toast.error('❌ Google login failed');
    }
  };
  return (
    <div className="auth-page-main-wrapper flex flex-col items-center justify-center h-full pt-[25px] pb-14">
      <div className="custom-container max-w-[480px] mx-auto">
        <div className="auth-content-area p-12">
          <h2 className="auth-title mb-8 font-roboto font-bold leading-[120%] text-[48px] text-mono-01 text-center">
            Log In
          </h2>
          <div className="auth-middle-area">
            <div className="auth-form-wrapper">
              <form
                onSubmit={handleSubmit}
                className="auth-form flex flex-col gap-0"
              >
                <div className="form-group mb-4">
                  <label
                    htmlFor="email"
                    className="form-label mb-1 text-[16px] text-left text-mono-60 font-roboto font-normal leading-[150%] block"
                  >
                    Email{' '}
                    <span className="required relative top-[-5px] text-error">
                      *
                    </span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-input  pl-3 pr-4 py-3 bg-transparent text-mono-0 w-full h-12 border border-mono-60 placeholder:text-neutral-light placeholder:text-[16px] placeholder:font-normal placeholder:font-roboto focus:outline-none focus:border-mono-0 focus:ring-1 focus:ring-mono-0"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="form-group relative">
                  <label
                    htmlFor="password"
                    className="form-label mb-1 text-[16px] text-left text-mono-60 font-roboto font-normal leading-[150%] block"
                  >
                    Password{' '}
                    <span className="required relative top-[-5px] text-error">
                      *
                    </span>
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="form-input pl-3 pr-4 py-3 bg-transparent text-mono-0  w-full h-12 border border-mono-60 placeholder:text-neutral-light placeholder:text-[16px] placeholder:font-normal placeholder:font-roboto focus:outline-mono-0 focus:border-mono-0 focus:ring-1 focus:ring-mono-0"
                    placeholder="Password"
                    required
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
                <div className="divider my-4"></div>
                <button
                  type="submit"
                  className="primary-btn cursor-pointer px-6 py-3 bg-mono-0 rounded-none border border-mono-0 font-roboto font-normal leading-[150%] text-[16px] text-mono-100 mb-4"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="secondary-btn cursor-pointer px-6 flex justify-center items-center gap-3 py-3 bg-transparent rounded-none border border-mono-0 font-roboto font-normal leading-[150%] text-[16px] text-mono-0"
                >
                  <GoogleIcon /> Log In with Google
                </button>
              </form>
            </div>
            <div className="auth-footer text-center  mt-6">
              <Link
                href={`/auth/forgot-password/request-reset-password?redirect=${encodeURIComponent(
                  redirectTo
                )}`}
                className="font-roboto underline font-normal text-[#EAEAEA] text-[16px] leading-[150%]"
              >
                Forgot your password?
              </Link>
              <p className="mt-3 font-roboto font-normal text-mono-0 text-[16px] leading-[150%]">
                {/* solved here issue */}
                Don&#39;t have an account?{' '}
                <Link
                  className="font-roboto underline font-normal text-mono-0 text-[16px] leading-[150%]"
                  href={`/auth/signup?redirect=${encodeURIComponent(
                    redirectTo
                  )}`}
                >
                  Sign Up
                </Link>{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogeInPage;
