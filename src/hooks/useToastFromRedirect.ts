'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setToast } from '@/store/toastSlice';

const useToastFromRedirect = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const toastMsg = searchParams.get('toast');
    const toastType = searchParams.get('type') || 'success';

    if (toastMsg) {
      dispatch(
        setToast({
          message: decodeURIComponent(toastMsg),
          type: toastType as 'success' | 'error',
        })
      );

      // Clean the URL after displaying the toast
      const params = new URLSearchParams(searchParams.toString());
      params.delete('toast');
      params.delete('type');

      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, dispatch, router]);
};

export default useToastFromRedirect;
