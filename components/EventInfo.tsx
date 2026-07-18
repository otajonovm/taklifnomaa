'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, Heart } from 'lucide-react';

interface EventInfoProps {
  groomName?: string;
  brideName?: string;
  dateStr?: string; // e.g., "13.08.2026"
  timeStr?: string; // e.g., "18:00"
  locationName?: string;
  bismillahText?: string;
}

// Wedding target: August 13, 2026 18:00 (Tashkent)
const TARGET_WEDDING_DATE = new Date('2026-08-13T18:00:00+05:00');

export default function EventInfo({
  groomName = "Hamidullo",
  brideName = "Muborakxon",
  dateStr = "13.08.2026",
  timeStr = "18:00",
  locationName = "Yangi yo'l shahri, Sherdor to'yxonasi",
  bismillahText = "Bismillahir Rohmanir Rohiym. Allohning rahmati va fazli bilan sizni hayotimizdagi eng muhim kun — nikoh to'yimizga aziz mehmon sifatida taklif qilamiz."
}: EventInfoProps) {
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +TARGET_WEDDING_DATE - +new Date();
      if (difference <= 0) {
        setTimeLeft(prev => ({ ...prev, isOver: true }));
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isOver: false
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto px-6 py-10 flex flex-col items-center text-center gap-10">
      
      {/* Bismillah Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="space-y-4"
      >
        <span className="text-xs uppercase tracking-[0.25em] text-primary-gold font-sans font-semibold">
          Nikoh Kechasi
        </span>
        <div className="gold-ornament" />
        <p className="text-sm md:text-base text-stone-600 font-sans italic leading-relaxed px-4">
          &ldquo;{bismillahText}&rdquo;
        </p>
      </motion.div>

      {/* Couples Names Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative py-6 flex flex-col items-center justify-center w-full"
      >
        {/* Decorative background framing */}
        <div className="absolute inset-0 border border-primary-gold/20 rounded-2xl pointer-events-none scale-95" />
        
        <h2 className="text-3xl md:text-4xl font-serif text-stone-800 font-medium tracking-wide">
          {groomName}
        </h2>
        
        <div className="my-3 text-primary-gold flex items-center gap-4">
          <span className="h-[1px] w-8 bg-primary-gold/30"></span>
          <Heart className="w-6 h-6 fill-primary-gold/10 animate-pulse" />
          <span className="h-[1px] w-8 bg-primary-gold/30"></span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-serif text-stone-800 font-medium tracking-wide">
          {brideName}
        </h2>
      </motion.div>

      {/* Date & Time Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, delay: 0.1 }}
        className="w-full grid grid-cols-2 gap-4"
      >
        <div className="flex flex-col items-center p-4 bg-stone-50 border border-primary-gold/15 rounded-xl shadow-xs">
          <Calendar className="w-5 h-5 text-olive-green mb-2" />
          <span className="text-xs text-stone-400 font-sans tracking-widest uppercase">Sana</span>
          <span className="text-lg font-serif font-semibold text-stone-800 mt-1">{dateStr}</span>
          <span className="text-2xs text-stone-500 font-sans mt-0.5">Payshanba</span>
        </div>

        <div className="flex flex-col items-center p-4 bg-stone-50 border border-primary-gold/15 rounded-xl shadow-xs">
          <Clock className="w-5 h-5 text-olive-green mb-2" />
          <span className="text-xs text-stone-400 font-sans tracking-widest uppercase">Vaqt</span>
          <span className="text-lg font-serif font-semibold text-stone-800 mt-1">{timeStr}</span>
          <span className="text-2xs text-stone-500 font-sans mt-0.5">Kechki bazm</span>
        </div>
      </motion.div>

      {/* High-fidelity August 2026 Calendar UI component */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full bg-stone-50/50 p-5 rounded-2xl border border-primary-gold/10"
      >
        <h4 className="text-xs text-stone-500 font-sans tracking-widest uppercase mb-4 text-center font-medium">
          Avgust 2026
        </h4>
        <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-sans text-stone-600">
          {/* Days headers */}
          {['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'].map(day => (
            <span key={day} className="font-semibold text-stone-400 text-2xs uppercase tracking-wider">{day}</span>
          ))}
          {/* August 2026 starts on Saturday (5 empty slots before it) */}
          {Array.from({ length: 5 }).map((_, idx) => (
            <span key={`empty-${idx}`} />
          ))}
          {/* 31 days in August */}
          {Array.from({ length: 31 }).map((_, idx) => {
            const day = idx + 1;
            const isTarget = day === 13;
            return (
              <div key={`day-${day}`} className="relative flex items-center justify-center h-8 w-8 mx-auto">
                {isTarget ? (
                  <motion.div 
                    layoutId="selectedDay"
                    className="absolute inset-0 bg-primary-gold rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-primary-gold/30"
                    animate={{ scale: [0.95, 1.05, 1] }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                  >
                    13
                  </motion.div>
                ) : (
                  <span className={`text-stone-700 ${day === 2 || day === 9 || day === 16 || day === 23 || day === 30 ? 'text-red-400 font-medium' : ''}`}>
                    {day}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Countdown Timer */}
      {!timeLeft.isOver && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full bg-gradient-to-br from-olive-green to-olive-green-dark p-6 rounded-2xl text-white shadow-lg shadow-olive-green/10"
        >
          <span className="text-[10px] tracking-[0.25em] uppercase font-sans font-semibold text-gold-100 block mb-4">
            Kutilyotgan Kunlar Tantanasi
          </span>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Kun', value: timeLeft.days },
              { label: 'Soat', value: timeLeft.hours },
              { label: 'Daqiqa', value: timeLeft.minutes },
              { label: 'Soniya', value: timeLeft.seconds }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-serif font-bold text-gold-100">
                  {String(item.value).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider font-sans text-stone-300 mt-1">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Venue Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1 }}
        className="space-y-2"
      >
        <div className="flex items-center justify-center gap-1.5 text-olive-green">
          <MapPin className="w-4 h-4" />
          <span className="text-xs uppercase tracking-widest font-sans font-semibold">Tantanali Manzil</span>
        </div>
        <p className="text-lg font-serif font-medium text-stone-800">
          {locationName}
        </p>
      </motion.div>

    </div>
  );
}
