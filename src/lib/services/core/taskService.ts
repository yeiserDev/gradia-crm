import { TaskDetail } from '@/lib/types/core/task.model';
import { axiosCore } from '../config/axiosCore';

// --- BASE DE DATOS SIMULADA (Temporal) ---
// (Un simple objeto en memoria para simular guardados)
const MOCK_TASK_DB: Record<string, TaskDetail> = {
  'task-1': { 
    id: 'task-1', 
    title: 'Tarea 1 (Cargada de Mock)', 
    description: 'Esta es una descripción cargada desde el mock.', 
    dueAt: new Date().toISOString() 
  },
};
// --- FIN DE MOCK DB ---

/**
 * (SIMULADO) Obtiene los detalles de una tarea.
 * Reemplaza a getTaskMeta
 */
export const getTaskDetails = async (taskId: string): Promise<TaskDetail | null> => {
  console.log(`Simulando fetch de detalles para tarea: ${taskId}`);
  // Simulamos un retraso de red
  await new Promise(r => setTimeout(r, 400));
  
  // Devuelve la tarea de nuestra DB simulada, o null si no existe
  return MOCK_TASK_DB[taskId] || null;
};
            
/**
 * Este es el "payload" que la mutación necesitará.
 */
export type SaveTaskPayload = Omit<TaskDetail, 'id'>;

/**
 * (SIMULADO) Guarda (crea o actualiza) una tarea.
 * Reemplaza a setTaskBasics y setTaskDescription
 */
export const saveTask = async (taskId: string, data: SaveTaskPayload): Promise<TaskDetail> => {
  console.log(`Simulando guardado de tarea: ${taskId}`);
  await new Promise(r => setTimeout(r, 800)); // Simula guardado

  const task: TaskDetail = { id: taskId, ...data };
  
  // Guarda/Actualiza en la DB simulada
  MOCK_TASK_DB[taskId] = task; 
  
  // En una app real, harías:
  // const { data: savedTask } = await axiosCore.post(`/tasks/${taskId}`, data);
  // return savedTask;

  return task; // Devuelve la tarea guardada
};