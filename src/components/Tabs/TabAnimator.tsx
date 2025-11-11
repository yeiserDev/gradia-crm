'use client';

import { motion, AnimatePresence } from '@/lib/utils/motion';
import StudentGeneralTab from '@/components/Tabs/StudentGeneralTab';
import TeacherGeneralTab from '@/components/Tabs/TeacherGeneralTab';
import VistaAmpliadaTab from '@/components/Tabs/VistaAmpliada/VistaAmpliadaTab';

// --- 1. ¡IMPORTACIÓN CORREGIDA! ---
import type { UiUser } from '@/lib/types/core/user.model'; // 👈 El reemplazo de 'MinimalUser'

// --- 2. TIPO DE PROP CORREGIDO ---
type Props = { tab: 'general' | 'vista'; user: UiUser }; // 👈 Usa 'UiUser'

export default function TabAnimator({ tab, user }: Props) {
  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={tab === 'general' ? `general-${user.role}` : 'vista'}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {tab === 'general'
            // --- 3. ¡LÓGICA CORREGIDA! ---
            ? (user.role === 'DOCENTE' // 👈 Comparamos con 'DOCENTE'
                ? <TeacherGeneralTab user={user} />
                : <StudentGeneralTab user={user} />)
            // (VistaAmpliadaTab ya está refactorizado y no necesita props)
            : <VistaAmpliadaTab /> 
          }
        </motion.div>
      </AnimatePresence>
    </div>
  );
}