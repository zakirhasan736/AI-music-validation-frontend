import type { Metadata } from "next";
import { Mansalva, Roboto, Roboto_Condensed, Manrope } from 'next/font/google';
import "./globals.css";
import '@/styles/styles.css';
import ClientProviders from '@/utils/Provider';

const mansalva = Mansalva({
  variable: '--font-mansalva',
  subsets: ['latin'],
  weight: '400',
});

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
});

const robotoCondensed = Roboto_Condensed({
  variable: '--font-roboto-condensed',
  subsets: ['latin'],
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'WITI',
  description: 'Find any instrument’s name in seconds.',
};
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mansalva.variable} ${roboto.variable} ${robotoCondensed.variable} ${manrope.variable} antialiased`}>
        <div className="witi-main-wrapper"> <ClientProviders>{children}</ClientProviders></div>
      </body>
    </html>
  );
}
