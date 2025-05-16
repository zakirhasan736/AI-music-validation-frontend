'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession, signOut, signIn } from 'next-auth/react';
import { GoogleIcon } from '@/icons';
import toast from 'react-hot-toast';

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();
const searchParams = useSearchParams();
const redirectTo = searchParams.get('redirect') || '/';
  const handleLoginClick = () => {
    router.push('/auth/login');
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };
   const handleGoogleLogin = async () => {
     try {
       await signIn('google', { callbackUrl: redirectTo }); // ✅ Will redirect automatically
       // toast will be shown after redirect, if needed show one before:
       toast.loading('🔄 Redirecting to Google...');
     } catch (err) {
       toast.error('❌ Google login failed');
     }
   };
  return (
    <div className="header-section pt-[27px] pb-[27px]">
      <div className="custom-container">
        <div className="header-wrapper flex items-center justify-between">
          <div className="logo-wrapper">
            <Link href="/">
              <Image
                src={'/images/vercel.svg'}
                width={86}
                height={44}
                className="logo !w-[86px] !h-[44px]"
                priority={true}
                alt="logo"
              />
            </Link>
          </div>
          <div className="nav-wrapper">
            <ul className="nav-list flex items-center gap-5">
              {session ? (
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    type="button"
                    className="logout-btn credentials-loges-btn flex items-center gap-2 bg-transparent text-mono-60 text-[14px] font-normal font-mono px-6 py-3 rounded-[8px] cursor-pointer"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li className="nav-item">
                    <button
                      onClick={handleGoogleLogin}
                      type="button"
                      className="socials-loges-btn flex items-center gap-2 bg-transparent text-mono-60 text-[14px] font-normal font-mono px-6 py-3 rounded-[48px] cursor-pointer"
                    >
                      <GoogleIcon />{' '}
                      <span className="text-mono-60 text-[14px] font-normal font-mono">
                        Sign in with Google
                      </span>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      onClick={handleLoginClick}
                      type="button"
                      className="credentials-loges-btn flex items-center gap-2 bg-transparent text-mono-60 text-[14px] font-normal font-mono px-6 py-3 rounded-[8px] cursor-pointer"
                    >
                      Sign In
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
