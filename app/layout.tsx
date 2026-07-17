import type {Metadata} from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-serif',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Premium Interaktiv Web-Taklifnoma',
  description: 'Maxsus va takrorlanmas lahzalarga bagishlangan premium interaktiv taklifnoma',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="uz" className={`${inter.variable} ${cormorantGaramond.variable}`}>
      <body className="bg-[#0B0F19] text-gray-100 antialiased font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
