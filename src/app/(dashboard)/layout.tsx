// src/app/(dashboard)/layout.tsx (CÓDIGO FINAL CORREGIDO)
'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// 1. IMPORTAMOS EL NUEVO HOOK 'useAuth'
import { useAuth } from '@/context/AuthProvider'; 
import Header from '@/components/common/Header/Header';
import Container from '@/components/common/Container';
import '@/app/globals.css';
// Necesitas que el tipo Role esté en scope. Asumo que se importa a través de UiUser o está en un archivo local.
import type { Role } from '@/lib/types/core/role.model'; // 👈 Asegúrate de que esta importación exista
import type { UiUser } from '@/lib/types/core/user.model'; // Asumo que este tipo existe

export default function DashboardLayout({ children }: { children: ReactNode }) {
  
  const { isAuthenticated, user } = useAuth(); 
  
  const router = useRouter();
  const pathname = usePathname();

  // ... (Guardián de Auth) ...

  if (!isAuthenticated || !user) {
    return null; 
  }

  const tabs = [
    { value: 'general', label: 'General' },
    { value: 'vista', label: 'Vista ampliada' },
  ];

  // 1. Deducir el rol principal (el string)
  const primaryRoleString = user.roles[0] || 'ESTUDIANTE'; 

  // 2. Aplicar la afirmación de tipo para que TS sepa que es una Role válida
  const effectiveRole = primaryRoleString as Role;
  
  // 6. ¡OJO AQUÍ! MAPEAMOS EL USUARIO REAL
  const userForHeader: UiUser = { // Asumo que se usa el tipo UiUser aquí
    id: user.id_usuario,
    role: effectiveRole, // 👈 CORRECCIÓN APLICADA AQUÍ
    name: user.nombre ? user.nombre.split(' ')[0] : user.correo_institucional.split('@')[0], // 🔧 Fallback seguro si nombre es null
    email: user.correo_institucional,
    org: 'GradIA', // Fallback temporal
    avatarUrl: null,
  };

  const isCourseView = pathname.startsWith('/dashboard/courses/');

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--fg)]">
      {/* 7. Pasamos el nuevo objeto 'userForHeader' al Header */}
      <Header user={userForHeader} tabs={tabs} />
      <main>
        {isCourseView ? (
          <div className="w-full h-full">{children}</div>
        ) : (
          <Container className="py-6">{children}</Container>
        )}
      </main>
    </div>
  );
}