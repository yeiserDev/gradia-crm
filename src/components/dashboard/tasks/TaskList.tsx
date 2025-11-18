'use client';
// 1. ¡IMPORTACIÓN CORREGIDA!
import type { TaskSummary } from '@/lib/types/core/task.model'; 
import Link from 'next/link';
import { ArrowRight3 } from 'iconsax-react';

export default function TaskList({ tasks }: { tasks: TaskSummary[] }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="p-3 border-b border-[var(--border)] text-[13px] font-medium">Tareas pendientes</div>
      
      {/* 2. (Opcional pero recomendado) Manejo de "no hay tareas" */}
      {tasks.length === 0 ? (
        <div className="p-3 text-sm text-[color:var(--muted)]">
          No tienes tareas pendientes.
        </div>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {tasks.map(t => (
            <li key={t.id} className="p-3 flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-medium truncate">{t.title}</div>
                <div className="text-[12px] text-[color:var(--muted)] truncate">
                  {t.courseTitle} • vence {new Date(t.dueAt).toLocaleDateString()}
                </div>
              </div>
              
              {/* 3. ¡LINK CORREGIDO! Usa 't.courseId' */}
              <Link
                href={`/dashboard/courses/${t.courseId}/task/${t.id}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] hover:bg-[var(--section)]"
              >
                <ArrowRight3 size={18} color="var(--icon)" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// 4. (Opcional) Esqueleto para el estado de carga
// El componente padre necesitará esto
export const TaskListSkeleton = () => {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="p-3 border-b border-[var(--border)] text-[13px] font-medium">Tareas pendientes</div>
      <div className="divide-y divide-[var(--border)] animate-pulse">
        {[...Array(3)].map((_, i) => (
          <li key={i} className="p-3 flex items-center gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 bg-[var(--border)] rounded w-3/4"></div>
              <div className="h-3 bg-[var(--border)] rounded w-1/2"></div>
            </div>
            <div className="h-8 w-8 rounded-full border border-[var(--border)]"></div>
          </li>
        ))}
      </div>
    </div>
  );
};