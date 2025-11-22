// src/components/BannerCarousel.tsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Banner } from '../../types/banner.types';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface BannerCarouselProps {
  banners: Banner[];
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!banners.length) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 7000);

    return () => clearInterval(id);
  }, [banners]);

  if (!banners.length) return null;

  const active = banners[index];

  const goPrev = () =>
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  const goNext = () => setIndex((prev) => (prev + 1) % banners.length);

  return (
    <div className="relative w-full mb-10">
      <div className="overflow-hidden rounded-3xl border border-[#D4AF37]/40 bg-gradient-to-r from-black via-black to-zinc-900 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="grid md:grid-cols-[2fr_3fr] gap-6 p-6 md:p-10"
          >
            <div className="relative">
              <div className="overflow-hidden rounded-2xl h-48 md:h-56 border border-[#D4AF37]/30">
                <img
                  src={active.imageUrl}
                  alt={active.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#D4AF37] mb-2">
                  Featured banner
                </p>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">
                  {active.title}
                </h2>
                {active.description && (
                  <p className="text-sm text-zinc-200/90 leading-relaxed">
                    {active.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mt-6">
                <div className="flex gap-2 items-center">
                  {banners.map((b, i) => (
                    <button
                      key={b.id}
                      onClick={() => setIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        i === index
                          ? 'bg-[#D4AF37] w-6 shadow-[0_0_12px_rgba(212,175,55,0.8)]'
                          : 'bg-zinc-600'
                      }`}
                    />
                  ))}
                </div>

                {active.link && (
                  <a
                    href={active.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium text-black shadow-[0_0_20px_rgba(212,175,55,0.7)]"
                    style={{
                      background:
                        'linear-gradient(135deg,#D4AF37 0%,#f4e7b0 40%,#D4AF37 100%)',
                    }}
                  >
                    Visit link
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav arrows */}
      <button
        onClick={goPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/80 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={goNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/80 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
