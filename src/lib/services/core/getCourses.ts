import { axiosCore } from '../config/axiosCore';
import { Course } from '../../types/core/course.model';

// --- DATOS SIMULADOS (TEMPORALES) ---
// (Reemplazaremos esto con una llamada real cuando el Core esté listo)
const MOCK_COURSES: Course[] = [
  {
    id: 'crs-1',
    title: 'Ingeniería de Software I',
    career: 'Ing. de Software',
    units: [
      { id: 'u1', title: 'Introducción', tasks: [{ id: 't1', title: 'Tarea 1' }] },
      { id: 'u2', title: 'Requisitos', tasks: [{ id: 't2', title: 'Tarea 2' }, { id: 't3', title: 'Tarea 3' }] },
    ],
    docente: { name: 'Dr. Alan Brito' }
  },
  {
    id: 'crs-2',
    title: 'Bases de Datos Avanzadas',
    career: 'Ing. de Sistemas',
    units: [
      { id: 'u3', title: 'Modelo E-R', tasks: [{ id: 't4', title: 'Foro 1' }] },
      { id: 'u4', title: 'Normalización', tasks: [] },
      { id: 'u5', title: 'SQL', tasks: [{ id: 't5', title: 'Examen 1' }] },
    ],
    docente: { name: 'Dra. Elsa Pato' }
  },
];
// --- FIN DE DATOS SIMULADOS ---

/**
 * Simula la obtención de cursos para un usuario.
 * (En el futuro, esto hará una llamada real: `axiosCore.get('/courses')`)
 * * @param userId - El ID del usuario (lo usaremos en el futuro)
 */
export const getCourses = (userId: number): Promise<Course[]> => {
  console.log(`Simulando fetch de cursos para el usuario: ${userId}`);
  
  // Simulamos un retraso de red de 1 segundo
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_COURSES);
    }, 1000);
  });
};