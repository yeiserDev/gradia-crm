import { axiosStudent } from '../config/axiosStudent';
import { Course } from '../../types/core/course.model';

/**
 * Obtiene los cursos del estudiante autenticado desde la API real
 * El token JWT se incluye automáticamente via interceptor de axios
 */
export const getCourses = async (): Promise<Course[]> => {
  try {
    // 🔧 Llamada real al backend de Student
    const response = await axiosStudent.get('/cursos');

    if (!response.data.success) {
      throw new Error(response.data.message || 'Error al obtener cursos');
    }

    // Mapear la respuesta del backend al formato del frontend
    const cursosBackend = response.data.data || [];

    return cursosBackend.map((curso: {
      id_curso: number;
      nombre_curso: string;
      descripcion?: string;
      unidades?: Array<{
        id_unidad: number;
        titulo_unidad: string;
        actividades?: Array<{
          id_actividad: number;
          nombre_actividad: string;
          fecha_limite: string;
        }>;
      }>;
    }) => ({
      id: curso.id_curso.toString(),
      title: curso.nombre_curso,
      career: curso.descripcion || 'Sin descripción',
      units: curso.unidades?.map((unidad) => ({
        id: unidad.id_unidad.toString(),
        title: unidad.titulo_unidad,
        tasks: unidad.actividades?.map((act) => ({
          id: act.id_actividad.toString(),
          title: act.nombre_actividad,
          dueAt: act.fecha_limite
        })) || []
      })) || [],
      docente: { name: 'Docente' }
    }));
  } catch (error) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error('Error al obtener cursos:', error);
    throw new Error(err.response?.data?.message || 'Error al cargar cursos');
  }
};