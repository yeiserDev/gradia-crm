'use client';

import { useMemo, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// --- 1. IMPORTACIONES CORREGIDAS ---
import type { Course } from '@/lib/types/core/course.model'; // 👈 Tipo de Curso
import type { Role } from '@/lib/types/core/role.model';   // 👈 Tipo de Rol (el nuevo)
// --- FIN DE IMPORTACIONES ---

import SidebarHeader from './SidebarHeader';
import SidebarActions from './SidebarActions';
import SidebarUnitList from './SidebarUnitList';
import SidebarSkeleton from './SidebarSkeleton';
import { NewUnitModal } from './NewUnitModal';

type Variant = 'rail' | 'embedded';

type Props = {
  course?: Course;
  role: Role; // 👈 Ahora usa el tipo 'Role' correcto
  exitHref?: string;
  loading?: boolean;
  /** * 'rail'    => sidebar fijo tipo rail (sticky a la izquierda)
   * 'embedded'=> columna dentro del grid
   */
  variant?: Variant;
};

export default function CourseSidebar({
  course,
  role, // 👈 Sigue siendo el string 'DOCENTE', 'ESTUDIANTE', etc.
  exitHref = '/dashboard/courses',
  loading,
  variant = 'rail', // 👈 valor por defecto
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [openUnitId, setOpenUnitId] = useState<string | null>(null);
  const [showNewUnitModal, setShowNewUnitModal] = useState(false);

  const firstUnitId = course?.units?.[0]?.id ?? null;
  const effectiveOpen = useMemo(
    () => openUnitId ?? firstUnitId,
    [openUnitId, firstUnitId]
  );

  // Listener para abrir modal de crear unidad
  useEffect(() => {
    const onOpenCreateUnit = () => {
      setShowNewUnitModal(true);
    };
    document.addEventListener('open-create-unit', onOpenCreateUnit);
    return () => document.removeEventListener('open-create-unit', onOpenCreateUnit);
  }, []);

  // Handler cuando se crea una nueva unidad
  const handleUnitCreated = () => {
    // Disparar evento para refrescar el curso en el layout
    document.dispatchEvent(new CustomEvent('refresh-course'));
  };

  // estilos base comunes
  const common = 'overflow-y-auto py-4'; // sin fondo gris

  // rail: sticky tomando alto de viewport menos header
  const rail =
    'lg:sticky lg:top-[calc(var(--header-h)-1px)] ' +
    'lg:h-[calc(100vh-var(--header-h)+1px)] ' +
    'lg:pr-4 lg:mr-2 lg:border-r border-[var(--border)]';

  // embedded: solo separador inferior en móvil
  const embedded = 'border-b border-[var(--border)] lg:border-b-0';

  const asideClass =
    common + ' ' + (variant === 'rail' ? rail : embedded);

  if (loading) {
    return (
      <aside className={asideClass}>
        <SidebarSkeleton />
      </aside>
    );
  }

  if (!course) {
    return (
      <aside className={asideClass}>
        <div className="p-2 text-[13px] text-[color:var(--muted)]">
          No se encontró el curso.
        </div>
      </aside>
    );
  }

  return (
    <>
      <aside className={asideClass}>
        <SidebarHeader title={course.title} exitHref={exitHref} />

        {role === 'DOCENTE' && <SidebarActions />}

        <SidebarUnitList
          // Si course.units es undefined, pasa un array vacío []
          units={course.units || []}
          courseId={course.id}
          pathname={pathname}
          openUnitId={effectiveOpen}
          onToggle={(id) => setOpenUnitId((prev) => (prev === id ? null : id))}
        />
      </aside>

      {/* Modal para crear nueva unidad (solo para docentes) */}
      {role === 'DOCENTE' && course && (
        <NewUnitModal
          isOpen={showNewUnitModal}
          onClose={() => setShowNewUnitModal(false)}
          courseId={course.id}
          onUnitCreated={handleUnitCreated}
        />
      )}
    </>
  );
}