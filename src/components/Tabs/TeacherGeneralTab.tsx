'use client';

// --- 1. ¡IMPORTACIONES CORREGIDAS! ---
import type { UiUser } from '@/lib/types/core/user.model'; // 👈 El nuevo tipo
import { useCourses } from '@/hooks/core/useCourses'; // 👈 El hook de Core

import SectionHeader from '@/components/dashboard/SectionHeader';
import CourseCard, { CourseCardSkeleton } from '@/components/dashboard/CourseCard';

// --- 2. TIPO DE PROP CORREGIDO ---
export default function TeacherGeneralTab({ user }: { user: UiUser }) {
  const first = user.name.split(' ')[0];
  
  // --- 3. ¡HOOK CORREGIDO! ---
  // 'useCourses' ya obtiene el user ID desde 'useAuth'
  const { courses, isLoading: loading } = useCourses();

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--section)] px-5 py-6">
        <h1 className="text-3xl font-medium">¡Hola, {first}! 👋</h1>
        <p className="text-[color:var(--muted)] text-[16px]">
          Vista de docente. Aquí verás tus cursos y actividades por revisar.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <SectionHeader title="Cursos que imparto" />
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {loading && (<><CourseCardSkeleton/><CourseCardSkeleton/><CourseCardSkeleton/></>)}
          
          {!loading && (courses ?? []).map((c) => {
            // --- 4. LÓGICA DE CONTEO CORREGIDA ---
            // (Igual a la que usamos en StudentGeneralTab)
            const units = c.units?.length ?? 0;
            const tasks = c.units?.reduce((acc, u) => acc + (u.tasks?.length ?? 0), 0) ?? 0;

            return (
              <CourseCard
                key={c.id}
                id={c.id}
                titulo={c.title}
                carrera={c.career}
                estadistica1={`${units} unidades`}
                estadistica2={`${tasks} tareas`} // 👈 CORREGIDO
                docente={user.name} // 👈 Esto es correcto
                progress={Math.min(100, Math.round(Math.random()*70)+20)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}