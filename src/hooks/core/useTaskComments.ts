import { useState, useEffect, useCallback } from 'react';
import { TaskComment } from '@/lib/types/core/task.model'; // El tipo que acabamos de crear
import { Role } from '@/lib/types/core/role.model'; // El tipo que ya teníamos
import { useAuth } from '@/context/AuthProvider'; // Para saber el nombre del autor

// --- DATOS SIMULADOS (TEMPORALES) ---
const MOCK_COMMENTS: TaskComment[] = [
  {
    id: 'c1',
    authorName: 'Ana (Simulado)',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // hace 5 min
    body: 'Profe, ¿la fecha de entrega se puede mover?',
    parentId: null,
  },
  {
    id: 'c2',
    authorName: 'Profesor (Simulado)',
    createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(), // hace 3 min
    body: 'Hola Ana, no, la fecha es la que está indicada.',
    parentId: 'c1', // Respuesta a c1
  },
];
// --- FIN DE DATOS SIMULADOS ---

/**
 * Hook SIMULADO para gestionar los comentarios de una tarea
 */
export const useTaskComments = (taskId: string, role: Role) => {
  const { user } = useAuth(); // Usamos el auth real
  const [items, setItems] = useState<TaskComment[]>([]);
  const [loading, setLoading] = useState(true);

  // Simula la carga inicial de comentarios
  useEffect(() => {
    setLoading(true);
    // Simulamos un fetch de red
    setTimeout(() => {
      // En una app real, aquí filtrarías por 'taskId'
      setItems(MOCK_COMMENTS);
      setLoading(false);
    }, 800);
  }, [taskId]); // Se ejecuta si el taskId cambia

  // Simula la función de añadir un nuevo comentario
  const add = useCallback(async (body: string, parentId: string | null) => {
    // Usamos el nombre del usuario real si está disponible
    const authorName = user?.correo_institucional.split('@')[0] || (role === 'DOCENTE' ? 'Profesor (Tú)' : 'Estudiante (Tú)');
    
    const newComment: TaskComment = {
      id: `c-${Date.now()}`,
      authorName: authorName,
      createdAt: new Date().toISOString(),
      body,
      parentId,
    };
    
    // Añadimos el comentario a la lista local
    setItems(currentItems => [...currentItems, newComment]);
    
    // Simulamos el tiempo que tarda la API en guardar
    await new Promise(res => setTimeout(res, 300));
  }, [role, user]); // Depende del 'role' y 'user'

  // Devolvemos el "contrato" que el componente espera
  return { items, loading, add };
};