import { useState, useEffect } from 'react';
import { TaskDetail } from '@/lib/types/core/task.model'; // Asumimos que los recursos son parte de los detalles

// Definimos un tipo 'Resource' simple
export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'document' | 'notebook' | 'slide' | 'link' | 'video';
  url: string;
  size?: string;
  updatedAt?: string;
}

// --- MOCK DATA ---
const MOCK_RESOURCES: Resource[] = [
  { id: 'res-1', title: 'Lectura_Semana_1.pdf', type: 'pdf', url: '#' },
  { id: 'res-2', title: 'Video_Explicativo.mp4', type: 'video', url: '#' },
];
// --- FIN MOCK ---

/**
 * Hook SIMULADO para obtener los recursos de una tarea
 */
export const useTaskResources = (taskId: string) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simula fetch
    setTimeout(() => {
      // En una app real, harías:
      // const { data } = await axiosCore.get(`/tasks/${taskId}/resources`);
      // setResources(data);
      setResources(MOCK_RESOURCES);
      setLoading(false);
    }, 500);
  }, [taskId]);

  // Funciones simuladas para añadir/quitar (como las que espera el componente)
  const addResource = async (r: Omit<Resource, 'id'>) => {
    const newRes: Resource = { ...r, id: `res-${Date.now()}` };
    setResources(prev => [newRes, ...prev]);
    return newRes;
  };

  const removeResource = async (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  return { resources, loading, addResource, removeResource };
};