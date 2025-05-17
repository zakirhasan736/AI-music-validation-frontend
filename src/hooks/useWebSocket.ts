'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setResult } from '@/store/analyzeSlice';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function useWebSocketProgress(
  setProgressText?: (t: string) => void
) {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/analyze');

    socket.onopen = () => console.log('🔌 WebSocket connected');

    socket.onmessage = event => {
      const message = event.data;

      if (message.startsWith('__RESULT__::')) {
        try {
          const rawJson = message.replace('__RESULT__::', '');
          const parsed = JSON.parse(rawJson);
          dispatch(setResult(parsed));
          router.push('/overview');
        } catch (err) {
          toast.error('❌ Failed to parse WebSocket result');
          console.error('WebSocket Parse Error:', err);
        }
        return;
      }

      toast(message, { duration: 3000 });
      if (setProgressText) setProgressText(message);
    };

    socket.onclose = () => console.log('❌ WebSocket disconnected');
    socket.onerror = error => console.error('WebSocket error:', error);

    return () => socket.close();
  }, [dispatch, router, setProgressText]);
}
