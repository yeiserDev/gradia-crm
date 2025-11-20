'use client';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthProvider'; 

import '@/app/globals.css';

export default function AuthLayout({ children }: { children: ReactNode }) {
  
  const { isAuthenticated } = useAuth(); 
  const router = useRouter();

  // LÓGICA DE REDIRECCIÓN
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard?tab=general');
    }
  }, [isAuthenticated, router]);

  // PROTECCIÓN DE RUTA
  if (isAuthenticated) {
    return null; 
  }

  return (
    <div className="h-dvh w-dvw lg:overflow-hidden bg-[var(--bg)] text-[var(--fg)]">
      <div className="grid h-full w-full lg:grid-cols-2">
        
        {/* LADO IZQUIERDO (IMAGEN) */}
        <div className="relative hidden lg:block h-full">
          <Image
            src="/auth/hero.webp"
            alt="Grad.IA"
            fill
            priority
            className="object-cover object-center"
            sizes="(min-width:1024px) 50vw, 0px"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/25" />
        </div>

        {/* LADO DERECHO (FORMULARIO) */}
        <div className="h-full bg-white dark:bg-zinc-950"> 
          <div className="h-full overflow-y-auto">
            {/* AQUÍ ESTABA EL PROBLEMA:
                1. Cambié max-w-[440px] a max-w-2xl para que quepa tu formulario ancho.
                2. Agregué 'flex flex-col justify-center min-h-full' para ayudar al centrado vertical.
            */}
            <div className="mx-auto w-full max-w-2xl px-6 sm:px-8 py-10 lg:py-14 min-h-full flex flex-col justify-center">
              {children}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}