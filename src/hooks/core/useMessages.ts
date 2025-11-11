import { useQuery } from '@tanstack/react-query';
import { getMessages } from '@/lib/services/core/messages.service';

export const MESSAGES_QUERY_KEY = ['messages'];

/**
 * Hook "inteligente" para obtener el resumen de mensajes
 */
export const useMessages = () => {
  const { data, isLoading } = useQuery({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: getMessages,
    
    // Opcional: Refrescar mensajes cada 2 minutos
    staleTime: 1000 * 60 * 2, 
  });

  // Devolvemos los datos con valores por defecto
  // para evitar errores de 'undefined' en el componente
  return {
    items: data?.items ?? [],
    unread: data?.unread ?? 0,
    isLoading,
  };
};