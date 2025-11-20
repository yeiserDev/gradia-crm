'use client';

import { TaskSquare, Calendar } from 'iconsax-react';
import Image from 'next/image';

import type { UiUser } from '@/lib/types/core/user.model';
import { useCourses } from '@/hooks/core/useCourses';

import CourseCard, { CourseCardSkeleton } from '@/components/dashboard/CourseCard';
import SectionHeader from '@/components/dashboard/SectionHeader';
import RightAgendaRail from '@/components/dashboard/rightside/RightAgendaRail';

export default function StudentGeneralTab({ user }: { user: UiUser }) {
  const firstName = user.name.split(' ')[0];
  const { courses, isLoading: loading } = useCourses();

  return (
    <div className="grid items-start gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_320px]">
      {/* Columna izquierda */}
      <div className="min-w-0 space-y-6 lg:space-y-8">

        {/* BIENVENIDA PREMIUM – CON TU NUEVO GRADIENTE */}
        <section className="relative rounded-2xl border border-[var(--border)] bg-[var(--section)] px-4 py-4 sm:px-6 sm:py-6 overflow-hidden">

          {/* GRADIENTE NUEVO: #30E3CA → #7DE69D */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#30E3CA]/0 via-[#7DE69D]/25 to-[#30E3CA]/20 pointer-events-none" />
          
          {/* Imagen de la graduada en la esquina inferior derecha */}
          <div className="absolute right-0 bottom-0 w-48 sm:w-64 opacity-65 pointer-events-none">
            <Image
              src="/dashboard/graduate1.png"
              alt="Estudiante exitosa"
              width={420}
              height={520}
              className="drop-shadow-2xl"
              priority
            />
          </div>

          <div className="relative z-10 grid gap-4 sm:gap-6 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <h1 className="font-medium leading-tight text-[clamp(22px,3vw,32px)]">
                ¡Bienvenido {firstName}👋!
              </h1>
              <p className="mt-4 text-sm sm:text-base font-light text-[var(--fg)]/80 leading-relaxed max-w-xl">
                Estudia, retroalimenta y aprende las competencias para que seas un profesional con éxito
              </p>
            </div>

            {/* Métricas en escritorio */}
            <div className="hidden md:col-span-5 md:grid md:grid-cols-2 md:gap-4">
              <MetricCard 
                icon={<TaskSquare size={24} color="#30E3CA" />} 
                value={7} 
                label="Tareas pendientes" 
                wide 
              />
              <MetricCard 
                icon={<Calendar size={24} color="#7DE69D" />} 
                value={2} 
                label="Próximos plazos" 
                wide 
              />
            </div>

            {/* Métricas en móvil – scroll horizontal */}
            <div className="md:hidden -mx-4 px-4">
              <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
                <MetricCard 
                  icon={<TaskSquare size={22} color="#30E3CA" />} 
                  value={7} 
                  label="Tareas pendientes" 
                />
                <MetricCard 
                  icon={<Calendar size={22} color="#7DE69D" />} 
                  value={2} 
                  label="Próximos plazos" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Cursos en proceso */}
        <div className="space-y-4 sm:space-y-6">
          <SectionHeader title="Tus cursos en proceso" href="/cursos?view=all" />
          
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {loading && (
              <>
                <CourseCardSkeleton />
                <CourseCardSkeleton />
                <CourseCardSkeleton />
              </>
            )}

            {!loading && (courses?.length ?? 0) === 0 && (
              <div className="text-[13px] text-[color:var(--muted)] col-span-full text-center py-12">
                Aún no tienes cursos asignados.
              </div>
            )}

            {!loading && courses?.map((c) => {
              const units = c.units?.length ?? 0;
              const tasks = c.units?.reduce((acc, u) => acc + (u.tasks?.length ?? 0), 0) ?? 0;
              
              return (
                <CourseCard
                  key={c.id}
                  id={c.id}
                  titulo={c.title}
                  carrera={c.career}
                  estadistica1={`${units} unidades`}
                  estadistica2={`${tasks} tareas`}
                  progress={Math.min(100, Math.round(Math.random() * 70) + 20)}
                  docente={c.docente?.name}
                />
              );
            })}
          </div>
        </div>
      </div>

      <RightAgendaRail />
    </div>
  );
}

// TU MetricCard ORIGINAL – SIN CAMBIOS
function MetricCard({
  icon, value, label, wide = false,
}: { icon: React.ReactNode; value: number | string; label: string; wide?: boolean; }) {
  return (
    <div className={[
      wide ? 'w-full' : 'w-[180px] sm:w-[200px]',
      'h-[120px] snap-center flex-shrink-0 flex flex-col items-center justify-center gap-1.5',
      'rounded-2xl border bg-[var(--card)] border-[var(--border)] shadow-sm px-5 hover:shadow-md transition text-center',
    ].join(' ')}>
      <div className="grid place-items-center w-9 h-9 rounded-full border border-[var(--border)] bg-[var(--section)]">
        {icon}
      </div>
      <div className="text-[clamp(18px,2.4vw,20px)] font-bold leading-none">{value}</div>
      <div className="text-[13px] sm:text-[14px] text-[color:var(--muted)] whitespace-nowrap">
        {label}
      </div>
    </div>
  );
}