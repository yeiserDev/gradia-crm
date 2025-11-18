import { useQuery } from '@tanstack/react-query';
import { fetchMonthEvents } from '@/lib/services/core/agendaService';

export const AGENDA_QUERY_KEY = 'agendaEvents';

/**
 * Hook "inteligente" para obtener los eventos de la agenda
 */
export const useAgenda = (year: number, month: number) => {
  const { data: events = [], isLoading } = useQuery({
    // La clave de caché depende del año Y el mes
    queryKey: [AGENDA_QUERY_KEY, year, month],
    
    // Llama a nuestro nuevo servicio simulado
    queryFn: () => fetchMonthEvents(year, month),
  });

  return { events, isLoading };
};