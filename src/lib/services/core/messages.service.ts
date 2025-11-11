import type { MessageItem } from '@/lib/types/core/message.model';

// --- MOCK DB (Temporal) ---
const MOCK_MESSAGES: MessageItem[] = [
  { id: '1', from: 'Jorge C. (Mock)', text: 'Subí la rúbrica al curso de Redes', time: 'hace 5m', unread: true },
  { id: '2', from: 'Karen S. (Mock)', text: '¿Confirmas la demo del lunes?',     time: 'hace 1h' },
  { id: '3', from: 'Equipo Grad.IA (Mock)', text: 'Se publicó la nueva versión', time: 'ayer' },
];
// --- FIN MOCK ---

/**
 * (SIMULADO) Obtiene el resumen de mensajes para el header.
 */
export const getMessages = async (): Promise<{ items: MessageItem[]; unread: number }> => {
  // Simula un retraso de red
  await new Promise(r => setTimeout(r, 700));

  const unreadCount = MOCK_MESSAGES.filter(m => m.unread).length;
  
  // En una app real, harías:
  // const { data } = await axiosCore.get('/messages/summary');
  // return data; // (ej. { items: [...], unread: 1 })
  
  return {
    items: MOCK_MESSAGES,
    unread: unreadCount,
  };
};