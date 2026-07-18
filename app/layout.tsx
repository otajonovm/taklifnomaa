import type {Metadata, Viewport} from 'next';
import { Old_Standard_TT } from 'next/font/google';
import './globals.css';

const oldStandardTT = Old_Standard_TT({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  variable: '--font-old-standard-tt',
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nikoh Taklifnomasi | Hamidullo & Muborakxon',
  description: 'Sizni Hamidullo va Muborakxonning nikoh to\'yi munosabati bilan yozilgan tantanaga taklif etamiz.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#fbfbf9',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="uz"
      className={`${oldStandardTT.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className={`${oldStandardTT.className} old-standard-tt-regular antialiased bg-[#fbfbf9] text-stone-800 min-h-dvh h-full overflow-hidden`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
