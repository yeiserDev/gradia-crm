// src/components/course/task/TaskRolePanelClient.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { Role } from '@/lib/types/core/role.model';
import type { Resource } from '@/hooks/core/useTaskResources';

import { useTaskDetails } from '@/hooks/core/useTaskDetails';
import { useSaveTask } from '@/hooks/core/useSaveTask';
import { useTaskResources } from '@/hooks/core/useTaskResources';
import { useMySubmission } from '@/hooks/core/useMySubmission';
import { useAIFeedback } from '@/hooks/core/useAIFeedback';

import TaskHeaderCard from './TaskHeaderCard';
import TaskDescription from './pieces/TaskDescription';
import TaskSubmissionBox from './student/TaskSubmissionBox';
import MySubmissionDisplay from './student/MySubmissionDisplay';
import TaskResources from './pieces/TaskResources';
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
  const queryClient = useQueryClient();
  const { data: task, isLoading: loadingTask } = useTaskDetails(taskId);

  const {
    resources,
    loading: loadingResources,
    addResource,
    removeResource,
  } = useTaskResources(taskId);

  const hasRubricResource = useMemo(
    () =>
      resources?.some((res) =>
        res.title?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes('rubrica')
      ) ?? false,
    [resources]
  );

  const { saveTask, isLoading: isSaving } = useSaveTask();
  const { data: mySubmission } = useMySubmission(taskId, role === 'ESTUDIANTE');

  // Obtener retroalimentación de IA usando el ID de la entrega
  const { data: aiFeedback, isLoading: isLoadingAI } = useAIFeedback(
    mySubmission?.id_entrega
  );

  // Refetch agresivo de AI feedback cuando la calificación cambia
  useEffect(() => {
    if (mySubmission?.calificacion != null && mySubmission?.id_entrega) {
      // Refetch inmediato (no solo invalidar) para obtener datos frescos de Elasticsearch
      void queryClient.refetchQueries({ queryKey: ['ai-feedback', mySubmission.id_entrega] });
    }
  }, [mySubmission?.calificacion, mySubmission?.id_entrega, queryClient]);

  const [openAdd, setOpenAdd] = useState(false);

  const loading = loadingTask || loadingResources;

  const handleSaveDescription = async (next: string) => {
    if (!task || isSaving) return;
    await saveTask({
      taskId: task.id,
      data: { title: task.title, dueAt: task.dueAt, description: next },
    }).catch(() => alert('Error al guardar descripción'));
  };

  const handleAddResource = async (file: File) => {
    try {
      await addResource(file);
      toast.success('Recurso añadido exitosamente', {
        description: `Se ha subido ${file.name} correctamente`,
        duration: 3000,
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('No se pudo subir el archivo');
      toast.error('Error al añadir recurso', {
        description: err.message,
        duration: 4000,
      });
    }
  };

  const handleRemoveResource = async (id: string) => {
    await removeResource(id).catch(() => alert('Error al quitar recurso'));
  };

  const handleDownloadAll = async (items: Resource[]) => {
    try {
      for (const item of items) {
        const response = await fetch(item.url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.title;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        await new Promise(res => setTimeout(res, 400));
      }
    } catch {
      alert('Error al descargar algunos recursos');
    }
  };

  if (loading)
    return <div className="h-48 animate-pulse bg-[var(--section)] rounded-2xl" />;
  if (!task) return <div>No se encontró la tarea.</div>;

  return (
    <div className="relative z-0 pt-4">
      <div className="pt-4" />

      {/* ================================ */}
      {/* 1️⃣ HEADER FULL WIDTH */}
      {/* ================================ */}
      <div className="mt-4 mb-6">
        <TaskHeaderCard
          role={role}
          eyebrow="Módulo 1 (Simulado)"
          title={task.title}
          dueAt={task.dueAt ?? undefined}
          grade={aiFeedback?.nota_final ?? mySubmission?.calificacion ?? undefined}
          manualGrade={mySubmission?.calificacion ?? undefined}
          manualFeedback={mySubmission?.retroalimentacion ?? undefined}
          hasVideo={mySubmission?.archivos?.some(f => f.tipo_archivo.includes('video')) ?? false}
          ai={aiFeedback ? {
            videoUrl: mySubmission?.archivos?.find(f => f.tipo_archivo.includes('video'))?.url_archivo,
            retroalimentacion_final: aiFeedback.retroalimentacion_final,
            nota_final: aiFeedback.nota_final,
            notas_por_criterio: aiFeedback.notas_por_criterio,
            retroalimentaciones_por_criterio: aiFeedback.retroalimentaciones_por_criterio,
          } : undefined}
          onViewDetail={async () => {
            // Refetch de datos antes de abrir el modal para asegurar datos frescos
            if (mySubmission?.id_entrega) {
              await queryClient.refetchQueries({ queryKey: ['ai-feedback', mySubmission.id_entrega] });
            }
          }}
        />
      </div>

      {/* ================================ */}
      {/* 2️⃣ CONTENIDO — FULL WIDTH PARA DOCENTE */}
      {/* ================================ */}

      {role === 'DOCENTE' ? (
        <div className="space-y-6">

          <TeacherStudentsList taskId={taskId} courseId={courseId} />

          <TaskDescription
            role={role}
            description={task.description ?? ''}
            onViewRubric={() => alert('Rúbrica próximamente')}
            onSaveDescription={handleSaveDescription}
          />
        </div>
      ) : (
        /* ================================ */
        /* 2️⃣ ESTUDIANTE — DOS COLUMNAS */
        /* ================================ */
        <div className="flex flex-col lg:flex-row gap-6">
          {/* IZQUIERDA */}
          <div className="flex-1 space-y-6 min-w-0 lg:pr-4">
            <TaskDescription
              role={role}
              description={task.description ?? ''}
              onViewRubric={() => alert('Rúbrica próximamente')}
            />
          </div>

          {/* DERECHA */}
          <div className="w-full lg:w-[280px] shrink-0 space-y-6">
            {/* Mostrar la entrega si ya existe */}
            <MySubmissionDisplay taskId={taskId} />

            {/* Mostrar el formulario de subida solo si NO hay entrega */}
            {!mySubmission && (
              <TaskSubmissionBox
                taskId={taskId}
                onSubmitted={async () => {
                  // Refetch inmediato (más agresivo que invalidate)
                  await queryClient.refetchQueries({ queryKey: ['my-submission', taskId] });

                  // También invalidar para asegurar
                  queryClient.invalidateQueries({ queryKey: ['taskDetails', taskId] });

                  // Mostrar notificación de éxito
                  toast.success('¡Tarea enviada exitosamente!', {
                    description: 'Tu tarea ha sido entregada correctamente',
                    duration: 4000,
                  });
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* ================================ */}
      {/* 3️⃣ RESOURCES FULL WIDTH */}
      {/* ================================ */}
      <div className="mt-10">
        <TaskResources
          role={role}
          resources={resources}
          onDownloadAll={handleDownloadAll}
          onAddResource={role === 'DOCENTE' ? () => setOpenAdd(true) : undefined}
          onRemoveResource={role === 'DOCENTE' ? handleRemoveResource : undefined}
        />
      </div>

      {/* ================================ */}
      {/* 4️⃣ COMENTARIOS FULL WIDTH */}
      {/* ================================ */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">Comentarios</h2>
        <TaskComments taskId={taskId} role={role} />
      </div>

      {/* Modal Recursos */}
      <AddResourceModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={handleAddResource}
        hasRubricUploaded={hasRubricResource}
      />
    </div>
  );
}