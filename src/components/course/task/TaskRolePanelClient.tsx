// src/components/course/task/TaskRolePanelClient.tsx
'use client';

import { useEffect, useState } from 'react';

import type { Role } from '@/lib/types/core/role.model';
import type { TaskSubmission } from '@/lib/types/core/submission.model';
import type { Resource } from '@/hooks/core/useTaskResources';

import { useTaskDetails } from '@/hooks/core/useTaskDetails';
import { useSaveTask } from '@/hooks/core/useSaveTask';
import { useTaskResources } from '@/hooks/core/useTaskResources';

import TaskHeaderCard from './TaskHeaderCard';
import TaskDescription from './pieces/TaskDescription';
import TaskResources from './pieces/TaskResources';
import TaskSubmissionBox from './student/TaskSubmissionBox';
import TaskComments from './pieces/TaskComments';
import TeacherStudentsList from './teacher/TeacherStudentsList';
import AddResourceModal from './teacher/AddResourceModal';

export default function TaskRolePanelClient({
  role,
  courseId,
  taskId,
}: {
  role: Role;
  courseId: string;
  taskId: string;
}) {
  const { data: task, isLoading: loadingTask } = useTaskDetails(taskId);

  const {
    resources,
    loading: loadingResources,
    addResource,
    removeResource,
  } = useTaskResources(taskId);

  const { saveTask, isLoading: isSaving } = useSaveTask();

  const [openAdd, setOpenAdd] = useState(false);

  const loading = loadingTask || loadingResources;

  /** Guardar descripción */
  const handleSaveDescription = async (next: string) => {
    if (!task || isSaving) return;
    try {
      await saveTask({
        taskId: task.id,
        data: {
          title: task.title,
          dueAt: task.dueAt,
          description: next,
        },
      });
    } catch (err) {
      console.error('Error al guardar descripción:', err);
      alert('Error al guardar descripción');
    }
  };

  /** Añadir recurso */
  const handleAddResource = async (r: {
    title: string;
    type: Resource['type'];
    url: string;
    size?: string;
  }) => {
    try {
      await addResource(r);
    } catch (err) {
      console.error('Error al añadir recurso:', err);
      alert('Error al añadir recurso');
    }
  };

  /** Eliminar recurso */
  const handleRemoveResource = async (id: string) => {
    try {
      await removeResource(id);
    } catch (err) {
      console.error('Error al quitar recurso:', err);
      alert('Error al quitar recurso');
    }
  };

  if (loading)
    return (
      <div className="h-48 animate-pulse bg-[var(--section)] rounded-2xl" />
    );

  if (!task) return <div>No se encontró la tarea.</div>;

  return (
    <div className="relative z-0">
      <div className="border-t border-[var(--border)] -mt-[1px]" />

      {/* ===================================================== */}
      {/* 1️⃣ HEADER ARRIBA — FULL WIDTH */}
      {/* ===================================================== */}
      <div className="mt-4 mb-6">
        <TaskHeaderCard
          role={role}
          eyebrow={'Módulo 1 (Simulado)'}
          title={task.title}
          dueAt={task.dueAt ?? undefined}
        />
      </div>

      {/* ===================================================== */}
      {/* 2️⃣ CUERPO — 2 COLUMNAS */}
      {/* ===================================================== */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ➤ COLUMNA IZQUIERDA */}
        <div className="flex-1 space-y-6 min-w-0 lg:pr-4">
          
          {/* Lista de estudiantes (solo docente) */}
          {role === 'DOCENTE' && (
            <TeacherStudentsList taskId={taskId} courseId={courseId} />
          )}

          {/* Descripción */}
          <TaskDescription
            role={role}
            description={task.description ?? ''}
            onViewRubric={() => alert('Rúbrica próximamente')}
            onSaveDescription={
              role === 'DOCENTE' ? handleSaveDescription : undefined
            }
          />
        </div>

        {/* ➤ COLUMNA DERECHA */}
        <div className="w-full lg:w-[280px] shrink-0 space-y-6">
          {/* Entrega (solo estudiante) */}
          {role === 'ESTUDIANTE' && (
            <TaskSubmissionBox
              taskId={taskId}
              onSubmitted={(sub: TaskSubmission) => {
                alert(`Tarea ${sub.id} entregada!`);
              }}
            />
          )}

          {/* Recursos */}
          <TaskResources
            role={role}
            resources={resources}
            onDownloadAll={() => alert('Descarga no implementada')}
            onAddResource={role === 'DOCENTE' ? () => setOpenAdd(true) : undefined}
            onRemoveResource={role === 'DOCENTE' ? handleRemoveResource : undefined}
          />
        </div>
      </div>

      {/* ===================================================== */}
      {/* 3️⃣ COMENTARIOS — FULL WIDTH ABAJO DE TODO */}
      {/* ===================================================== */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">Comentarios</h2>
        <TaskComments taskId={taskId} role={role} />
      </div>

      {/* Modal */}
      <AddResourceModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAddResource}
      />
    </div>
  );
}
