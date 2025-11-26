import { TaskDetail } from '@/lib/types/core/task.model';
import { axiosTeacher } from '../config/axiosTeacher';

/**
 * Obtiene los detalles de una actividad desde el backend Teacher
 * El token JWT se incluye automáticamente via interceptor
 */
export const getTaskDetails = async (taskId: string): Promise<TaskDetail | null> => {
  try {
    const response = await axiosTeacher.get(`/actividades/${taskId}`);

    if (!response.data.success) {
      console.warn('No se pudo obtener actividad:', response.data.message);
      return null;
    }

    const actividad = response.data.data;
    return {
      id: actividad.id_actividad.toString(),
      title: actividad.nombre_actividad,
      description: actividad.descripcion || '',
      dueAt: actividad.fecha_limite,
      unitId: actividad.id_unidad?.toString()
    };
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
 * Guarda (crea o actualiza) una tarea en el backend Teacher
 * @param taskId - ID de la tarea (si empieza con 'tmp-' se considera nueva)
 * @param data - Datos de la tarea
 * @param userId - ID del usuario que crea/actualiza la tarea
 */
export const saveTask = async (taskId: string, data: SaveTaskPayload, userId: number): Promise<TaskDetail> => {
  try {
    const isNewTask = taskId.startsWith('tmp-');

    if (isNewTask) {
      // CREAR nueva actividad
      console.log('🆕 Creando nueva actividad:', data);

      const payload = {
        nombre_actividad: data.title,
        descripcion: data.description || '',
        fecha_limite: data.dueAt,
        tipo_actividad: 'individual', // Por ahora siempre individual
        id_unidad: parseInt(data.unitId!),
        id_usuario: userId
      };

      const response = await axiosTeacher.post('/actividades', payload);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al crear actividad');
      }

      const nuevaActividad = response.data.data;

      return {
        id: nuevaActividad.id_actividad.toString(),
        title: nuevaActividad.nombre_actividad,
        description: nuevaActividad.descripcion || '',
        dueAt: nuevaActividad.fecha_limite,
        unitId: nuevaActividad.id_unidad?.toString()
      };
    } else {
      // ACTUALIZAR actividad existente
      console.log('✏️ Actualizando actividad:', taskId, data);

      const payload = {
        nombre_actividad: data.title,
        descripcion: data.description || '',
        fecha_limite: data.dueAt,
        tipo_actividad: 'individual'
      };

      const response = await axiosTeacher.put(`/actividades/${taskId}`, payload);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al actualizar actividad');
      }

      const actividadActualizada = response.data.data;

      return {
        id: actividadActualizada.id_actividad.toString(),
        title: actividadActualizada.nombre_actividad,
        description: actividadActualizada.descripcion || '',
        dueAt: actividadActualizada.fecha_limite,
        unitId: actividadActualizada.id_unidad?.toString()
      };
    }
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    console.error('Error al guardar tarea:', error);
    throw new Error(err.response?.data?.message || err.message || 'Error al guardar la actividad');
  }
};
