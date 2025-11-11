"use client";

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { User } from '@/lib/types/auth/user.model'; // 1. El 'type' que ya creamos
import { useMe } from '@/hooks/auth/useMe'; // 2. El hook 'useQuery' que creamos

// 3. Definimos la "forma" de nuestro contexto
interface AuthContextType {
  user: User | null;         // Los datos del usuario o null
  isAuthenticated: boolean;  // Un booleano simple para saber si está logueado
}

// 4. Creamos el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 5. Creamos el Provider "inteligente"
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  // 6. ¡LA MAGIA! Usamos el hook useMe para obtener el estado del usuario
  const { user, isLoading, isError } = useMe();

  // 7. Si está cargando el perfil, muestra un loader.
  // Esto es VITAL para la carga inicial de la página.
  if (isLoading) {
    // Puedes poner un componente <FullPageLoader /> aquí
    return <div>Cargando sesión...</div>; 
  }

  // 8. Determinamos si está autenticado.
  // Si NO hubo error y el 'user' existe, está autenticado.
  const isAuthenticated = !isError && !!user;

  // 9. Preparamos el valor que compartirá el contexto
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