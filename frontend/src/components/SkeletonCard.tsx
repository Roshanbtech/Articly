import { motion } from 'framer-motion';

const shimmerBase = {
  duration: 1.5,
  repeat: Infinity,
  ease: 'easeInOut' as const,
};

export default function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[#D4AF37]/25 bg-black/60 backdrop-blur-2xl p-6 shadow-[0_0_35px_rgba(0,0,0,0.85)]"
    >
      {/* Main block */}
      <motion.div
        className="h-48 rounded-xl mb-4 bg-linear-to-r from-[#D4AF37]/10 via-[#f4e7b0]/5 to-[#D4AF37]/10"
        animate={{ opacity: [0.25, 0.7, 0.25] }}
        transition={shimmerBase}
      />

      {/* Title line */}
      <motion.div
        className="h-6 rounded-lg mb-3 w-3/4 bg-linear-to-r from-[#D4AF37]/10 via-[#f4e7b0]/5 to-[#D4AF37]/10"
        animate={{ opacity: [0.25, 0.7, 0.25] }}
        transition={{ ...shimmerBase, delay: 0.2 }}
      />

      {/* Meta line 1 */}
      <motion.div
        className="h-4 rounded-lg mb-2 bg-linear-to-r from-[#D4AF37]/10 via-[#f4e7b0]/5 to-[#D4AF37]/10"
        animate={{ opacity: [0.25, 0.7, 0.25] }}
        transition={{ ...shimmerBase, delay: 0.4 }}
      />

      {/* Meta line 2 */}
      <motion.div
        className="h-4 rounded-lg w-5/6 bg-linear-to-r from-[#D4AF37]/10 via-[#f4e7b0]/5 to-[#D4AF37]/10"
        animate={{ opacity: [0.25, 0.7, 0.25] }}
        transition={{ ...shimmerBase, delay: 0.6 }}
      />
    </motion.div>
  );
}
