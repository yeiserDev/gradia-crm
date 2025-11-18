import { NoteItem, NoteTag } from '@/lib/types/core/notes.model';

// --- BASE DE DATOS SIMULADA (Temporal) ---
let MOCK_NOTES_DB: NoteItem[] = [
  { id: 'n1', title: 'Revisar capítulo de regresión', description: 'No olvidar la parte de...', tags: ['To-do', 'Today'], status: 'pending', dateLabel: 'Hoy', createdAt: new Date().toISOString() },
  { id: 'n2', title: 'Reunión de equipo', description: 'Definir Sprints', tags: ['Meeting', 'Team'], status: 'pending', dateLabel: 'Mañana', createdAt: new Date(Date.now() - 10000).toISOString() },
  { id: 'n3', title: 'Terminar mock de API', description: '', tags: [], status: 'done', dateLabel: 'Ayer', createdAt: new Date(Date.now() - 20000).toISOString() },
];
// --- FIN DE MOCK DB ---

/** (SIMULADO) Obtiene todas las notas */
export const getNotes = async (): Promise<NoteItem[]> => {
  await new Promise(r => setTimeout(r, 300));
  return MOCK_NOTES_DB;
};

/** Payload para crear una nota */
export type CreateNotePayload = { title: string; description?: string; tags: NoteTag[] };

/** (SIMULADO) Crea una nueva nota */
export const createNote = async (payload: CreateNotePayload): Promise<NoteItem> => {
  await new Promise(r => setTimeout(r, 300));
  const newNote: NoteItem = {
    id: `n-${Date.now()}`,
    status: 'pending',
    dateLabel: 'Hoy',
    createdAt: new Date().toISOString(),
    ...payload,
  };
  MOCK_NOTES_DB = [newNote, ...MOCK_NOTES_DB];
  return newNote;
};

/** Payload para actualizar una nota */
export type UpdateNotePayload = Partial<Pick<NoteItem, 'title' | 'description' | 'tags' | 'status'>>;

/** (SIMULADO) Edita una nota */
export const updateNote = async (id: string, patch: UpdateNotePayload): Promise<NoteItem> => {
  await new Promise(r => setTimeout(r, 300));
  let updatedNote: NoteItem | undefined;
  MOCK_NOTES_DB = MOCK_NOTES_DB.map(n => {
    if (n.id === id) {
      updatedNote = { ...n, ...patch };
      return updatedNote;
    }
    return n;
  });
  if (!updatedNote) throw new Error("Note not found");
  return updatedNote;
};

/** (SIMULADO) Borra una nota */
export const deleteNote = async (id: string): Promise<void> => {
  await new Promise(r => setTimeout(r, 300));
  MOCK_NOTES_DB = MOCK_NOTES_DB.filter(n => n.id !== id);
};

/** (SIMULADO) Cambia el estado de una nota */
export const toggleNoteStatus = async (id: string): Promise<NoteItem> => {
  const note = MOCK_NOTES_DB.find(n => n.id === id);
  if (!note) throw new Error("Note not found");
  const newStatus = note.status === 'done' ? 'pending' : 'done';
  return updateNote(id, { status: newStatus });
};