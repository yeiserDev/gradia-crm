'use client';

import { useMemo, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// --- Tipos ---
import type { Course } from '@/lib/types/core/course.model';
import type { Role } from '@/lib/types/core/role.model';

// --- Componentes ---
import SidebarHeader from './SidebarHeader';
import SidebarActions from './SidebarActions';
import SidebarUnitList from './SidebarUnitList';
import SidebarSkeleton from './SidebarSkeleton';
import { NewUnitModal } from './NewUnitModal';
import NewTaskModal from '@/components/course/task/teacher/NewTaskModal';
import CourseStudentsModal from './CourseStudentsModal';

type Variant = 'rail' | 'embedded';

type Props = {
  course?: Course;
  role: Role;
  exitHref?: string;
  loading?: boolean;
  variant?: Variant;
};

export default function CourseSidebar({
  course,
  role,
  exitHref = '/dashboard/courses',
  loading,
  variant = 'rail',
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  // --- Unidad ---
  const [openUnitId, setOpenUnitId] = useState<string | null>(null);
  const [showNewUnitModal, setShowNewUnitModal] = useState(false);

  // --- Tarea ---
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | undefined>();

  // --- Estudiantes ---
  const [showStudentsModal, setShowStudentsModal] = useState(false);

  const firstUnitId = course?.units?.[0]?.id ?? null;
  const effectiveOpen = useMemo(
    () => openUnitId ?? firstUnitId,
    [openUnitId, firstUnitId]
  );



  
  // --- LISTENER: Crear Unidad ---
  useEffect(() => {
    const onOpenCreateUnit = () => {
      setShowNewUnitModal(true);
    };
    document.addEventListener('open-create-unit', onOpenCreateUnit);
    return () =>
      document.removeEventListener('open-create-unit', onOpenCreateUnit);
  }, []);

  // --- LISTENER: Crear / Editar Tarea ---
  useEffect(() => {
    const onOpenCreateTask = (e: Event) => {
      const ce = e as CustomEvent<{ taskId?: string }>;
      setEditTaskId(ce.detail?.taskId);
      setShowNewTaskModal(true);
    };
    document.addEventListener('open-create-task', onOpenCreateTask);
    return () =>
      document.removeEventListener('open-create-task', onOpenCreateTask);
  }, []);

  // --- LISTENER: Abrir Lista de Estudiantes ---
  useEffect(() => {
    const onOpenStudentsList = () => {
      setShowStudentsModal(true);
    };
    document.addEventListener('open-students-list', onOpenStudentsList);
    return () =>
      document.removeEventListener('open-students-list', onOpenStudentsList);
  }, []);

  // --- Emitir refresh de curso ---
  const handleUnitCreated = () => {
    document.dispatchEvent(new CustomEvent('refresh-course'));
  };

  // --- Estilos ---
  const common = 'overflow-y-auto py-4';

  const rail =
    'lg:sticky lg:top-[calc(var(--header-h)-1px)] ' +
    'lg:h-[calc(100vh-var(--header-h)+1px)] ' +
    'lg:pr-4 lg:mr-2 lg:border-r border-[var(--border)]';

  const embedded = 'border-b border-[var(--border)] lg:border-b-0';

  const asideClass = common + ' ' + (variant === 'rail' ? rail : embedded);

  // --- Loading ---
  if (loading) {
    return (
      <aside className={asideClass}>
        <SidebarSkeleton />
      </aside>
    );
  }

  // --- Sin curso ---
  if (!course) {
    return (
      <aside className={asideClass}>
        <div className="p-2 text-[13px] text-[color:var(--muted)]">
          No se encontró el curso.
        </div>
      </aside>
    );
  }


const handleSaveTaskModal = (data: {
  taskId: string;
  title: string;
  dueAt: string | null;
  description: string;
  mode: 'create' | 'update';
  unitId: string;
}) => {
  console.log('Tarea guardada desde modal:', data);

  // cerrar modal
  setShowNewTaskModal(false);

  // refrescar sidebar + curso
  document.dispatchEvent(new CustomEvent('refresh-course'));
};




  // --- Render principal ---
  return (
    <>
      <aside className={asideClass}>
        <SidebarHeader title={course.title} exitHref={exitHref} />

        {role === 'DOCENTE' && <SidebarActions />}

        <SidebarUnitList
          units={course.units || []}
          courseId={course.id}
          pathname={pathname}
          openUnitId={effectiveOpen}
          onToggle={(id) =>
            setOpenUnitId((prev) => (prev === id ? null : id))
          }
        />
      </aside>

      {/* ───────────────────────────────────── */}
      {/*   MODAL: Nueva Unidad (Docente)       */}
      {/* ───────────────────────────────────── */}
      {role === 'DOCENTE' && course && (
        <NewUnitModal
          isOpen={showNewUnitModal}
          onClose={() => setShowNewUnitModal(false)}
          courseId={course.id}
          onUnitCreated={handleUnitCreated}
        />
      )}

      {/* ───────────────────────────────────── */}
      {/*   MODAL: Nueva / Editar Tarea        */}
      {/* ───────────────────────────────────── */}
      {role === 'DOCENTE' && course && (
        <NewTaskModal
          open={showNewTaskModal}
          onClose={() => setShowNewTaskModal(false)}
          courseId={course.id}
          units={course.units ?? []}
          onSave={handleSaveTaskModal}
        />
      )}

      {/* ───────────────────────────────────── */}
      {/*   MODAL: Lista de Estudiantes        */}
      {/* ───────────────────────────────────── */}
      {role === 'DOCENTE' && course && (
        <CourseStudentsModal
          open={showStudentsModal}
          onClose={() => setShowStudentsModal(false)}
          courseId={course.id}
          courseTitle={course.title}
        />
      )}
    </>
  );
}
