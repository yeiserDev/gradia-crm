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

    return cursosBackend.map((curso: any) => ({
      id: curso.id_curso.toString(),
      title: curso.nombre_curso,
      career: curso.descripcion || 'Sin descripción',
      units: curso.unidades?.map((unidad: any) => ({
        id: unidad.id_unidad.toString(),
        title: unidad.titulo_unidad,
        tasks: unidad.actividades?.map((act: any) => ({
          id: act.id_actividad.toString(),
          title: act.nombre_actividad,
          dueAt: act.fecha_limite
        })) || []
      })) || [],
      docente: { name: 'Docente' } // TODO: Agregar info del docente desde backend
    }));
  } catch (error: any) {
    console.error('Error al obtener cursos:', error);
    throw new Error(error.response?.data?.message || 'Error al cargar cursos');
  }
};