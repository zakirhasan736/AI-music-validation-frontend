'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

const RequestResetPasswordPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return toast.error('Please enter your email');
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/request-reset`, {
        email,
      });

      if (res.status === 200) {
        toast.success('Reset code sent to your email');
        router.push(
          `/auth/forgot-password/reset-password?email=${encodeURIComponent(
            email
          )}`
        );
      } else {
        toast.error('Failed to request password reset');
      }
    } catch (err: unknown) {
      console.error(err);
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { detail?: string } } })
          .response === 'object'
      ) {
        toast.error(
          (err as { response?: { data?: { detail?: string } } }).response?.data
            ?.detail || 'Request failed'
        );
      } else {
        toast.error('Request failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-main-wrapper flex flex-col items-center justify-center h-full pt-[25px] pb-14">
      <div className="custom-container max-w-[480px] mx-auto">
        <div className="auth-content-area px-6 py-10 sm:p-12">
          <h2 className="auth-title mb-8 font-roboto font-bold leading-[120%] text-[28px] sm:text-[38px] text-mono-01 text-center">
            Forgot password
          </h2>
 
          <div className="auth-middle-area">
            <form
              onSubmit={handleRequestReset}
              className="auth-form flex flex-col gap-0"
            >
              {/* Email */}
              <div className="form-group">
                <label
                  htmlFor="email"
                  className="form-label mb-1 text-[14px] sm:text-[16px] text-mono-60 font-roboto block"
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
                  className="form-input  pl-3 pr-4 py-3 bg-transparent text-mono-0 w-full h-12 border border-mono-60 placeholder:text-mono-60 focus:outline-mono-0 focus:border-mono-0"
                />
              </div>

              {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
              <div className="divider my-4" />

              {/* Buttons */}
              <div className="form-btn-area w-full">
                <button
                  type="submit"
                  disabled={loading}
                  className="primary-btn w-full cursor-pointer px-6 py-3 bg-mono-0 text-mono-100 border border-mono-100 font-roboto text-[14px] sm:text-[16px] mb-4"
                >
                  {loading ? 'Sending...' : 'Request Reset Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestResetPasswordPage;
