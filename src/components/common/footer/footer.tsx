'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import FeatureRequestModal from '@/components/FeatureRequestModal'; // Adjust path as needed
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [showModal, setShowModal] = useState(false);
const { data: session } = useSession();
  return (
    <>
      <div className="footer-section pb-2">
        <div className="custom-container">
          <div className="footer-wrapper flex items-center justify-between py-3">
            <div className="footer-left-cont">
              <p className="copyright-content text-[16px] font-roboto-condensed font-normal leading-[150%] text-mono-60">
                ⓒ 2025. WITI
              </p>
            </div>
            <div className="nav-wrapper">
              <ul className="nav-list flex items-center gap-5">
                <li className="nav-item">
                  <button
                    onClick={() => {
                      if (!session) return toast.error('Please log in first');
                      setShowModal(true);
                    }}
                    className="text-[16px] font-roboto-condensed font-normal leading-[150%] hover:text-sky-blue text-mono-60 transition cursor-pointer"
                  >
                    Request A Feature
                  </button>
                </li>
                <li className="nav-item">
                  <Link
                    href="#"
                    className="text-[16px] font-roboto-condensed text-mono-60 hover:text-sky-blue transition"
                  >
                    Terms of Use
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    href="#"
                    className="text-[16px] font-roboto-condensed text-mono-60 hover:text-sky-blue transition"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {session?.user && (
        <FeatureRequestModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default Footer;
