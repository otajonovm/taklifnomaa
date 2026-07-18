import type {Metadata, Viewport} from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800'],
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800'],
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
      className={`${playfair.variable} ${montserrat.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="antialiased bg-[#fbfbf9] text-stone-800 min-h-dvh h-full overflow-hidden"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
