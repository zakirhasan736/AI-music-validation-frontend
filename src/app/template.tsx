'use client';
import { Suspense } from 'react';
import Header from '@/components/common/header/header';
import Footer from '@/components/common/footer/footer';
import AuthProvider from '@utils/AuthProvider';


export default function Template({ children }: { children: React.ReactNode }) {

  return (
    <AuthProvider>
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      <main>{children}</main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </AuthProvider>
  );
}
