import { axiosStudent } from '../config/axiosStudent';
import { axiosTeacher } from '../config/axiosTeacher';
import { Course } from '../../types/core/course.model';

/**
 * Obtiene los cursos del usuario autenticado desde la API correspondiente según su rol
 * El token JWT se incluye automáticamente via interceptor de axios
 * @param userRoles - Roles del usuario autenticado para determinar qué backend usar
 */
export const getCourses = async (userRoles?: string[]): Promise<Course[]> => {
  try {
    // 🔧 Determinar qué backend usar según el rol del usuario
    const isTeacherOrAdmin = userRoles?.some(role => ['DOCENTE', 'ADMIN'].includes(role));

    // TEMPORAL: Usar siempre el backend Teacher para ambos roles
    // porque el backend Student podría no tener los endpoints implementados
    const axios = axiosTeacher;
    const endpoint = '/cursos';

    console.log(`🔍 Obteniendo cursos - Usuario: ${isTeacherOrAdmin ? 'TEACHER' : 'STUDENT'} - Backend: TEACHER - Endpoint: ${endpoint}`);

    // Llamada al backend correspondiente
    const response = await axios.get(endpoint);

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