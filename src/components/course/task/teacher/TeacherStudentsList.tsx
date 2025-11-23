'use client';

import { useMemo, useState } from 'react';
import { ArrowRight2, TickCircle, CloseCircle, SearchNormal1, NoteRemove, Award } from 'iconsax-react';

// --- 1. IMPORTACIONES CORREGIDAS ---
import type { Submission } from '@/lib/types/core/submission.model';
import { useTaskSubmissionsList } from '@/hooks/core/useTaskSubmissionsList';
import { useSaveGrade } from '@/hooks/core/useSaveGrade';
// (Se eliminan los mocks 'listForTeacher', 'upsertGrade', etc.)

import StudentSubmissionModal from './StudentSubmissionModal';

export default function TeacherStudentsList({ taskId, courseId }: { taskId: string; courseId: string }) {

  // --- 2. HOOKS ACTUALIZADOS ---
  const { data, isLoading: loading } = useTaskSubmissionsList(taskId);
  const { saveGrade, isLoading: isSaving } = useSaveGrade(taskId);

  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  // (El 'useEffect' para cargar se elimina, useQuery lo maneja)

  const items = data || []; // Aseguramos que 'items' sea un array

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((s) => s.studentName.toLowerCase().includes(q));
  }, [items, query]);


  // --- 3. FUNCIÓN 'onSaved' ACTUALIZADA ---
  // Ahora llama a la mutación de nuestro hook
  const onSaved = (subId: string, grade?: number, feedback?: string) => {
    saveGrade({ submissionId: subId, grade, feedback });
  };

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      {/* Header (sin cambios) */}
      <header className="px-5 py-4 flex flex-wrap items-center gap-3 justify-between">
        <h3 className="text-[15px] font-semibold">Lista de estudiantes</h3>
        <div className="relative">
          <input
            placeholder="Buscar estudiante…"
            className="h-9 w-[180px] md:w-[220px] rounded-xl border border-[var(--border)] bg-[var(--section)] pl-9 pr-3 text-[13px] focus:outline-none focus:border-[var(--brand)]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SearchNormal1 size={16} color="var(--muted)" className="absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </header>

      <hr className="border-[var(--border)]" />

      {/* --- 4. LISTA (RENDERIZADO) --- */}
      {loading ? (
        <div className="p-5 text-[13px] text-[color:var(--muted)]">Cargando…</div>
      ) : filtered.length === 0 ? (
        <div className="p-5 text-[13px] text-[color:var(--muted)]">Sin estudiantes.</div>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {filtered.map((s, i) => (
            <li key={s.id} className="px-5 py-3 flex items-center gap-3">
              <div className="w-7 text-[12px] text-[color:var(--muted)]">{String(i + 1).padStart(2, '0')}</div>

              {/* Avatar (ahora usa 'avatarUrl' o el fallback) */}
              <img
                src={s.avatarUrl ?? `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(s.studentName)}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                alt={s.studentName}
                className="h-8 w-8 rounded-full"
              />

              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-[14px]">{s.studentName}</div>
                {s.submittedAt && (
                  <div className="text-[12px] text-[color:var(--muted)]">
                    {new Date(s.submittedAt).toLocaleString('es-PE')}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* 5. USA EL 'StatusChip' ACTUALIZADO */}
                <StatusChip status={s.status} />

                <span className="inline-grid place-items-center h-8 min-w-[80px] px-2 rounded-xl border border-[var(--border)] bg-[var(--section)] text-[13px] font-medium">
                  {s.grade == null ? 'Sin nota' : `${s.grade}/20`}
                </span>

                <button
                  onClick={() => setOpenId(s.id)}
                  className="h-9 w-9 grid place-items-center rounded-xl border border-[var(--border)] hover:bg-[var(--section)]"
                  title="Revisar y calificar"
                >
                  <ArrowRight2 size={18} color="var(--icon)" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* --- 6. MODAL (sin cambios, ahora funciona) --- */}
      {openId && (
        <StudentSubmissionModal
          taskId={taskId}
          submission={items.find((x) => x.id === openId)!} // 'items' viene de useQuery
          onClose={() => setOpenId(null)}
          onSave={(g, fb) => {
            onSaved(openId, g, fb); // Llama a nuestra nueva función
            setOpenId(null);
          }}
        />
      )}
    </section>
  );
}

// --- 7. 'StatusChip' ACTUALIZADO ---
// Ahora acepta los tipos de status de nuestra API
function StatusChip({ status }: { status: Submission['status'] }) {
  if (status === 'SUBMITTED') {
    return (
      <span className="inline-flex items-center gap-1 h-8 px-2 rounded-xl text-[13px] font-medium text-white bg-[color:var(--accent-green)]">
        <TickCircle size={16} color="#ffffff" /> Entregado
      </span>
    );
  }
  if (status === 'NOT_SUBMITTED') {
    return (
      <span className="inline-flex items-center gap-1 h-8 px-2 rounded-xl text-[13px] font-medium text-white bg-[color:var(--accent-red)]">
        <CloseCircle size={16} color="#ffffff" /> No entregó
      </span>
    );
  }
  if (status === 'GRADED') {
    return (
      <span className="inline-flex items-center gap-1 h-8 px-2 rounded-xl text-[13px] font-medium text-[color:var(--fg)] bg-[var(--section)] border border-[var(--border)]">
        <Award size={16} color="currentColor" /> Calificado
      </span>
    );
  }
  return null; // Por si acaso
}