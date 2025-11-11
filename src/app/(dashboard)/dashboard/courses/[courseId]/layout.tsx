'use client';

import { use } from 'react';
import { useMemo } from 'react';
import CourseSidebar from '@/components/course/sidebar/CourseSidebar';
import { makeMockCourse } from '@/lib/services/mock/courses.mock';
import { useAuth } from '@/context/AuthProvider';

export default function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  
  // 2. USAMOS EL NUEVO HOOK
  const { user, isAuthenticated } = useAuth(); // 👈 AÑADIDO
  // const user = useCurrentUser(); // 👈 ELIMINADO

  // 3. GUARDA DE SEGURIDAD
  // Si no está logueado o el usuario aún no carga, no renderiza nada.
  if (!isAuthenticated || !user) {
    return null; 
  }

  // 4. ADAPTAMOS EL ROL
  // 'user.roles' es un array (ej. ["DOCENTE"])
  // 'makeMockCourse' y 'CourseSidebar' esperan un string (ej. "DOCENTE")
  const userRole = useMemo(() => {
    if (user.roles.includes('DOCENTE')) return 'DOCENTE';
    if (user.roles.includes('ADMIN')) return 'ADMIN';
    return 'ESTUDIANTE'; // Rol por defecto
  }, [user.roles]); // La dependencia ahora es el array de roles

  // 5. El mock y el sidebar ahora usan el 'userRole' adaptado
  const course = useMemo(() => makeMockCourse(courseId, userRole), [courseId, userRole]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6 px-4 lg:px-6">
      {/* Sidebar rail (fijo) */}
      <aside className="min-w-0">
        <CourseSidebar course={course} role={userRole} />
      </aside>

      {/* Contenido principal */}
      <main className="min-w-0 ">
        {children}
      </main>
    </div>
  );
}