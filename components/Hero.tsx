'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

const WeddingRings3D = dynamic(() => import('./WeddingRings3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-9 h-9 rounded-full border-2 border-primary-gold/30 border-t-primary-gold animate-spin" />
    </div>
  ),
});

interface HeroProps {
  groomName?: string;
  brideName?: string;
  weddingDate?: string;
  onNext?: () => void;
}

export default function Hero({
  groomName = 'Hamidullo',
  brideName = 'Muborakxon',
  weddingDate = '13.08.2026',
  onNext,
}: HeroProps) {
  return (
    <div
      className="relative h-full w-full flex flex-col justify-between items-center text-center px-5 overflow-hidden bg-radial from-stone-50 via-stone-50 to-[#f2eee7]
        pt-[max(3.75rem,calc(env(safe-area-inset-top)+2.75rem))]
        pb-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.75rem))]"
    >
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-primary-gold/30 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-primary-gold/30 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-primary-gold/30 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-primary-gold/30 rounded-br-lg pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative z-20 w-full max-w-sm px-1 flex flex-col items-center shrink-0"
      >
        <p className="old-standard-tt-regular text-[11px] sm:text-xs uppercase tracking-[0.14em] text-stone-700 leading-relaxed text-center">
          &ldquo;ALLOH ULARNING QALBINI SEVGI ILA BIRLASHTIRDI...&rdquo;
        </p>
        <p className="old-standard-tt-regular-italic self-end mt-2 mr-1 text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-stone-500">
          ANFOL SURASI 63-OYAT
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex-1 min-h-0 my-2 flex flex-col items-center justify-center w-full max-w-[300px] sm:max-w-[340px]"
      >
        <div className="relative w-full h-[min(42vh,280px)] sm:h-[300px] max-h-full">
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.32)_0%,transparent_70%)] blur-2xl pointer-events-none -z-10" />
          <WeddingRings3D />
        </div>
      </motion.div>

      <div className="relative z-20 flex flex-col items-center gap-3 sm:gap-4 pb-1 shrink-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="space-y-0.5"
        >
          <h1 className="text-3xl md:text-4xl font-serif text-stone-800 tracking-wider font-light">
            {groomName}
          </h1>
          <p className="text-lg font-serif font-semibold italic text-primary-gold my-0.5">{'&'}</p>
          <h1 className="text-3xl md:text-4xl font-serif text-stone-800 tracking-wider font-light">
            {brideName}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="flex items-center gap-3 text-stone-400 text-xs font-sans uppercase tracking-[0.2em]"
        >
          <span className="h-[1px] w-6 bg-stone-300" />
          <span>{weddingDate}</span>
          <span className="h-[1px] w-6 bg-stone-300" />
        </motion.div>

        {onNext && (
          <motion.button
            type="button"
            onClick={onNext}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group relative mt-1 inline-flex items-center gap-2.5 pl-6 pr-4 py-3 rounded-full cursor-pointer overflow-hidden
              bg-gradient-to-r from-[#b8860b] via-[#c9a227] to-[#d4af37]
              text-white shadow-[0_10px_28px_rgba(184,134,11,0.35)]
              border border-white/25
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-gold/60"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            <span className="relative text-[11px] font-sans font-semibold uppercase tracking-[0.18em]">
              Pastga suring
            </span>
            <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/20 border border-white/30 group-hover:bg-white/30 transition-colors">
              <ChevronRight className="w-4 h-4 rotate-90 group-hover:translate-y-0.5 transition-transform" />
            </span>
          </motion.button>
        )}
      </div>
    </div>
  );
}
