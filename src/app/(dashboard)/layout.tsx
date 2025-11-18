// src/app/(dashboard)/layout.tsx
'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { useAuth } from '@/context/AuthProvider';
import Header from '@/components/common/Header/Header';
import Container from '@/components/common/Container';
import '@/app/globals.css';

import type { Role } from '@/lib/types/core/role.model';
import type { UiUser } from '@/lib/types/core/user.model';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  
  const { isAuthenticated, user } = useAuth(); 
  const router = useRouter();
  const pathname = usePathname();

  // Guard de autenticación
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const tabs = [
    { value: 'general', label: 'General' },
    { value: 'vista', label: 'Vista ampliada' },
  ];

  const primaryRoleString = user.roles?.[0] || 'ESTUDIANTE';
  const effectiveRole = primaryRoleString as Role;

  const userForHeader: UiUser = {
    id: user.id_usuario,
    role: effectiveRole,
    name: user.nombre
      ? user.nombre.split(' ')[0]
      : user.correo_institucional.split('@')[0],
    email: user.correo_institucional,
    org: 'GradIA',
    avatarUrl: null,
  };

  const isCourseView = pathname.startsWith('/dashboard/courses/');

  return (
    <div
      className="
        min-h-dvh 
        text-[var(--fg)]
        relative
        bg-[var(--bg)]
      "
    >
      {/* Fondo que me dijiste EXACTAMENTE */}
      <div
  className="
    pointer-events-none
    absolute inset-0
    bg-[radial-gradient(var(--grid-dot)_1px,transparent_1px)]
    [background-size:16px_16px]
    [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]
  "
/>


      {/* Contenido */}
      <div className="relative z-10">
        <Header user={userForHeader} tabs={tabs} />

        <main>
          {isCourseView ? (
            <div className="w-full h-full">{children}</div>
          ) : (
            <Container className="py-6">{children}</Container>
          )}
        </main>
      </div>
    </div>
  );
}
