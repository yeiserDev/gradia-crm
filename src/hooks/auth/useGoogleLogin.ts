import { startGoogleLogin } from '@/lib/services/auth/googleAuthUrl';
import { useState } from 'react';

export const useGoogleLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = () => {
    setIsLoading(true);
    startGoogleLogin(); // Redirección inmediata
  };

  return {
    loginWithGoogle,
    isLoading,
  };
};
