import { axiosTeacher } from '../config/axiosTeacher';

/**
 * Payload para crear una nueva unidad
 */
export interface CreateUnitPayload {
  titulo_unidad: string;
  descripcion?: string;
  numero_unidad: number;
  id_curso: number;
}

/**
 * Respuesta del backend al crear una unidad
 */
export interface UnitResponse {
  id_unidad: number;
  titulo_unidad: string;
  descripcion: string | null;
  numero_unidad: number;
  id_curso: number;
  created_at: string;
  updated_at: string;
}

/**
 * Crea una nueva unidad en el backend
 * El token JWT se incluye automáticamente via interceptor en axiosTeacher
 *
 * @param data - Datos de la unidad a crear
 * @returns La unidad creada
 */
export const createUnit = async (data: CreateUnitPayload): Promise<UnitResponse> => {
  try {
    const response = await axiosTeacher.post('/unidades', data);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al crear unidad');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Error al crear unidad:', error);

    // Manejo de errores específicos del backend
    if (error.response?.status === 403) {
      throw new Error('No tienes permiso para crear unidades en este curso');
    }

    if (error.response?.status === 400) {
      throw new Error(error.response.data.message || 'Datos inválidos para crear la unidad');
    }

    throw new Error(error.response?.data?.message || 'Error al crear unidad');
  }
};

/**
 * Obtiene todas las unidades de un curso
 *
 * @param cursoId - ID del curso
 * @returns Array de unidades
 */
export const getUnitsByCourse = async (cursoId: string): Promise<UnitResponse[]> => {
  try {
    const response = await axiosTeacher.get(`/unidades/curso/${cursoId}`);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al obtener unidades');
    }

    return response.data.data || [];
  } catch (error: any) {
    console.error('Error al obtener unidades:', error);
    throw new Error(error.response?.data?.message || 'Error al cargar unidades');
  }
};

/**
 * Actualiza una unidad existente
 *
 * @param unitId - ID de la unidad
 * @param data - Datos a actualizar
 * @returns La unidad actualizada
 */
export const updateUnit = async (
  unitId: string,
  data: Partial<CreateUnitPayload>
): Promise<UnitResponse> => {
  try {
    const response = await axiosTeacher.put(`/unidades/${unitId}`, data);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al actualizar unidad');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('Error al actualizar unidad:', error);
    throw new Error(error.response?.data?.message || 'Error al actualizar unidad');
  }
};

/**
 * Elimina una unidad (solo si no tiene actividades asociadas)
 *
 * @param unitId - ID de la unidad
 */
export const deleteUnit = async (unitId: string): Promise<void> => {
  try {
    const response = await axiosTeacher.delete(`/unidades/${unitId}`);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al eliminar unidad');
    }
  } catch (error: any) {
    console.error('Error al eliminar unidad:', error);

    if (error.response?.status === 400) {
      throw new Error('No se puede eliminar una unidad con actividades asociadas');
    }

    throw new Error(error.response?.data?.message || 'Error al eliminar unidad');
  }
};
