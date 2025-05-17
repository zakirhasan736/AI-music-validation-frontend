'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const useToastFromRedirect = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const toastMsg = searchParams?.get('toast');
    // const toastType = searchParams?.get('type') || 'success';

    if (toastMsg) {
      // Handle toast display here, e.g., call a toast library directly
      // Example: toast(decodeURIComponent(toastMsg), { type: toastType });

      // Clean the URL after displaying the toast
      const params = new URLSearchParams(searchParams?.toString());
      params.delete('toast');
      params.delete('type');

      router.replace(`?${params.toString()}`);
    }
  }, [searchParams, router]);
};

export default useToastFromRedirect;
