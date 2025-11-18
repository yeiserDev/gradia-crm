// app/(dashboard)/dashboard/profile/ProfilePageBridge.tsx
'use client';

import { useAuth } from '@/context/AuthProvider';// ← AJUSTA ESTA RUTA SEGÚN TU PROYECTO (ver abajo)
import ProfileForm from '@/components/profile/ProfileForm';
import { redirect } from 'next/navigation';

export default function ProfilePageBridge() {
  const { user, isAuthenticated } = useAuth();

  // 1. Si aún no sabemos si está autenticado → mostramos loader
  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Cargando perfil...</div>
      </div>
    );
  }

  // 2. Si no está autenticado → redirigimos al login
  if (!isAuthenticated || !user) {
    redirect('/login');
  }

  // 3. Ya tenemos usuario → lo adaptamos al formato que espera ProfileForm
  const profileUser = {
    name: `${user.nombre} ${user.apellido}`.trim(),
    org: 'UPeU',
    role: user.roles.includes('DOCENTE') || user.roles.includes('ADMIN')
      ? 'TEACHER' as const
      : 'STUDENT' as const,
    email: user.correo_institucional,
    phone: null,
    bio: null,
    memberSince: undefined,
  };

  return <ProfileForm user={profileUser} />;
}