'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import {
  submitStart,
  submitSuccess,
  submitFail,
  resetFeedback,
} from '@/store/feedbackSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import axios from 'axios';
const FeatureRequestModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [request, setRequest] = useState('');
  const [problem, setProblem] = useState('');
  const { data: session } = useSession();
  const dispatch = useDispatch();
    const { loading, success } = useSelector(
      (state: RootState) => state.feedback
    );


  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      dispatch(submitStart());

      try {
        const payload = {
          request,
          problem,
          email: session?.user?.email || '',
          name: session?.user?.name || '',
        };

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/feedback/submit-feedback`,
          payload
        );

        dispatch(submitSuccess());
        toast.success(' Feedback submitted!');
        setTimeout(() => {
          onClose();
          setRequest('');
          setProblem('');
          dispatch(resetFeedback());
        }, 3000);
      } catch (err) {
        dispatch(submitFail('Something went wrong!'));
        toast.error(' Submission failed');
      }
    };


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 request-feature-modal bg-[#000000B2] z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            className="bg-[#0D0E11] request-feature-wrapper w-full max-w-md p-12 text-white relative"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute cursor-pointer top-4 right-4 text-gray-400 hover:text-white transition"
              aria-label="Close"
            >
              Close
            </button>

            <h2 className="text-[24px] text-mono-0 leading-[120%] font-bold font-roboto mb-8 text-center">
              Feature Request
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-4 block font-roboto font-normal text-[16px] md:leading-[150%] leading-[130%] text-neutral-light">
                  What feature are you missing?
                </label>
                <input
                  type="text"
                  value={request}
                  onChange={e => setRequest(e.target.value)}
                  placeholder="Your request"
                  required
                  className="w-full px-3 py-3 border border-neutral-light bg-transparent text-mono-0 h-12  placeholder:text-neutral-light placeholder:text-[16px] placeholder:font-normal placeholder:font-roboto focus:outline-none focus:border-mono-0 focus:ring-1 focus:ring-mono-0 "
                />
              </div>
              <div>
                <label className="mb-4 block font-roboto font-normal text-[16px] md:leading-[150%] leading-[130%] text-neutral-light">
                  What problem would it solve for you?
                </label>
                <textarea
                  placeholder="Your issue"
                  value={problem}
                  onChange={e => setProblem(e.target.value)}
                  required
                  className="w-full px-3 py-3 bg-black border border-neutral-light h-24 resize-none placeholder:text-neutral-light placeholder:text-[16px] placeholder:font-normal placeholder:font-roboto focus:outline-none focus:border-mono-0 focus:ring-1 focus:ring-mono-0"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-2 font-medium hover:bg-gray-200 transition cursor-pointer"
              >
                {loading
                  ? 'Sending...'
                  : success
                  ? '✓ Request sent, thanks!'
                  : 'Help us improve'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeatureRequestModal;
