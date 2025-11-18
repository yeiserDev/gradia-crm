import { axiosTeacher } from '../config/axiosTeacher';

/**
 * Servicios para gestión de actividades (DOCENTE)
 * Conectados al backend de Teacher
 */

export type CreateActivityPayload = {
  id_unidad: number;
  nombre_actividad: string;
  descripcion?: string;
  tipo_actividad?: string;
  fecha_limite?: string;
  puntuacion_maxima?: number;
};

export type UpdateActivityPayload = Partial<Omit<CreateActivityPayload, 'id_unidad'>>;

/**
 * Obtiene todas las actividades
 */
export const getAllActivities = async () => {
  const response = await axiosTeacher.get('/actividades');
  return response.data;
};

/**
 * Obtiene una actividad específica por ID
 */
export const getActivityById = async (activityId: string) => {
  const response = await axiosTeacher.get(`/actividades/${activityId}`);
  return response.data;
};

/**
 * Obtiene todas las actividades de una unidad
 */
export const getActivitiesByUnit = async (unitId: string) => {
  const response = await axiosTeacher.get(`/unidades/${unitId}/actividades`);
  return response.data;
};

/**
 * Obtiene todas las actividades de un curso
 */
export const getActivitiesByCourse = async (courseId: string) => {
  const response = await axiosTeacher.get(`/cursos/${courseId}/actividades`);
  return response.data;
};

/**
 * Crea una nueva actividad
 */
export const createActivity = async (data: CreateActivityPayload) => {
  const response = await axiosTeacher.post('/actividades', data);
  return response.data;
};

/**
 * Actualiza una actividad existente
 */
export const updateActivity = async (activityId: string, data: UpdateActivityPayload) => {
  const response = await axiosTeacher.put(`/actividades/${activityId}`, data);
  return response.data;
};

/**
 * Elimina una actividad
 */
export const deleteActivity = async (activityId: string) => {
  const response = await axiosTeacher.delete(`/actividades/${activityId}`);
  return response.data;
};
