// src/lib/services/mock/courses.mock.ts
import { Course } from '@/lib/types/core/course.model';
import { Role } from '@/lib/types/core/role.model'; // Importamos el tipo Role

/**
 * Esto es un placeholder temporal.
 * Devuelve un curso simulado basado en el ID y el Rol.
 */
export const makeMockCourse = (
  courseId: string, 
  userRole: Role // Usamos el tipo Role
): Course => {
  
  // Devuelve un objeto de curso simulado
  return {
    id: courseId,
    title: `Curso Simulado ${courseId.toUpperCase()}`,
    description: `Esta es una descripción simulada para el curso. El usuario es ${userRole}.`,
    roleOnCourse: userRole,
    
    // --- 1. ¡CORRECCIÓN! ---
    // La propiedad se llama 'units', no 'modules'.
    units: [
      { 
        id: 'm1', 
        title: 'Módulo 1: Introducción (Simulado)', 
        tasks: [
          { id: 't1', title: 'Tarea Simulada 1', dueAt: new Date().toISOString() }
        ] 
      },
      { id: 'm2', title: 'Módulo 2: Desarrollo (Simulado)', tasks: [] },
    ],
    
    // --- 2. ¡CORRECCIÓN! ---
    // El tipo 'Course' requiere la propiedad 'career'.
    career: 'Carrera de Prueba',
    
    // (Opcional, pero bueno para que el mock sea completo)
    docente: {
      name: 'Docente Simulado'
    }
  };
};