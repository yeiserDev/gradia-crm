'use client';

//Importar useEffect y useQueryClient
import { createContext, useContext, useEffect } from 'react'; 
import type { ReactNode } from 'react';
import { User } from '@/lib/types/auth/user.model'; // 1. El 'type' que ya creamos
import { useMe } from '@/hooks/auth/useMe'; // 2. El hook 'useQuery' que creamos
import { useQueryClient } from '@tanstack/react-query';
import { LOGOUT_EVENT_KEY } from '@/hooks/auth/useLogout';

// 3. Definimos la "forma" de nuestro contexto
interface AuthContextType {
  user: User | null;         // Los datos del usuario o null
  isAuthenticated: boolean;  // Un booleano simple para saber si está logueado
}

// 4. Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 5. Creamos el Provider "inteligente"
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, isError } = useMe();
  const queryClient = useQueryClient(); 

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // 🔑 CORRECCIÓN CLAVE:
      // event.newValue es null si se borró, o tiene valor si se añadió/modificó.
      // Si el evento es el de logout Y event.newValue existe (lo acabamos de setear)...
      if (event.key === LOGOUT_EVENT_KEY && event.newValue) {
        
        // ...forzamos la limpieza de la caché EN ESTA PESTAÑA.
        queryClient.invalidateQueries({ queryKey: ['me'] });
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [queryClient]); 

  if (isLoading) {
    return <div>Cargando sesión...</div>; 
  }

  const isAuthenticated = !isError && !!user;

  const value = {
    user: isAuthenticated ? user : null,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 10. Creamos un hook simple para consumir el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};