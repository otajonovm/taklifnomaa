import type {Metadata} from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css'; // Global styles

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

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="uz" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="antialiased bg-stone-50 text-stone-800" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
