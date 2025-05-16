'use client';

// import Header from '@/components/common/header/header';
// import Footer from '@/components/common/footer/footer';
import AuthProvider from '@utils/AuthProvider';


export default function Template({ children }: { children: React.ReactNode }) {

  return (
    <AuthProvider>
      {/* <Header /> */}
      <main>{children}</main>
      {/* <Footer /> */}
    </AuthProvider>
  );
}
