'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMe } from '@/hooks/auth/useMe';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading, isError } = useMe();

  // Obtiene si es nuevo usuario (no es obligatorio usarlo)
  const isNewUser = searchParams.get('isNewUser') === 'true';

  useEffect(() => {
    // 1. Si está cargando, no hacemos nada aún
    if (isLoading) return;

    // 2. Si ya se obtuvo el usuario correctamente → redirigir al dashboard
    if (user) {
      router.replace('/dashboard?tab=general');
      return;
    }

    // 3. Si hay error, redirigir al login (no debería pasar normalmente)
    if (isError) {
      router.replace('/auth/login');
    }

  }, [user, isLoading, isError, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-sm text-[var(--muted)]">Procesando autenticación…</p>
    </div>
  );
}
