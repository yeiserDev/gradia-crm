import { axiosTeacher } from '../config/axiosTeacher';

/**
 * Servicios para gestión de unidades (DOCENTE)
 * Conectados al backend de Teacher
 */

export type CreateUnitPayload = {
  id_curso: number;
  titulo_unidad: string;
  descripcion?: string;
  orden?: number;
};

export type UpdateUnitPayload = Partial<Omit<CreateUnitPayload, 'id_curso'>>;

/**
 * Obtiene todas las unidades
 */
export const getAllUnits = async () => {
  const response = await axiosTeacher.get('/unidades');
  return response.data;
};

/**
 * Obtiene una unidad específica por ID
 */
export const getUnitById = async (unitId: string) => {
  const response = await axiosTeacher.get(`/unidades/${unitId}`);
  return response.data;
};

/**
 * Obtiene todas las unidades de un curso
 */
export const getUnitsByCourse = async (courseId: string) => {
  const response = await axiosTeacher.get(`/cursos/${courseId}/unidades`);
  return response.data;
};

/**
 * Crea una nueva unidad
 */
export const createUnit = async (data: CreateUnitPayload) => {
  const response = await axiosTeacher.post('/unidades', data);
  return response.data;
};

/**
 * Actualiza una unidad existente
 */
export const updateUnit = async (unitId: string, data: UpdateUnitPayload) => {
  const response = await axiosTeacher.put(`/unidades/${unitId}`, data);
  return response.data;
};

/**
 * Elimina una unidad
 */
export const deleteUnit = async (unitId: string) => {
  const response = await axiosTeacher.delete(`/unidades/${unitId}`);
  return response.data;
};
