'use client';

import React from 'react';
import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';

interface LocationButtonProps {
  address?: string;
  className?: string;
}

export default function LocationButton({ 
  address = "Yangi yo'l shahri, Sherdor to'yxonasi",
  className = "" 
}: LocationButtonProps) {
  const handleOpenMap = () => {
    const encodedAddress = encodeURIComponent(address);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <motion.button
        id="location-map-btn"
        onClick={handleOpenMap}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="relative group overflow-hidden px-8 py-3.5 bg-gradient-to-r from-primary-gold via-[#e2c7a0] to-primary-gold text-white font-sans font-semibold text-sm uppercase tracking-widest rounded-full shadow-lg shadow-primary-gold/20 hover:shadow-primary-gold/40 border border-primary-gold-dark/30 transition-all duration-300 cursor-pointer flex items-center gap-2.5"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-gold-dark to-primary-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <span className="relative flex items-center gap-2">
          <MapPin className="w-4 h-4 animate-bounce group-hover:animate-none" />
          Xaritani ochish
        </span>
      </motion.button>
      
      <p className="text-xs text-stone-400 font-sans tracking-wide text-center">
        Tugmani bosib to&apos;yxona manzilini aniqlashingiz mumkin
      </p>
    </div>
  );
}
