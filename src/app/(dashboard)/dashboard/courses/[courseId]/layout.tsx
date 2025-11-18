'use client';

import { use } from 'react';
import { useMemo, useEffect } from 'react';
import CourseSidebar from '@/components/course/sidebar/CourseSidebar';
import { useAuth } from '@/context/AuthProvider';
import { useCourseDetails } from '@/hooks/core/useCourseDetails';

export default function CourseLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);

  // Obtener usuario autenticado
  const { user, isAuthenticated } = useAuth();

  // Determinar rol del usuario
  const userRole = useMemo(() => {
    if (!user || !user.roles) return 'ESTUDIANTE';
    if (user.roles.includes('DOCENTE')) return 'DOCENTE';
    if (user.roles.includes('ADMIN')) return 'ADMIN';
    return 'ESTUDIANTE';
  }, [user]);

  // Cargar curso real desde la API
  const { course, isLoading, error, refresh } = useCourseDetails(courseId, user?.roles);

  // Listener para refrescar el curso cuando se crea una unidad
  useEffect(() => {
    const handleRefreshCourse = () => {
      console.log('🔄 Refrescando curso...');
      refresh();
    };

    document.addEventListener('refresh-course', handleRefreshCourse);
    return () => document.removeEventListener('refresh-course', handleRefreshCourse);
  }, [refresh]);

  // Guarda de seguridad - después de los hooks
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] gap-6 px-4 lg:px-6">
      {/* Sidebar rail (fijo) */}
      <aside className="min-w-0">
        <CourseSidebar
          course={course || undefined}
          role={userRole}
          loading={isLoading}
        />
      </aside>

      {/* Contenido principal */}
      <main className="min-w-0">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
            <p className="font-semibold">Error al cargar el curso</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}