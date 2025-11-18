import { axiosTeacher } from '../config/axiosTeacher';

/**
 * Servicios para gestión de cursos (DOCENTE)
 * Conectados al backend de Teacher
 */

export type CreateCoursePayload = {
  nombre_curso: string;
  descripcion?: string;
  codigo_curso?: string;
};

export type UpdateCoursePayload = Partial<CreateCoursePayload>;

/**
 * Obtiene todos los cursos del docente autenticado
 */
export const getTeacherCourses = async () => {
  const response = await axiosTeacher.get('/cursos');
  return response.data;
};

/**
 * Obtiene un curso específico por ID
 */
export const getCourseById = async (courseId: string) => {
  const response = await axiosTeacher.get(`/cursos/${courseId}`);
  return response.data;
};

/**
 * Crea un nuevo curso
 */
export const createCourse = async (data: CreateCoursePayload) => {
  const response = await axiosTeacher.post('/cursos', data);
  return response.data;
};

/**
 * Actualiza un curso existente
 */
export const updateCourse = async (courseId: string, data: UpdateCoursePayload) => {
  const response = await axiosTeacher.put(`/cursos/${courseId}`, data);
  return response.data;
};

/**
 * Elimina un curso
 */
export const deleteCourse = async (courseId: string) => {
  const response = await axiosTeacher.delete(`/cursos/${courseId}`);
  return response.data;
};
