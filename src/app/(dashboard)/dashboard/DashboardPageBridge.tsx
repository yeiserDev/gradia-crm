// src/app/(dashboard)/dashboard/DashboardPageBridge.tsx
'use client';

import { useAuth } from '@/context/AuthProvider'; 
import StudentGeneralTab from '@/components/Tabs/StudentGeneralTab';
import TeacherGeneralTab from '@/components/Tabs/TeacherGeneralTab';
import VistaAmpliadaTab from '@/components/Tabs/VistaAmpliada/VistaAmpliadaTab';
// Asegúrate de que UiUser exista aquí, o usa un alias si es necesario:
import type { UiUser } from '@/lib/types/core/user.model'; 
import type { Role } from '@/lib/types/core/role.model'; 

export default function DashboardPageBridge({ tab }: { tab: 'general' | 'vista' }) {
  
  // 'user' ahora es del tipo User API (con nombre/apellido)
  const { user, isAuthenticated } = useAuth(); 

  if (!isAuthenticated || !user) {
    return null; 
  }

  const isTeacherOrAdmin = user.roles.includes('DOCENTE') || user.roles.includes('ADMIN');

  const primaryRole: Role = isTeacherOrAdmin 
    ? (user.roles.includes('DOCENTE') ? 'DOCENTE' : 'ADMIN')
    : 'ESTUDIANTE';

  // --- 2. CREAMOS EL 'userForTabs' (EL 'UiUser') ---
  const userForTabs: UiUser = {
    id: user.id_usuario,
    email: user.correo_institucional,
    role: primaryRole,
    
    // 🔑 CORRECCIÓN 2: USAMOS LOS CAMPOS NUEVOS (nombre y apellido)
    //                para construir el campo final 'name'
    // Los campos 'nombre' y 'apellido' existen en 'user' gracias al paso 1.
    name: `${user.nombre} ${user.apellido}`.trim(), 
    
    org: 'GradIA', 
    avatarUrl: null,
  };

  if (tab === 'general') {
    return isTeacherOrAdmin
      ? <TeacherGeneralTab user={userForTabs} />
      : <StudentGeneralTab user={userForTabs} />;
  }

  return <VistaAmpliadaTab />;
}