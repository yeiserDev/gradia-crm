"use client";

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Props para que pueda recibir {children}
interface Props {
  children: React.ReactNode;
}

export const QueryProvider = ({ children }: Props) => {
  // Usamos useState para crear el cliente UNA SOLA VEZ
  // Esto evita que se re-cree en cada re-render
  const [queryClient] = useState(() => new QueryClient({
    // Opciones globales si las necesitas
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutos
        retry: 1, // Reintentar solo 1 vez
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};