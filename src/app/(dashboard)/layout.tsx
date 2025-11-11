// src/app/(dashboard)/layout.tsx
'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// 1. IMPORTAMOS EL NUEVO HOOK 'useAuth'
import { useAuth } from '@/context/AuthProvider'; 
import Header from '@/components/common/Header/Header';
import Container from '@/components/common/Container';
import '@/app/globals.css';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  
  // 3. USAMOS EL NUEVO CONTEXTO
  // 'user' ahora es el objeto { id_usuario, correo_institucional, roles }
  // o 'null' si no está logueado.
  const { isAuthenticated, user } = useAuth(); 
  
  const router = useRouter();
  const pathname = usePathname(); // 👈 detecta la ruta actual

  // 4. ACTUALIZAMOS EL "GUARDIÁN" DE LA RUTA
  // 'isAuthed' ahora es 'isAuthenticated'
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, router]);

  // 5. SI NO ESTÁ AUTENTICADO, NO RENDERIZA NADA
  // (El AuthProvider en el layout raíz ya muestra un loader,
  // pero esta es una doble capa de seguridad)
  if (!isAuthenticated || !user) {
    return null; 
  }

  // Esto se mantiene igual
  const tabs = [
    { value: 'general', label: 'General' },
    { value: 'vista', label: 'Vista ampliada' },
  ];

  // 6. ¡OJO AQUÍ! MAPEAMOS EL USUARIO REAL
  // El 'user' de useAuth() SÓLO tiene los campos de 'getMyProfile.js'
  // (id_usuario, correo_institucional, roles).
  // NO tiene 'name', 'org', etc. (lo veremos en un segundo)
  const userForHeader = {
    id: user.id_usuario,
    role: user.roles[0] || 'ESTUDIANTE', // Usamos el primer rol
    name: user.correo_institucional.split('@')[0], // Fallback temporal
    email: user.correo_institucional,
    org: 'GradIA', // Fallback temporal
    avatarUrl: null,
  };

  // Esto se mantiene igual
  const isCourseView = pathname.startsWith('/dashboard/courses/');

  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--fg)]">
      {/* 7. Pasamos el nuevo objeto 'userForHeader' al Header */}
      <Header user={userForHeader} tabs={tabs} />
      <main>
        {/* 8. ¡ELIMINAMOS UserProvider! Ya no es necesario.
            El contexto 'useAuth' ya provee el usuario globalmente.
        */}
        {isCourseView ? (
          <div className="w-full h-full">{children}</div>
        ) : (
          <Container className="py-6">{children}</Container>
        )}
      </main>
    </div>
  );
}