'use client';

import { useState, useEffect } from 'react';
import {
  EyeIcon,
  EyeClosed,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

const ResetPasswordPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams?.get('email') || '';
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(600);
  const [canResend, setCanResend] = useState(false);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [codeValid, setCodeValid] = useState<
    'valid' | 'invalid' | 'checking' | null
  >(null);

  // 🔁 Load existing expiry time from localStorage
  useEffect(() => {
    const storedExpiry = localStorage.getItem(`reset_expiry_${email}`);
    if (storedExpiry) {
      const expiry = parseInt(storedExpiry);
      setExpiresAt(expiry);
      const remaining = Math.floor((expiry - Date.now()) / 1000);
      if (remaining > 0) {
        setTimeLeft(remaining);
        setCanResend(false);
      } else {
        setTimeLeft(0);
        setCanResend(true);
      }
    }
  }, [email]);

  // ⏳ Count down the timer
  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => {
      const secondsRemaining = Math.floor((expiresAt - Date.now()) / 1000);
      if (secondsRemaining <= 0) {
        setTimeLeft(0);
        setCanResend(true);
        clearInterval(interval);
      } else {
        setTimeLeft(secondsRemaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  // Format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ✅ Handle Reset Code Verification
  const handleCodeInput = async (input: string) => {
    setCode(input);
    setCodeValid(null);

    if (input.length !== 6) return;

    setCodeValid('checking');
    try {
      const res = await axios.post('http://localhost:8000/auth/verify-reset', {
        email,
        code: input,
      });

      const expiresAtTimestamp = new Date(res.data.expires_at).getTime();
      setExpiresAt(expiresAtTimestamp);
      localStorage.setItem(
        `reset_expiry_${email}`,
        expiresAtTimestamp.toString()
      );

      const secondsRemaining = Math.floor(
        (expiresAtTimestamp - Date.now()) / 1000
      );
      setTimeLeft(secondsRemaining);
      setCanResend(secondsRemaining <= 0);
      setCodeValid(res.status === 200 ? 'valid' : 'invalid');
    } catch (err) {
      console.error(err);
      setCodeValid('invalid');
      setCanResend(true);
    }
  };

  // 🔁 Handle Resend Code
  const handleResendCode = async () => {
    try {
      const res = await axios.post('http://localhost:8000/auth/request-reset', {
        email,
      });
      if (res.status === 200) {
        toast.success('🔁 Code resent to your email');
        const newExpiry = Date.now() + 10 * 60 * 1000;
        setExpiresAt(newExpiry);
        localStorage.setItem(`reset_expiry_${email}`, newExpiry.toString());
        setTimeLeft(600);
        setCanResend(false);
        setCode('');
        setCodeValid(null);
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error(err);
      toast.error('❌ Failed to resend code');
    }
  };

  // 🔐 Submit new password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !code || !newPassword || !confirmPassword) {
      return toast.error('All fields are required');
    }
    if (codeValid !== 'valid') {
      return toast.error('Invalid reset code');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    if (newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const res = await axios.post(
        'http://localhost:8000/auth/reset-password',
        {
          email,
          code,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }
      );

      if (res.status === 200) {
        toast.success('✅ Password reset successful');
        localStorage.removeItem(`reset_expiry_${email}`);
        router.push('/auth/login');
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
            ?.detail || '❌ Something went wrong'
        );
      } else {
        toast.error('❌ Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-main-wrapper flex flex-col items-center justify-center h-full pt-[25px] pb-14">
      <div className="custom-container max-w-[480px] mx-auto">
        <div className="auth-content-area p-12">
          <h2 className="auth-title mb-8 font-roboto font-bold leading-[120%] text-[28px] text-mono-01 text-center">
            Reset password
          </h2>

          <div className="auth-middle-area">
            <form
              onSubmit={handleSubmit}
              action=""
              className="auth-form flex flex-col gap-0"
            >
              {/* Code Input */}
              <div className="form-group relative mb-1">
                <label
                  htmlFor="code"
                  className="form-label mb-1 text-[16px] text-left text-mono-60 font-roboto font-normal leading-[150%] block"
                >
                  6-digit Reset Code
                  <span className="required relative top-[-5px] text-error">
                    *
                  </span>
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={e => handleCodeInput(e.target.value)}
                  maxLength={6}
                  className="form-input pr-10 pl-3 py-3 bg-transparent text-mono-0 w-full h-12 border border-mono-60 placeholder:text-mono-60 placeholder:text-[16px] placeholder:font-normal placeholder:font-roboto focus:outline-mono-0 focus:border-mono-0 focus:ring-1 focus:ring-mono-0"
                  placeholder="6-digit Reset Code"
                  required
                />

                {/* === Status icon === */}
                <div className="absolute right-3 bottom-[14px] text-mono-100">
                  {codeValid === 'checking' && (
                    <Loader2 className="animate-spin" size={20} />
                  )}
                  {codeValid === 'valid' && (
                    <CheckCircle2 className="text-green-500" size={20} />
                  )}
                  {codeValid === 'invalid' && (
                    <XCircle className="text-red-500" size={20} />
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-mono-60">
                  Code expires in:{' '}
                  <span className="font-bold">{formatTime(timeLeft)}</span>
                </p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={!canResend}
                  className={`text-xs underline ${
                    canResend
                      ? 'text-sky-400 cursor-pointer'
                      : 'text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Resend code
                </button>
              </div>

              {/* Password */}
              <div className="form-group relative mb-4">
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
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="form-input pl-3 pr-4 py-3 bg-transparent text-mono-0 w-full h-12 border border-mono-60 placeholder:text-mono-60 placeholder:text-[16px] placeholder:font-normal placeholder:font-roboto focus:outline-mono-0 focus:border-mono-0 focus:ring-1 focus:ring-mono-0"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  className="absolute password-indicator variant-white bottom-[14px] cursor-pointer right-4 z-50 !text-mono-0 hover:!text-mono-100"
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

              {/* Confirm Password */}
              <div className="form-group relative">
                <label
                  htmlFor="confirm-password"
                  className="form-label mb-1 text-[16px] text-left text-mono-60 font-roboto font-normal leading-[150%] block"
                >
                  Confirm password{' '}
                  <span className="required relative top-[-5px] text-error">
                    *
                  </span>
                </label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="form-input pl-3 pr-4 py-3 bg-transparent text-mono-0 w-full h-12 border border-mono-60 placeholder:text-mono-60 placeholder:text-[16px] placeholder:font-normal placeholder:font-roboto focus:outline-mono-0 focus:border-mono-0 focus:ring-1 focus:ring-mono-0"
                  placeholder="Confirm password"
                  required
                />
                <button
                  type="button"
                  className="absolute password-indicator variant-white bottom-[14px] cursor-pointer right-4 z-50 !text-mono-0 hover:!text-mono-100"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeIcon size={20} />
                  ) : (
                    <EyeClosed size={20} />
                  )}
                </button>
              </div>

              <div className="divider my-4" />

              {/* Buttons */}
              <div className="form-btn-area w-full">
                <button
                  type="submit"
                  className="primary-btn w-full cursor-pointer px-6 py-3 bg-mono-0 text-mono-100 border border-mono-100 font-roboto text-[16px] mb-4"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
