import { AgendaEvent } from '@/lib/types/core/agenda.model';

// --- MOCK DB (Temporal) ---
const MOCK_EVENTS: AgendaEvent[] = [
  { id: 'e1', start: new Date(Date.now() + 86400000 * 1).toISOString(), end: new Date(Date.now() + 86400000 * 1 + 3600000).toISOString(), title: 'Examen Parcial (Simulado)', type: 'task' },
  { id: 'e2', start: new Date(Date.now() + 86400000 * 3).toISOString(), end: new Date(Date.now() + 86400000 * 3 + 7200000).toISOString(), title: 'Reunión Grupo (Simulado)', type: 'meeting' },
];
// --- FIN MOCK ---

/**
 * (SIMULADO) Obtiene los eventos para un mes/año.
 * Reemplaza a fetchMonthEvents
 */
export const fetchMonthEvents = async (year: number, month: number): Promise<AgendaEvent[]> => {
  console.log(`Simulando fetch de eventos para: ${year}-${month + 1}`);
  await new Promise(r => setTimeout(r, 400));
  
  // En una app real, filtrarías por mes/año
  // const { data } = await axiosCore.get(`/agenda?year=${year}&month=${month+1}`);
  // return data;

  return MOCK_EVENTS;
};