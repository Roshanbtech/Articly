import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="flex items-center justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 rounded-full bg-gradient-to-r from-[#f4e7b0] via-[#D4AF37] to-[#8f6b1f]"
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.3, 1],
            boxShadow: [
              '0 0 10px rgba(212, 175, 55, 0.4)',
              '0 0 20px rgba(212, 175, 55, 0.9)',
              '0 0 10px rgba(212, 175, 55, 0.4)',
            ],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}
