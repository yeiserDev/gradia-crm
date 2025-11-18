import { TaskDetail } from '@/lib/types/core/task.model';

/**
 * Obtiene los detalles de una actividad desde el backend de Student
 * El token JWT se incluye automáticamente via interceptor
 */
export const getTaskDetails = async (_taskId: string): Promise<TaskDetail | null> => {
  try {
    // 🔧 Llamada real al backend - ajustar endpoint según disponibilidad
    // Por ahora, necesitaremos obtener la actividad desde el curso
    // TODO: Verificar si existe endpoint directo GET /api/student/actividades/:id

    console.warn('getTaskDetails: Endpoint directo no disponible aún, retornando null');
    return null;

    // Cuando esté disponible:
    // const response = await axiosStudent.get(`/actividades/${taskId}`);
    // if (!response.data.success) return null;
    //
    // const actividad = response.data.data;
    // return {
    //   id: actividad.id_actividad.toString(),
    //   title: actividad.nombre_actividad,
    //   description: actividad.descripcion || '',
    //   dueAt: actividad.fecha_limite
    // };
  } catch (error) {
    console.error('Error al obtener detalles de tarea:', error);
    return null;
  }
};

/**
 * Este es el "payload" que la mutación necesitará.
 */
export type SaveTaskPayload = Omit<TaskDetail, 'id'>;

/**
 * (SIMULADO) Guarda (crea o actualiza) una tarea.
 * Reemplaza a setTaskBasics y setTaskDescription
 * TODO: Conectar con backend real
 */
export const saveTask = async (taskId: string, data: SaveTaskPayload): Promise<TaskDetail> => {
  console.log(`Simulando guardado de tarea: ${taskId}`);
  await new Promise(r => setTimeout(r, 800)); // Simula guardado

  const task: TaskDetail = { id: taskId, ...data };

  // TODO: En una app real, harías:
  // const { data: savedTask } = await axiosTeacher.post(`/actividades/${taskId}`, data);
  // return savedTask;

  return task; // Devuelve la tarea guardada
};