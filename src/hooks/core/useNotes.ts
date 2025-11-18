import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getNotes, 
  createNote, type CreateNotePayload,
  updateNote, type UpdateNotePayload,
  deleteNote, 
  toggleNoteStatus 
} from '@/lib/services/core/notesService';

// Clave de caché para la lista de notas
export const NOTES_QUERY_KEY = ['notes'];

/**
 * Hook maestro para gestionar todas las operaciones de Notas
 */
export const useNotes = () => {
  const queryClient = useQueryClient();

  // 1. Hook para OBTENER las notas
  const { data: items = [], isLoading } = useQuery({
    queryKey: NOTES_QUERY_KEY,
    queryFn: getNotes,
  });

  // Helper para invalidar (refrescar) la lista de notas
  const invalidate = () => queryClient.invalidateQueries({ queryKey: NOTES_QUERY_KEY });

  // 2. Hook para CREAR
  const { mutate: create } = useMutation({
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: invalidate, // Refresca la lista al crear
  });

  // 3. Hook para EDITAR
  const { mutate: edit } = useMutation({
    mutationFn: ({ id, patch }: { id: string, patch: UpdateNotePayload }) => updateNote(id, patch),
    onSuccess: invalidate, // Refresca la lista al editar
  });

  // 4. Hook para BORRAR
  const { mutate: remove } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: invalidate, // Refresca la lista al borrar
  });

  // 5. Hook para TOGGLE (marcar/desmarcar)
  const { mutate: toggle } = useMutation({
    mutationFn: (id: string) => toggleNoteStatus(id),
    onSuccess: invalidate, // Refresca la lista al cambiar estado
  });

  // Devolvemos todo lo que el componente 'NotesCard' necesita
  return {
    items,
    isLoading,
    onCreate: create,
    onEdit: edit,
    onDelete: remove,
    onToggle: toggle,
  };
};