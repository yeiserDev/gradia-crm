/**
 * Las etiquetas que una nota puede tener.
 * (Basado en tu componente)
 */
export type NoteTag = 'Today' | 'To-do' | 'Meeting' | 'Team';

/**
 * Representa una nota en el dashboard.
 */
export interface NoteItem {
  id: string;
  title: string;
  description?: string;
  tags: NoteTag[];
  status: 'done' | 'pending';
  dateLabel: string; // (Tu mock lo tiene, lo mantendremos)
  createdAt: string; // (Bueno para ordenar)
}