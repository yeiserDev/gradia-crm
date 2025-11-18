'use client';

import { motion } from '@/lib/utils/motion';
import { Add, People, FolderAdd } from 'iconsax-react';

export default function SidebarActions() {
  return (
    <div className="mb-4 space-y-2">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => document.dispatchEvent(new CustomEvent('open-create-unit'))}
        className="w-full flex items-center justify-center gap-2 h-10 rounded-lg
                   bg-[var(--brand)] text-white font-medium text-[14px]
                   hover:bg-[var(--brand)]/90 transition"
      >
        <FolderAdd size={18} />
        Crear Módulo
      </motion.button>

      <div className="grid grid-cols-2 gap-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => document.dispatchEvent(new CustomEvent('open-create-task'))}
          className="flex items-center justify-center gap-2 h-10 rounded-lg
                     bg-[var(--brand)]/10 text-[var(--brand)] font-medium text-[14px]
                     hover:bg-[var(--brand)]/20 transition"
        >
          <Add size={18} color="var(--brand)" />
          Nueva tarea
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => alert('Abrir lista de estudiantes')}
          className="flex items-center justify-center gap-2 h-10 rounded-lg
                     bg-[var(--brand)]/10 text-[var(--brand)] font-medium text-[14px]
                     hover:bg-[var(--brand)]/20 transition"
        >
          <People size={18} color="var(--brand)" />
          Estudiantes
        </motion.button>
      </div>
    </div>
  );
}
