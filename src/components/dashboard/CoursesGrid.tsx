'use client';

// 1. IMPORTACIONES ACTUALIZADAS
import { useCourses } from '@/hooks/core/useCourses'; // 👈 El hook que creamos
import type { Course } from '@/lib/types/core/course.model'; // 👈 El tipo que creamos
import CourseCard, { CourseCardSkeleton } from './CourseCard';
// 'useCurrentUser' y 'listCoursesForUser' se eliminan

export default function CoursesGrid() {
  
  // 2. USAMOS EL NUEVO HOOK
  // Ya no necesitamos useState, useEffect, ni useCurrentUser
  const { courses, isLoading, isError } = useCourses();

  // 3. MANEJO DE ESTADO DE CARGA
  if (isLoading || !courses) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)}
      </div>
    );
  }

  // 4. MANEJO DE ERROR (opcional pero recomendado)
  if (isError) {
    return <div className="text-red-500">Error al cargar los cursos.</div>;
  }

  // 5. RENDERIZADO (usando los datos reales/simulados)
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((c) => {
        // La lógica de conteo ahora usa los tipos correctos
        const units = c.units?.length ?? 0;
        const tasks = c.units?.reduce((acc, u) => acc + (u.tasks?.length ?? 0), 0) ?? 0;
        
        return (
          <CourseCard
            key={c.id}
            id={c.id}
            titulo={c.title}
            carrera={c.career} // 👈 Ahora existe en nuestro tipo
            estadistica1={`${units} unidades`}
            estadistica2={`${tasks} actividades`}
            docente={c.docente?.name} // 👈 Ahora existe en nuestro tipo
            progress={Math.min(100, Math.round(Math.random() * 80 + 10))} // (Progress sigue siendo random)
          />
        );
      })}
    </div>
  );
}