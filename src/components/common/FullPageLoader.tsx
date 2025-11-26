'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[var(--bg)] to-[var(--section)]">
      {/* Backdrop con efecto de blur */}
      <div className="absolute inset-0 backdrop-blur-sm bg-[var(--bg)]/80" />

      {/* Contenedor principal */}
      <div className="relative flex flex-col items-center gap-8">
        {/* Logo animado */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <Image
            src="/logo/GradiaLogowhite.png"
            alt="Grad.IA"
            width={80}
            height={80}
            className="block dark:hidden rounded-2xl"
          />
          <Image
            src="/logo/GradiaLogoDark.png"
            alt="Grad.IA"
            width={80}
            height={80}
            className="hidden dark:block rounded-2xl"
          />

          {/* Anillo animado alrededor del logo */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, #30E3CA, #7DE69D)',
              padding: '3px',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>

        {/* Puntos de carga */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#30E3CA] to-[#7DE69D]"
              initial={{ scale: 0.8, opacity: 0.4 }}
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Texto opcional */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-sm text-[var(--muted)] font-light"
        >
          Cargando Grad.IA...
        </motion.p>
      </div>
    </div>
  );
}
