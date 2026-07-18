'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface HeroProps {
  groomName?: string;
  brideName?: string;
  weddingDate?: string;
}

export default function Hero({
  groomName = "Hamidullo",
  brideName = "Muborakxon",
  weddingDate = "13.08.2026"
}: HeroProps) {
  return (
    <div className="relative h-full flex flex-col justify-between items-center text-center px-6 py-8 overflow-hidden bg-radial from-stone-50 via-stone-50 to-[#f2eee7]">
      
      {/* Decorative Ornaments (Corners) */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-primary-gold/30 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-primary-gold/30 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-primary-gold/30 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-primary-gold/30 rounded-br-lg pointer-events-none" />

      {/* Decorative Top Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="flex flex-col items-center gap-1"
      >
        <Sparkles className="w-4 h-4 text-primary-gold animate-pulse" />
        <span className="text-[10px] font-sans font-semibold tracking-[0.25em] uppercase text-olive-green">
          Nikoh Tantanasi Taklifnomasi
        </span>
      </motion.div>

      {/* Intersecting Gold Rings (SVG animated with glowing filters) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative my-4 flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56"
      >
        {/* Abstract elegant glow backdrops */}
        <div className="absolute w-32 h-32 bg-primary-gold/10 rounded-full blur-2xl" />
        
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="200" y2="200">
              <stop offset="0%" stopColor="#dfba7a" />
              <stop offset="50%" stopColor="#c5a880" />
              <stop offset="100%" stopColor="#96723b" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Left Ring */}
          <motion.circle
            cx="85"
            cy="100"
            r="42"
            stroke="url(#goldGradient)"
            strokeWidth="4"
            filter="url(#glow)"
            initial={{ rotate: -15 }}
            animate={{ rotate: 15 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 6,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: "85px 100px" }}
          />

          {/* Right Ring */}
          <motion.circle
            cx="115"
            cy="100"
            r="42"
            stroke="url(#goldGradient)"
            strokeWidth="4"
            filter="url(#glow)"
            initial={{ rotate: 15 }}
            animate={{ rotate: -15 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 6,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: "115px 100px" }}
          />

          {/* Intersecting glowing points/gems */}
          <circle cx="100" cy="80" r="3" fill="#ffffff" filter="url(#glow)" />
          <circle cx="100" cy="120" r="3" fill="#ffffff" filter="url(#glow)" />
        </svg>

        {/* Overlaying floating flower details / sparkles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ y: [-3, 3, -3], rotate: 360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="text-primary-gold"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary-gold/60" />
          </motion.div>
        </div>
      </motion.div>

      {/* Primary Couple Branding */}
      <div className="flex flex-col items-center gap-3">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="space-y-0.5"
        >
          <h1 className="text-3xl md:text-4xl font-serif text-stone-800 tracking-wider font-light">
            {groomName}
          </h1>
          <p className="text-lg font-serif font-semibold italic text-primary-gold my-0.5">&amp;</p>
          <h1 className="text-3xl md:text-4xl font-serif text-stone-800 tracking-wider font-light">
            {brideName}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="flex items-center gap-3 text-stone-400 text-xs font-sans uppercase tracking-[0.2em] mt-1"
        >
          <span className="h-[1px] w-6 bg-stone-300"></span>
          <span>{weddingDate}</span>
          <span className="h-[1px] w-6 bg-stone-300"></span>
        </motion.div>
      </div>

    </div>
  );
}
