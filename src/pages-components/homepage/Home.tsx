'use client';
import useWebSocketProgress from '@/hooks/useWebSocket';
import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowDownIcon, AudioFileIcons } from '@/icons';
import toast from 'react-hot-toast';
const HomePage = () => {
  const [progressText, setProgressText] = useState(
    '🔍 Analyzing your audio...'
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);
  useWebSocketProgress(setProgressText);
const router = useRouter();

  useEffect(() => {
    if (selectedFile) {
      handleUpload(selectedFile);
    }
  }, [selectedFile]);

const handleUpload = async (file: File) => {
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  const controller = new AbortController();
  controllerRef.current = controller;

  try {
    toast.success('Upload started...');
    setIsUploading(true);
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/analyze/overview`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        signal: controller.signal,
      }
    );

    const id = res.data._id;
    if (!id) throw new Error('No ID returned from backend');
    router.push(`/overview/${id}`);
  } catch (err: unknown) {
    if (axios.isCancel(err)) {
      console.log('Upload cancelled');
      toast.error('Upload cancelled');
    } else {
      console.error('Upload failed:', err);
      setErrorMsg('Upload failed. Please try again.');
      toast.error('Upload failed. Please try again.');
    }
  } finally {
    setIsUploading(false);
    controllerRef.current = null;
  }
};


  const handleFileSelect = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      setErrorMsg('Only audio files are allowed.');
      toast.error('Only audio files are allowed.');
      setFileName('');
      setSelectedFile(null);
      return;
    }

    setErrorMsg('');
    setFileName(file.name);
    setSelectedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => setIsDragActive(false);

  const handleRemoveFile = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    setFileName('');
    setSelectedFile(null);
    setErrorMsg('');
    setIsUploading(false);
  };

  return (
    <div className="homepage-main-wrapper flex flex-col items-center justify-center h-full text-white px-4">
      <h1 className="text-center font-mansalava mb-3 leading-[110%]">
        What is this instrument? <span className="text-sm ml-1">(BETA)</span>
      </h1>

      <p className="text-[28px] sm:text-[40px] text-center font-roboto-condensed font-bold text-mono-60 mb-10">
        Find any instrument’s name in seconds.
      </p>

      {/* === Upload Area === */}
      <div
        className={`w-full max-w-[1116px] border-2 border-dashed rounded-[8px] p-10 pb-[38px] flex flex-col items-center justify-center cursor-pointer transition
        ${
          isDragActive
            ? 'bg-zinc-800 border-sky-500'
            : 'border-gray-500 hover:bg-zinc-900'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="audio-file-icon flex items-center flex-col justify-center mb-6">
          <AudioFileIcons />
        </div>
        <div className="flex items-center gap-0 cursor-pointer bg-mono-0 rounded-[6px] overflow-hidden">
          <span className="text-[#000] text-[16px] border-r bg-mono-0 font-normal leading-[150%] py-3 px-6 font-roboto">
            Upload file
          </span>{' '}
          <span className="arrow-down-icon py-3 px-4 bg-mono-0">
            <ArrowDownIcon />
          </span>
        </div>
        <p className="text-[#8A888C] text-[8px] font-bold font-roboto leading-[130%] h-4 flex justify-center items-center mt-[14px]">
          or drop audio files here
        </p>

        {fileName && (
          <div className="mt-4 text-sm text-green-400 flex items-center gap-4">
            {fileName}
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-red-500 underline hover:text-red-300 transition text-xs"
            >
              Remove
            </button>
          </div>
        )}

        {errorMsg && <p className="mt-4 text-sm text-red-500">{errorMsg}</p>}

        <input
          type="file"
          accept="audio/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {isUploading && (
          <p className="mt-6 text-sm text-sky-400 animate-pulse">
            {progressText}
          </p>
        )}
      </div>

      {/* === CTA Button === */}
      <button
        type="button"
        className="mt-12 py-3 px-6 bg-sky-blue text-white text-sm font-medium rounded-full shadow-lg hover:bg-sky-600 transition cursor-pointer"
      >
        Win a free AKAI Professional MPK Mini MK3!
      </button>
    </div>
  );
};

export default HomePage;
