'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  AngleDownIcon,
  AngleUpIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@/icons';

// 🖼️ Instrument to Image Mapping
// const instrumentImageUrls: Record<string, string> = {
//   Piano:
//     'https://upload.wikimedia.org/wikipedia/commons/5/55/Grand_piano_Concert.png',
//   'Acoustic Guitar':
//     'https://upload.wikimedia.org/wikipedia/commons/4/45/GuitareClassique5.png',
//   'Electric Guitar':
//     'https://upload.wikimedia.org/wikipedia/commons/3/31/Fender_Stratocaster.png',
//   Violin:
//     'https://upload.wikimedia.org/wikipedia/commons/a/aa/Violin_VL100.png',
//   Cello: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Cello_front.png',
//   Trumpet: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Trumpet_1.png',
//   Flute: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Flute.png',
//   Clarinet: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Clarinet.png',
//   Organ:
//     'https://upload.wikimedia.org/wikipedia/commons/8/86/Pipe_organ_-_detail.png',
//   Saxophone:
//     'https://upload.wikimedia.org/wikipedia/commons/e/e0/Alto_Saxophone.png',
//   Voice:
//     'https://upload.wikimedia.org/wikipedia/commons/4/4a/Voice_microphone.png',
// };


const ITEMS_PER_PAGE = 6;

const ResultPage = ({ result }) => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (result) {
      setData(
        Array.isArray(result.instrument?.predictions)
          ? result.instrument?.predictions
          : []
      );
      setItems(result);
    }
  }, [result]);

  if (!data.length) {
    return (
      <>
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
      </>
    );
  }

  const paginatedData = data.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  return (
    <div className="h-full pt-3 instrument-analyze-wrapper">
      <div className="custom-container">
        <div className="analyze-content-area">
          <div className="analyze-instrument-area border border-mono-0">
            {/* Header + Actions */}
            <div className="flex flex-col md:flex-row justify-between items-end p-6 gap-3">
              <div>
                <h2 className="font-roboto font-bold text-left text-[24px] leading-[150%] text-mono-0 mb-1">
                  {items?.file_name ||
                    'Instrument Detection Result'}
                </h2>
                <p className="mb-0 text-[16px] leading-[150%] text-mono-0 font-roboto font-normal">
                  Below are the detected instruments and their confidence
                  scores. Click to expand details.
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  className="cursor-pointer font-robot font-normal text-mono-100 text-center leading-[150%] flex justify-center items-center bg-mono-0 py-2 px-5 transition rounded-[6px] border border-mono-0"
                  onClick={() => router.push('/')}
                >
                  Upload New File
                </button>
                {/* <button
                className="text-sm bg-white text-black rounded px-4 py-2 font-medium hover:bg-gray-200 transition"
                onClick={downloadJSON}
              >
                📥 Download JSON
              </button>
              <button
                className="text-sm bg-white text-black rounded px-4 py-2 font-medium hover:bg-gray-200 transition"
                onClick={copyLink}
              >
                {copied ? '✅ Link Copied' : '🔗 Share Link'}
              </button> */}
              </div>
            </div>

            {/* Instrument Details */}
            <div className="instrument-detection-details">
              <div className="instrument-details-header bg-mono-70  border border-mono-0 px-6 py-4 grid md:grid-cols-12 grid-cols-6 gap-5 items-center ">
                <p className="name md:col-span-3 col-span-full text-mono-0 text-left text-[16px] font-semibold font-roboto md:leading-[150%] leading-[130%] ">
                  Name
                </p>
                <p className="confidence md:col-span-9 col-span-full text-mono-0 text-left text-[16px] font-semibold font-roboto md:leading-[150%] leading-[130%] ">
                  Confidence Score
                </p>
              </div>
              {paginatedData.map((instrument, idx) => {
                // const instrument = item.instrument;
                const isOpen = idx === expandedIndex;
                return (
                  <>
                    <div className="instrument-detection-item" key={idx}>
                      <button
                        onClick={() => setExpandedIndex(isOpen ? -1 : idx)}
                        className={`w-full px-5 py-7 grid md:grid-cols-12 grid-cols-6 gap-5 items-center  transition cursor-pointer ${
                          isOpen
                            ? 'border-b border-t fast:border-t-0 last:border-b-0'
                            : 'border-b border-t fast:border-t-0 last:border-b-0'
                        }`}
                      >
                        <span className="md:col-span-3 flex capitalize items-center gap-3 col-span-full text-mono-0 text-left text-[16px] font-medium font-roboto md:leading-[150%] leading-[130%]">
                          <span className="icons-arrow">
                            {isOpen ? <AngleUpIcon /> : <AngleDownIcon />}
                          </span>{' '}
                          {instrument.instrument}
                        </span>
                        <span className="md:col-span-9 col-span-full text-mono-0 text-left text-[16px] font-medium font-roboto md:leading-[150%] leading-[130%]">
                          {(instrument.confidence * 100).toFixed(1)}%
                        </span>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden instrument-item-details-content"
                          >
                            <div className="grid md:grid-cols-12 col-span-6 gap-5">
                              <div className="md:col-span-6 col-span-full grid gap-5 md:grid-cols-2 grid-cols-full">
                                <ul className="instrument-details-left-cont flex flex-col gap-10 md:pl-14 pl-6 pr-6 py-7">
                                  <li>
                                    <p className="font-roboto font-semibold text-[14px] text-mono-0 md:leading-[150%] leading-[130%] mb-1">
                                      <strong>Musical Category:</strong>
                                    </p>{' '}
                                    <p className="font-roboto font-normal text-[16px] text-mono-0 md:leading-[150%] leading-[130%]">
                                      {instrument.category}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="font-roboto font-semibold text-[14px] text-mono-0 md:leading-[150%] leading-[130%] mb-1">
                                      <strong>Instrument Family:</strong>
                                    </p>{' '}
                                    <p className="font-roboto font-normal text-[16px] text-mono-0 md:leading-[150%] leading-[130%]">
                                      {instrument.instrument}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="font-roboto font-semibold text-[14px] text-mono-0 md:leading-[150%] leading-[130%] mb-1">
                                      <strong>Confidence Score:</strong>
                                    </p>{' '}
                                    <p className="font-roboto font-normal text-[16px] text-mono-0 md:leading-[150%] leading-[130%]">
                                      {(instrument.confidence * 100).toFixed(1)}
                                      %
                                    </p>
                                  </li>

                                  {/* <li>
                                    <p className="font-roboto font-semibold text-[14px] text-mono-0 md:leading-[150%] leading-[130%] mb-1">
                                      <strong>Source:</strong>{' '}
                                    </p>
                                    <p className="font-roboto font-normal text-[16px] text-mono-0 md:leading-[150%] leading-[130%]">
                                      {instrument.instrument_source_str}
                                    </p>
                                  </li>
                                  {instrument.qualities_str?.length > 0 && (
                                    <li>
                                      <p className="font-roboto font-semibold text-[14px] text-mono-0 md:leading-[150%] leading-[130%] mb-1">
                                        <strong>Qualities:</strong>{' '}
                                      </p>
                                      <p className="font-roboto font-normal text-[16px] text-mono-0 md:leading-[150%] leading-[130%]">
                                        {' '}
                                        {instrument.qualities_str.join(', ')}
                                      </p>
                                    </li>
                                  )} */}
                                  {/* ✅ Confidence Breakdown */}
                                  {/* <div className="mt-6">
                                    <h4 className="font-semibold text-sm mb-2">
                                      🎚️ Confidence Breakdown
                                    </h4>
                                    <ul className="space-y-1">
                                      {Object.entries(
                                        instrument.confidences.instrument_family
                                      ).map(([label, confidence]) => {
                                        const percent =
                                          (confidence as number) * 100;
                                        return (
                                          <li key={label} className="text-xs">
                                            <div className="flex justify-between mb-1">
                                              <span className="capitalize">
                                                {label}
                                              </span>
                                              <span>{percent.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded h-2 overflow-hidden">
                                              <motion.div
                                                initial={{ width: 0 }}
                                                animate={{
                                                  width: `${percent}%`,
                                                }}
                                                transition={{ duration: 0.4 }}
                                                className="bg-sky-blue h-full"
                                              />
                                            </div>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div> */}
                                </ul>
                                <ul className="instrument-details-right-cont flex flex-col gap-10 px-5 py-7">
                                  <li>
                                    <p className="font-roboto font-semibold text-[14px] text-mono-0 md:leading-[150%] leading-[130%] mb-1">
                                      <strong>Key:</strong>
                                    </p>{' '}
                                    <p className="font-roboto font-normal text-[16px] text-mono-0 md:leading-[150%] leading-[130%]">
                                      {items?.key}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="font-roboto font-semibold text-[14px] text-mono-0 md:leading-[150%] leading-[130%] mb-1">
                                      <strong>BPM:</strong>
                                    </p>{' '}
                                    <p className="font-roboto font-normal text-[16px] text-mono-0 md:leading-[150%] leading-[130%]">
                                      {items?.bpm}
                                    </p>
                                  </li>
                                  <li>
                                    <p className="font-roboto font-semibold text-[14px] text-mono-0 md:leading-[150%] leading-[130%] mb-1">
                                      <strong>Taxonomy:</strong>
                                    </p>{' '}
                                    <p className="font-roboto font-normal text-[16px] text-mono-0 md:leading-[150%] leading-[130%]">
                                      {instrument.taxonomy}
                                    </p>
                                  </li>
                                </ul>
                              </div>
                              <div className="w-full md:col-span-6 col-span-full relative rounded overflow-hidden border border-gray-800">
                                <Image
                                  src="/images/instruments/instrument-image.jpg"
                                  alt={instrument.instrument_str}
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    e.target.src =
                                      '/images/instruments/instrument-image.jpg';
                                  }}
                                />
                                {/* <Image
                              src={
                                instrumentImageUrls[instrument.instrument] ||
                                'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
                              }
                              alt={instrument.instrument}
                              fill
                              className="object-cover"
                            /> */}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8 mb-[63px]">
            <button
              className="bg-transparent font-roboto font-normal text-[16px] md:leading-[150%] leading-[130%] border border-mono-0 text-mono-0 rounded-none px-5 py-2 disabled:opacity-50 cursor-pointer flex items-center gap-3"
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
            >
              <span>
                <ArrowLeftIcon />
              </span>{' '}
              Prev
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`w-10 h-10 rounded-none text-mono-0 text-[16px] text-center flex items-center justify-center cursor-pointer font-roboto font-normal leading-[150%] sm:leading-[130%] ${
                    page === i + 1 ? 'border border-mono-0' : ''
                  }`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              className="bg-transparent font-roboto font-normal text-[16px] leading-[150%] sm:leading-[130%] border border-mono-0 text-mono-0 rounded-none px-5 py-2 disabled:opacity-50 cursor-pointer flex items-center gap-3"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Next{' '}
              <span>
                <ArrowRightIcon />
              </span>
            </button>
          </div>

          {/* Audio Preview */}
          {/* <div className="mt-10 text-center">
            <audio
              controls
              src={audioUrl || ''}
              className="w-full max-w-md mx-auto"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
