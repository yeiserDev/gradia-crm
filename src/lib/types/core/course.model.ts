// src/lib/types/core/course.model.ts

// Tipo para una Tarea (simplificado)
export interface Task {
  id: string;
  title: string;
  dueAt?: string;
}

// Tipo para una Unidad (simplificado)
export interface Unit {
  id: string;
  title: string;
  tasks?: Task[];
}

// Tipo principal para un Curso (ahora incluye lo que el Card necesita)
export interface Course {
  id: string;
  title: string;
  career: string; // ¡El campo que faltaba!
  units?: Unit[]; // ¡El campo que faltaba!
  
  // (Otros campos que podríamos necesitar)
  description?: string;
  roleOnCourse?: 'DOCENTE' | 'ESTUDIANTE' | 'ADMIN';
  docente?: { // El componente 'CourseCard' lo espera
    name: string;
  };
}