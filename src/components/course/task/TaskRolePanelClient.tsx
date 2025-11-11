// src/components/course/task/TaskRolePanelClient.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

// --- 1. IMPORTACIONES ACTUALIZADAS ---
import type { Role } from '@/lib/types/core/role.model';
import type { TaskSubmission } from '@/lib/types/core/submission.model';
import type { Resource } from '@/hooks/core/useTaskResources'; // Importamos el tipo Resource del hook

// Hooks de nuestra nueva arquitectura
import { useTaskDetails } from '@/hooks/core/useTaskDetails';
import { useSaveTask } from '@/hooks/core/useSaveTask';
import { useTaskResources } from '@/hooks/core/useTaskResources';

// (Se eliminan todas las importaciones de mocks y tipos antiguos)

// Componentes hijos (estos no cambian)
import TaskHeaderCard from './TaskHeaderCard';
import TaskDescription from './pieces/TaskDescription';
import TaskResources from './pieces/TaskResources';
import TaskSubmissionBox from './student/TaskSubmissionBox';
import TaskComments from './pieces/TaskComments'; // Asumiendo que esta es la ruta correcta
import TeacherStudentsList from './teacher/TeacherStudentsList';
import NewTaskModal from './teacher/NewTaskModal';
import AddResourceModal from './teacher/AddResourceModal';

export default function TaskRolePanelClient({
  role, // 👈 Ahora acepta 'DOCENTE', 'ESTUDIANTE', 'ADMIN'
  courseId,
  taskId,
}: {
  role: Role; // 👈 TIPO ACTUALIZADO
  courseId: string;
  taskId: string;
}) {
  
  // --- 2. USAMOS LOS NUEVOS HOOKS ---
  const { 
    data: task, 
    isLoading: loadingTask 
  } = useTaskDetails(taskId);
  
  const { 
    resources, 
    loading: loadingResources, 
    addResource, 
    removeResource 
  } = useTaskResources(taskId);
  
  const { 
    saveTask, 
    isLoading: isSaving 
  } = useSaveTask();
  
  // Estados de UI (sin cambios)
  const [openAdd, setOpenAdd] = useState(false);
  const [openNewTask, setOpenNewTask] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | undefined>(undefined);
  const [tab, setTab] = useState<'task' | 'comments'>('task');
  
  // Event listener para el modal (sin cambios)
  useEffect(() => {
    const onOpen = (e: Event) => {
      const ce = e as CustomEvent<{ taskId?: string }>;
      setEditTaskId(ce.detail?.taskId);
      setOpenNewTask(true);
    };
    document.addEventListener('open-create-task', onOpen as EventListener);
    return () => document.removeEventListener('open-create-task', onOpen as EventListener);
  }, []);

  const loading = loadingTask || loadingResources;

  // --- 3. HANDLERS ACTUALIZADOS (usan los hooks) ---
  
  /** Guarda la descripción actualizada */
  const handleSaveDescription = async (next: string) => {
    if (!task || isSaving) return;
    try {
      // 'saveTask' espera el payload completo
      await saveTask({
        taskId: task.id,
        data: {
          title: task.title, 
          dueAt: task.dueAt,
          description: next, // Solo actualizamos la descripción
        }
      });
      // La caché de 'useTaskDetails' se invalidará automáticamente
    } catch (err) {
      console.error("Error al guardar descripción:", err);
      alert("Error al guardar descripción");
    }
  };

  /** Añade un nuevo recurso */
  const handleAddResource = async (r: { title: string; type: Resource['type']; url: string; size?: string }) => {
    try {
      await addResource(r); // El hook simulado maneja la lógica
    } catch (err) {
      console.error("Error al añadir recurso:", err);
      alert("Error al añadir recurso");
    }
  };

  /** Elimina un recurso */
  const handleRemoveResource = async (id: string) => {
    try {
      await removeResource(id); // El hook simulado maneja la lógica
    } catch (err) {
      console.error("Error al quitar recurso:", err);
      alert("Error al quitar recurso");
    }
  };
  
  /** Se llama cuando el Modal de Nueva/Editar Tarea se guarda */
  const handleSaveTaskModal = (res: { 
    taskId: string; 
    title: string; 
    dueAt: string | null; 
    description: string; 
  }) => {
    // El hook 'useSaveTask' (usado por el modal) ya invalidó la caché
    // de 'useTaskDetails', por lo que los datos de 'task' se
    // refrescarán automáticamente. No necesitamos hacer nada más.
    console.log("Tarea guardada desde modal:", res);
  };
  
  // --- 4. RENDERIZADO ---
  
  // Muestra el loader si los detalles o los recursos están cargando
  if (loading) return <div className="h-48 animate-pulse bg-[var(--section)] rounded-2xl" />;
  
  // Muestra error si la tarea no cargó
  if (!task) return <div>No se encontró la tarea.</div>;

  // Header (vive dentro del tab "Tarea")
  const Header = (
    <TaskHeaderCard
      role={role} // 👈 Pasa el rol correcto
      eyebrow={"Módulo 1 (Simulado)"} // Usamos un fallback
      title={task.title}
      dueAt={task.dueAt ?? undefined}
      grade={undefined} // (Este dato no lo tenemos en TaskDetail, viene de Submission)
    />
  );

  return (
    <div className="relative z-0">
      {/* Línea superior (sin cambios) */}
      <div className="border-t border-[var(--border)] -mt-[1px]" />

      {/* Barra de tabs (sin cambios) */}
      <div className="flex items-end gap-2 pt-3">
        <TabButton active={tab === 'task'} onClick={() => setTab('task')}>
          Tarea
        </TabButton>
        <TabButton active={tab === 'comments'} onClick={() => setTab('comments')}>
          Comentarios
        </TabButton>
        <div className="flex-1 border-b border-[var(--border)] translate-y-[1px]" />
      </div>

      {/* Contenido del tab */}
      {tab === 'task' ? (
        <div className="mt-4 flex flex-col lg:flex-row gap-6">
          {/* Columna central */}
          <div className="flex-1 space-y-6 lg:pr-4 min-w-0">
            {Header}

            {/* --- 5. LÓGICA DE ROL CORREGIDA --- */}
            {role === 'DOCENTE' && (
              <TeacherStudentsList taskId={taskId} courseId={courseId} />
            )}

            <TaskDescription
              role={role} // 👈 Pasa el rol correcto
              description={task.description ?? ''}
              onViewRubric={() => alert('Rúbrica próximamente')}
              onSaveDescription={role === 'DOCENTE' ? handleSaveDescription : undefined}
            />
          </div>

          {/* Columna derecha */}
          <div className="w-full lg:w-[280px] shrink-0 space-y-6">
            {/* --- 6. LÓGICA DE ROL CORREGIDA --- */}
            {role === 'ESTUDIANTE' && (
              <TaskSubmissionBox 
                taskId={taskId} 
                onSubmitted={(sub: TaskSubmission) => {
                  alert(`Tarea ${sub.id} entregada!`);
                  // Aquí podrías invalidar la caché de la entrega del estudiante
                }} 
              />
            )}

            <TaskResources
              role={role} // 👈 Pasa el rol correcto
              resources={resources} // 👈 Usamos los recursos del hook
              onDownloadAll={() => alert("Descarga no implementada")}
              onAddResource={role === 'DOCENTE' ? () => setOpenAdd(true) : undefined}
              onRemoveResource={role === 'DOCENTE' ? handleRemoveResource : undefined}
            />
          </div>
        </div>
      ) : (
        // Tab: Comentarios
        <div className="mt-4">
          <TaskComments taskId={taskId} role={role} />
        </div>
      )}

      {/* Modales (sin cambios) */}
      <AddResourceModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAddResource}
      />

      <NewTaskModal
        open={openNewTask}
        onClose={() => setOpenNewTask(false)}
        courseId={courseId}
        defaultTaskId={editTaskId}
        onSave={handleSaveTaskModal}
      />
    </div>
  );
}

/* Botón de tab (sin cambios) */
function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'h-10 px-4 rounded-t-xl text-[13px] font-medium',
        'border border-b-0',
        active
          ? 'bg-[var(--card)] border-[var(--border)] text-black dark:text-white'
          : 'bg-[var(--section)] border-[var(--border)] text-black/80 dark:text-white/85 hover:bg-[var(--card)]',
      ].join(' ')}
      style={{ transform: 'translateY(1px)' }} // hace que el borde inferior se funda con la línea
    >
      {children}
    </button>
  );
}