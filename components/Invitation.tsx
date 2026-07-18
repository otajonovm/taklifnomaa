'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  Mail, 
  Users, 
  CheckCircle, 
  Heart, 
  Star, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  MapPin,
} from 'lucide-react';
import Hero from './Hero';
import EventInfo from './EventInfo';
import LocationButton from './LocationButton';

const AUDIO_URL = '/audio/yoningdaman.mp3';

const SLIDES = [
  { id: 0, title: 'Bosh sahifa' },
  { id: 1, title: 'Tantana va Sana' },
  { id: 2, title: 'Xarita va Manzil' },
  { id: 3, title: 'Tashrifni Tasdiqlash' }
];

export default function Invitation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const [guestName, setGuestName] = useState('');
  const [guestsCount, setGuestsCount] = useState('1');
  const [isAttending, setIsAttending] = useState<boolean | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [savedRSVPs, setSavedRSVPs] = useState<{ name: string; count: string; attending: boolean; date: string }[]>([]);

  useEffect(() => {
    const localData = localStorage.getItem('wedding_rsvps');
    if (!localData) return;
    try {
      setSavedRSVPs(JSON.parse(localData));
    } catch (e) {
      console.error('Failed to parse local RSVPs', e);
    }
  }, []);

  useEffect(() => {
    const audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = 'auto';
    audioRef.current = audio;

    const unlockedRef = { current: false };

    const tryPlay = () => {
      if (!audioRef.current || unlockedRef.current) return;
      audioRef.current
        .play()
        .then(() => {
          unlockedRef.current = true;
          setIsPlaying(true);
          window.removeEventListener('pointerdown', unlockOnGesture);
          window.removeEventListener('touchstart', unlockOnGesture);
          window.removeEventListener('keydown', unlockOnGesture);
        })
        .catch(() => {
          // Autoplay blocked until user gesture
        });
    };

    const unlockOnGesture = () => tryPlay();

    tryPlay();
    window.addEventListener('pointerdown', unlockOnGesture, { passive: true });
    window.addEventListener('touchstart', unlockOnGesture, { passive: true });
    window.addEventListener('keydown', unlockOnGesture);

    return () => {
      window.removeEventListener('pointerdown', unlockOnGesture);
      window.removeEventListener('touchstart', unlockOnGesture);
      window.removeEventListener('keydown', unlockOnGesture);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) {
      const audio = new Audio(AUDIO_URL);
      audio.loop = true;
      audio.volume = 0.4;
      audioRef.current = audio;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.log('Audio play blocked by browser policy', err);
      });
    }
  };

  const handleRSVPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || isAttending === null) return;

    const newRSVP = {
      name: guestName.trim(),
      count: guestsCount,
      attending: isAttending,
      date: new Date().toLocaleDateString('uz-UZ')
    };

    const updated = [newRSVP, ...savedRSVPs];
    setSavedRSVPs(updated);
    localStorage.setItem('wedding_rsvps', JSON.stringify(updated));
    setSubmitted(true);

    setTimeout(() => {
      setGuestName('');
      setGuestsCount('1');
      setIsAttending(null);
      setSubmitted(false);
    }, 5000);
  };

  // Slider navigation handlers
  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleGoToSlide = (index: number) => {
    if (index === currentSlide) return;
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  // Swipe gesture detection
  const handleDragEnd = (_event: unknown, info: { offset: { x: number } }) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold) {
      handlePrev();
    }
  };

  // Slider Animation Variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    })
  };

  return (
    <div className="min-h-dvh h-dvh w-full bg-[#fbfbf9] sm:bg-[#111412] flex items-center justify-center p-0 sm:p-4 md:p-8 font-sans antialiased relative overflow-hidden safe-area-fill">
      
      {/* Absolute Ambient Background Glows — faqat desktop frame */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary-gold/5 rounded-full blur-3xl pointer-events-none hidden sm:block" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-olive-green/5 rounded-full blur-3xl pointer-events-none hidden sm:block" />

      {/* Main Container — mobil: butun ekran krem; desktop: framed card */}
      <div className="w-full max-w-md h-full min-h-0 sm:h-[850px] sm:max-h-[min(850px,calc(100dvh-2rem))] sm:rounded-3xl bg-[#fbfbf9] text-stone-800 sm:shadow-2xl overflow-hidden relative flex flex-col border-0 sm:border border-primary-gold/15">
        
        {/* Persistent Luxury Top Navigation Bar */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-100 flex flex-col items-center pt-[max(0.75rem,env(safe-area-inset-top))] pb-3.5 px-4 gap-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary-gold" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold text-stone-500">
              Hamidullo {'&'} Muborakxon
            </span>
          </div>
          
          {/* Tabs Indicator */}
          <div className="flex justify-between w-full max-w-xs mt-1.5 px-2">
            {SLIDES.map((slide) => {
              const isActive = slide.id === currentSlide;
              return (
                <button
                  key={slide.id}
                  onClick={() => handleGoToSlide(slide.id)}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <span className={`text-[9px] uppercase tracking-wider font-semibold font-sans transition-colors duration-300 ${
                    isActive ? 'text-primary-gold' : 'text-stone-400 group-hover:text-stone-600'
                  }`}>
                    {slide.title.split(' ')[0]}
                  </span>
                  <div className={`h-1 rounded-full transition-all duration-300 ${
                    isActive ? 'w-5 bg-primary-gold' : 'w-1.5 bg-stone-200 group-hover:bg-stone-300'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Swipeable Main Slide Frame */}
        <div className="flex-1 relative overflow-hidden bg-[#fbfbf9]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 w-full h-full overflow-y-auto no-scrollbar pb-[calc(4.5rem+env(safe-area-inset-bottom))] touch-pan-y"
            >
              
              {/* Slide 0: Bosh Sahifa (Hero) */}
              {currentSlide === 0 && (
                <Hero 
                  groomName="Hamidullo" 
                  brideName="Muborakxon" 
                  weddingDate="13.08.2026"
                  onNext={handleNext}
                />
              )}

              {/* Slide 1: Tantana va Sana (EventInfo) */}
              {currentSlide === 1 && (
                <div className="py-6">
                  <EventInfo 
                    groomName="Hamidullo"
                    brideName="Muborakxon"
                    dateStr="13.08.2026"
                    timeStr="18:00"
                    locationName="Yangi yo'l shahri, Sherdor to'yxonasi"
                  />
                </div>
              )}

              {/* Slide 2: Xarita va Manzil (Map) */}
              {currentSlide === 2 && (
                <div className="px-6 py-12 flex flex-col items-center justify-center min-h-[80%] gap-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-sm p-6 bg-stone-50 border border-primary-gold/15 rounded-2xl relative overflow-hidden shadow-xs flex flex-col items-center text-center gap-6"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-gold/5 rounded-full blur-xl pointer-events-none" />
                    
                    <div className="w-12 h-12 bg-primary-gold/10 rounded-full flex items-center justify-center text-primary-gold">
                      <MapPin className="w-6 h-6 animate-pulse" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-serif text-stone-800 font-medium">Sherdor To&apos;yxonasi</h3>
                      <p className="text-sm text-stone-600 font-sans mt-2">
                        Manzil: Yangi yo&apos;l shahri
                      </p>
                    </div>

                    <div className="w-full flex justify-center">
                      <div className="gold-ornament" />
                    </div>

                    <p className="text-xs text-stone-500 font-sans leading-relaxed max-w-xs">
                      Sizning qulayligingiz uchun to&apos;y o&apos;tkaziladigan maskanning aniq manzilini Google Xaritadan ochish imkoniyatini taqdim etamiz.
                    </p>

                    <LocationButton address="Yangi yo'l shahri, Sherdor to'yxonasi" className="w-full" />
                  </motion.div>
                </div>
              )}

              {/* Slide 3: RSVP Tashrifni Tasdiqlash */}
              {currentSlide === 3 && (
                <div className="px-6 py-8 flex flex-col gap-8">
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-stone-50 border border-primary-gold/15 p-6 rounded-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary-gold/5 rounded-full blur-xl pointer-events-none" />

                    <div className="flex flex-col items-center text-center gap-2 mb-6">
                      <Mail className="w-6 h-6 text-olive-green" />
                      <h3 className="text-xl font-serif text-stone-800 font-medium">Tashrifni Tasdiqlash</h3>
                      <p className="text-2xs text-stone-400 font-sans uppercase tracking-widest">RSVP Formasi</p>
                      <p className="text-xs text-stone-500 max-w-xs mt-1">
                        Tadbirda ishtirok etishingizni oldindan ma&apos;lum qilishingizni iltimos qilamiz.
                      </p>
                    </div>

                    <AnimatePresence mode="wait">
                      {submitted ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center py-8 text-center"
                        >
                          <div className="w-12 h-12 bg-olive-green/10 rounded-full flex items-center justify-center mb-4 text-olive-green">
                            <CheckCircle className="w-6 h-6 animate-bounce" />
                          </div>
                          <h4 className="text-base font-serif font-bold text-stone-800">Tashrifingiz uchun rahmat!</h4>
                          <p className="text-xs text-stone-500 mt-2">
                            Ma&apos;lumotlaringiz muvaffaqiyatli qabul qilindi. Sizni kutib qolamiz!
                          </p>
                        </motion.div>
                      ) : (
                        <motion.form
                          onSubmit={handleRSVPSubmit}
                          initial={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4"
                        >
                          <div className="space-y-1">
                            <label className="text-2xs text-stone-500 uppercase tracking-wider font-semibold block">
                              Ism va Familiyangiz
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Masalan: Mahmudjon Aliyev"
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:border-primary-gold focus:outline-none text-sm font-sans bg-white transition-all duration-300 shadow-2xs"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-2xs text-stone-500 uppercase tracking-wider font-semibold block">
                              Mehmonlar Soni (Oila a&apos;zolari bilan)
                            </label>
                            <select
                              value={guestsCount}
                              onChange={(e) => setGuestsCount(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-lg border border-stone-200 focus:border-primary-gold focus:outline-none text-sm font-sans bg-white transition-all duration-300 shadow-2xs cursor-pointer"
                            >
                              <option value="1">Yolg&apos;iz o&apos;zim (1 kishi)</option>
                              <option value="2">Turmush o&apos;rtog&apos;im bilan (2 kishi)</option>
                              <option value="3">Oilaviy (3 kishi)</option>
                              <option value="4">Oilaviy (4+ kishi)</option>
                            </select>
                          </div>

                          <div className="space-y-2 pt-2">
                            <label className="text-2xs text-stone-500 uppercase tracking-wider font-semibold block text-center">
                              Ishtirok etasizmi?
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => setIsAttending(true)}
                                className={`py-2.5 rounded-lg text-xs font-semibold tracking-wider font-sans border transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                                  isAttending === true
                                    ? 'bg-olive-green border-olive-green text-white shadow-md shadow-olive-green/25'
                                    : 'bg-white border-stone-200 text-stone-600 hover:border-olive-green/50'
                                }`}
                              >
                                <Heart className="w-3.5 h-3.5 fill-current" />
                                Albatta boraman
                              </button>
                              <button
                                type="button"
                                onClick={() => setIsAttending(false)}
                                className={`py-2.5 rounded-lg text-xs font-semibold tracking-wider font-sans border transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 ${
                                  isAttending === false
                                    ? 'bg-stone-600 border-stone-600 text-white shadow-md shadow-stone-600/25'
                                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-600/50'
                                }`}
                              >
                                Uzr, bora olmayman
                              </button>
                            </div>
                          </div>

                          <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isAttending === null}
                            className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all duration-300 cursor-pointer ${
                              isAttending === null
                                ? 'bg-stone-300 cursor-not-allowed'
                                : 'bg-primary-gold hover:bg-primary-gold-dark shadow-primary-gold/20'
                            }`}
                          >
                            Tasdiqlashni Yuborish
                          </motion.button>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {/* List of RSVPs from LocalStorage */}
                    {savedRSVPs.length > 0 && (
                      <div className="mt-8 border-t border-stone-200/60 pt-6">
                        <div className="flex items-center gap-1.5 mb-3 justify-center text-stone-500">
                          <Users className="w-4 h-4 text-primary-gold" />
                          <span className="text-[10px] uppercase tracking-wider font-semibold font-sans">Keladigan Mehmonlarimiz</span>
                        </div>
                        <div className="max-h-36 overflow-y-auto pr-1 space-y-2 no-scrollbar">
                          {savedRSVPs.map((rsvp, idx) => (
                            <div key={idx} className="flex justify-between items-center text-2xs p-2 bg-white rounded-md border border-stone-100 shadow-2xs">
                              <div className="font-sans font-medium text-stone-700 flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 text-primary-gold fill-primary-gold" />
                                {rsvp.name}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-stone-400">({rsvp.count} kishi)</span>
                                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
                                  rsvp.attending 
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                    : 'bg-stone-100 text-stone-500'
                                }`}>
                                  {rsvp.attending ? 'Boraman' : 'Bora olmayman'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Elegant Footer Signature */}
                  <div className="py-8 text-center flex flex-col items-center gap-3 border-t border-stone-200/40">
                    <Sparkles className="w-4 h-4 text-primary-gold" />
                    <p className="text-sm font-serif font-semibold text-stone-700">Hamidullo {'&'} Muborakxon</p>
                    <p className="text-[9px] font-sans text-stone-400 tracking-widest uppercase">Nikoh Tantanasi • 2026</p>
                    <p className="text-[10px] text-stone-400 italic font-sans max-w-xs mt-1">
                      Sizning tashrifingiz biz uchun katta sharafdir!
                    </p>
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Side Left and Right Navigation Buttons */}
        {currentSlide > 0 && (
          <motion.button
            type="button"
            onClick={handlePrev}
            whileHover={{ scale: 1.08, x: -2 }}
            whileTap={{ scale: 0.95 }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-gradient-to-br from-white to-stone-50 text-primary-gold rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-primary-gold/25 cursor-pointer flex items-center justify-center"
            title="Oldingi sahifa"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
        )}

        {currentSlide < SLIDES.length - 1 && (
          <motion.button
            type="button"
            onClick={handleNext}
            whileHover={{ scale: 1.08, x: 2 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                '0 8px 24px rgba(201,162,39,0.25)',
                '0 8px 32px rgba(201,162,39,0.45)',
                '0 8px 24px rgba(201,162,39,0.25)',
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-gradient-to-br from-[#c9a227] to-[#b8860b] text-white rounded-full border border-white/30 cursor-pointer flex items-center justify-center"
            title="Keyingi sahifa"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        )}

        {/* Bottom Navigation Indicators (Dots) */}
        <div className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 py-2 px-4 rounded-full bg-stone-900/10 backdrop-blur-xs border border-white/20">
          {SLIDES.map((slide) => {
            const isActive = slide.id === currentSlide;
            return (
              <button
                key={slide.id}
                onClick={() => handleGoToSlide(slide.id)}
                className={`transition-all duration-500 rounded-full cursor-pointer ${
                  isActive 
                    ? 'w-6 h-2 bg-primary-gold' 
                    : 'w-2 h-2 bg-stone-400 hover:bg-stone-500'
                }`}
                title={`${slide.title}ga o'tish`}
              />
            );
          })}
        </div>

        {/* Floating Music Controller */}
        <motion.button
          id="music-toggle-btn"
          onClick={togglePlay}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 100 }}
          className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 p-3 bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-primary-gold/20 text-primary-gold hover:text-primary-gold-dark hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center"
          title="Musiqani yoqish/o'chirish"
        >
          {isPlaying ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="flex items-center justify-center"
            >
              <Volume2 className="w-4 h-4" />
            </motion.div>
          ) : (
            <VolumeX className="w-4 h-4 text-stone-400" />
          )}
        </motion.button>

      </div>
    </div>
  );
}

