'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { setResult } from '@/store/analyzeSlice';
import ResultPage from '@/components/overviewpage/Overview';


export default function OverviewByIdPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const dispatch = useDispatch();
  const { status } = useSession();
  const [data, setData] = useState<' ' | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/analyze/overview/${id}`
        );
        const result = res.data;
        console.log(result);
        setData(result);
        dispatch(setResult(result));
       
      } catch {
        toast.error('❌ Could not load analysis result');
        router.push('/');
        
      }
    };

    fetchData();
  }, [id, dispatch, router]);

  useEffect(() => {
    setTimeout(() => {
      if (status === 'unauthenticated' && id) {
        toast.loading('🔒 Please login to continue...');
        router.push(`/auth/login?redirect=/overview/${id}`);
      }
    }, 2000);
  }, [status, id, router]);

  if (!data)
    return (
      <div className="overview-wrapper-area">
        <div className="h-full pt-3 instrument-analyze-wrapper">
          <div className="custom-container">
            <div className="analyze-content-area">
              <div className="analyze-instrument-area border border-mono-0">
                {/* Header + Actions */}
                <div className="flex flex-col md:flex-row justify-between items-end p-6 gap-3">
                  <div>
                    <h2 className="font-roboto font-bold text-left text-[24px] leading-[150%] text-mono-0 mb-1">
                      <span className="skeleton bg-mono-60 w-[300px] h-3 block"></span>
                    </h2>
                    <p className="mb-0 text-[16px] leading-[150%] text-mono-0 font-roboto font-normal">
                      <span className="skeleton bg-mono-60 w-[300px] h-2 block"></span>
                    </p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <span className="skeleton bg-mono-60 w-16 h-3 block"></span>
                  </div>
                </div>

                {/* Instrument Details */}
                <div className="instrument-detection-details">
                  <div className="instrument-details-header bg-mono-70  border border-mono-0 px-6 py-4 grid md:grid-cols-12 grid-cols-6 gap-5 items-center ">
                    <p className="name md:col-span-3 col-span-full text-mono-0 text-left text-[16px] font-semibold font-roboto md:leading-[150%] leading-[130%] ">
                      <span className="skeleton bg-mono-60 w-16 h-3 block"></span>
                    </p>
                    <p className="confidence md:col-span-9 col-span-full text-mono-0 text-left text-[16px] font-semibold font-roboto md:leading-[150%] leading-[130%] ">
                      <span className="skeleton bg-mono-60 w-16 h-3 block"></span>
                    </p>
                  </div>
                  <div className="instrument-detection-item">
                    <button className="w-full px-5 py-7 grid md:grid-cols-12 grid-cols-6 gap-5 items-center  transition cursor-pointer">
                      <p className="md:col-span-3 flex capitalize items-center gap-3 col-span-full text-mono-0 text-left text-[16px] font-medium font-roboto md:leading-[150%] leading-[130%]">
                        <span className="skeleton bg-mono-60 w-16 h-2 block"></span>
                      </p>
                      <p className="md:col-span-9 col-span-full text-mono-0 text-left text-[16px] font-medium font-roboto md:leading-[150%] leading-[130%]">
                        <span className="skeleton bg-mono-60 w-16 h-2 block"></span>
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="overview-wrapper-area">
      <ResultPage  result={data} />
    </div>
  );
}
