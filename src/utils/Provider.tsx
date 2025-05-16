'use client';

import React from 'react';
import { Provider } from 'react-redux';
import {store} from '@/store';
import { Toaster } from 'react-hot-toast';

const ClientProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <Provider store={store}>
        <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
        {children}
      </Provider>
    </>
  );
};

export default ClientProviders;
