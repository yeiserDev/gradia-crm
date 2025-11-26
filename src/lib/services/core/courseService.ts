import { axiosStudent } from '../config/axiosStudent';
import { axiosTeacher } from '../config/axiosTeacher';
import { Course } from '../../types/core/course.model';
import { getUnitsByCourse } from './unitService';

/**
 * Obtiene un curso específico por ID con todas sus unidades y actividades
 * @param courseId - ID del curso
 * @param userRoles - Roles del usuario para determinar qué backend usar
 */
export const getCourseById = async (
  courseId: string,
  userRoles?: string[]
): Promise<Course> => {
  try {
    // TEMPORAL: Usar siempre el backend Teacher para ambos roles
    // porque el backend Student podría no tener los endpoints implementados
    const isTeacherOrAdmin = userRoles?.some(role => ['DOCENTE', 'ADMIN'].includes(role));

    // Por ahora, siempre usar axiosTeacher para lectura de datos
    // Los estudiantes tienen acceso de solo lectura a través del mismo backend
    const axios = axiosTeacher;

    console.log(`🔍 Obteniendo curso ${courseId} - Usuario: ${isTeacherOrAdmin ? 'TEACHER' : 'STUDENT'} - Backend: TEACHER`);

    // 1. Obtener datos básicos del curso
    const cursoResponse = await axios.get(`/cursos/${courseId}`);

    if (!cursoResponse.data.success) {
      throw new Error(cursoResponse.data.message || 'Error al obtener curso');
    }

    const cursoData = cursoResponse.data.data;

    // 2. Obtener unidades del curso
    type UnidadBackend = {
      id_unidad: number;
      titulo_unidad: string;
      descripcion?: string;
      numero_unidad: number;
      id_curso: number;
    };
    let unidades: UnidadBackend[] = [];
    try {
      const unidadesResponse = await axios.get(`/unidades/curso/${courseId}`);
      if (unidadesResponse.data.success) {
        unidades = unidadesResponse.data.data || [];
      }
    } catch (error) {
      console.warn('No se pudieron cargar las unidades:', error);
      unidades = [];
    }

    // 3. Para cada unidad, obtener sus actividades
    type ActividadBackend = {
      id_actividad: number;
      titulo_actividad?: string;
      nombre_actividad?: string;
      fecha_vencimiento?: string;
      fecha_limite?: string;
    };
    const unidadesConActividades = await Promise.all(
      unidades.map(async (unidad) => {
        let actividades: ActividadBackend[] = [];
        try {
          const actividadesResponse = await axios.get(`/actividades/unidad/${unidad.id_unidad}`);
          if (actividadesResponse.data.success) {
            actividades = actividadesResponse.data.data || [];
          }
        } catch (error) {
          console.warn(`No se pudieron cargar actividades de unidad ${unidad.id_unidad}:`, error);
          actividades = [];
        }

        return {
          ...unidad,
          actividades
        };
      })
    );

    // 4. Mapear al formato del frontend
    const course: Course = {
      id: cursoData.id_curso.toString(),
      title: cursoData.nombre_curso || cursoData.titulo_curso || 'Curso sin nombre',
      career: cursoData.descripcion || cursoData.carrera || 'Sin descripción',
      description: cursoData.descripcion,
      units: unidadesConActividades
        .sort((a, b) => (a.numero_unidad || 0) - (b.numero_unidad || 0))
        .map((unidad) => ({
          id: unidad.id_unidad.toString(),
          title: unidad.titulo_unidad,
          descripcion: unidad.descripcion,
          numero_unidad: unidad.numero_unidad,
          id_curso: unidad.id_curso,
          tasks: (unidad.actividades || [])
            .map((actividad: ActividadBackend) => ({
              id: actividad.id_actividad.toString(),
              title: actividad.titulo_actividad || actividad.nombre_actividad,
              dueAt: actividad.fecha_vencimiento || actividad.fecha_limite
            }))
        })),
      docente: {
        name: cursoData.docente?.nombre || 'Docente'
      }
    };

    console.log(`✅ Curso cargado: ${course.title} con ${course.units?.length || 0} unidades`);

    return course;
  } catch (error) {
    const err = error as { response?: { data?: { message?: string } } };
    console.error('Error al obtener curso por ID:', error);
    throw new Error(err.response?.data?.message || 'Error al cargar el curso');
  }
};

/**
 * Obtiene solo las unidades de un curso (útil para refrescar después de crear una unidad)
 * @param courseId - ID del curso
 * @param userRoles - Roles del usuario
 */
export const refreshCourseUnits = async (
  courseId: string,
  userRoles?: string[]
): Promise<Course['units']> => {
  try {
    // Usar siempre axiosTeacher para lectura (estudiantes tienen acceso de solo lectura)
    const axios = axiosTeacher;

    const unidadesResponse = await axios.get(`/unidades/curso/${courseId}`);

    if (!unidadesResponse.data.success) {
      throw new Error('Error al obtener unidades');
    }

    const unidades = unidadesResponse.data.data || [];

    // Para cada unidad, obtener sus actividades
    type ActividadBackend = {
      id_actividad: number;
      titulo_actividad?: string;
      nombre_actividad?: string;
      fecha_vencimiento?: string;
      fecha_limite?: string;
    };
    type UnidadBackend = {
      id_unidad: number;
      titulo_unidad: string;
      descripcion?: string;
      numero_unidad: number;
      id_curso: number;
    };
    const unidadesConActividades = await Promise.all(
      unidades.map(async (unidad: UnidadBackend) => {
        let actividades: ActividadBackend[] = [];
        try {
          const actividadesResponse = await axios.get(`/actividades/unidad/${unidad.id_unidad}`);
          if (actividadesResponse.data.success) {
            actividades = actividadesResponse.data.data || [];
          }
        } catch (error) {
          actividades = [];
        }

        return {
          id: unidad.id_unidad.toString(),
          title: unidad.titulo_unidad,
          descripcion: unidad.descripcion,
          numero_unidad: unidad.numero_unidad,
          id_curso: unidad.id_curso,
          tasks: (actividades || []).map((actividad: ActividadBackend) => ({
            id: actividad.id_actividad.toString(),
            title: actividad.titulo_actividad || actividad.nombre_actividad,
            dueAt: actividad.fecha_vencimiento || actividad.fecha_limite
          }))
        };
      })
    );

    return unidadesConActividades.sort(
      (a, b) => (a.numero_unidad || 0) - (b.numero_unidad || 0)
    );
  } catch (error) {
    console.error('Error al refrescar unidades:', error);
    throw error;
  }
};
