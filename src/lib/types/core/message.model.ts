// src/lib/types/core/message.model.ts

/**
 * Representa un ítem en el menú de Mensajes.
 * (Basado en el mock de tu componente)
 */
export interface MessageItem {
  id: string;
  from: string;
  text: string;
  time: string; // ej. "hace 5m"
  unread?: boolean;
}