'use client';

import { motion } from 'framer-motion';

export default function GoogleLoader() {
  return (
    <div className="flex items-center justify-center gap-2">
      {/* Spinner circular simple */}
      <motion.div
        className="relative w-5 h-5"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--fg)]/80 border-r-[var(--fg)]/40" />
      </motion.div>

      {/* Texto */}
      <span>Redirigiendo...</span>
    </div>
  );
}
