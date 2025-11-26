'use client';

import { motion } from 'framer-motion';

export default function LoginLoader() {
  console.log('✅ LoginLoader renderizado');

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Spinner circular mejorado */}
      <motion.div
        className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white"
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Texto */}
      <span className="text-white">Ingresando...</span>
    </div>
  );
}
