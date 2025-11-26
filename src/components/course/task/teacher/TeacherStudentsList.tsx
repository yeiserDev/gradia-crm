'use client';

import { useMemo, useState } from 'react';
import { SearchNormal1 } from 'iconsax-react';

// --- 1. IMPORTACIONES CORREGIDAS ---
import type { Submission } from '@/lib/types/core/submission.model';
import { useTaskSubmissionsList } from '@/hooks/core/useTaskSubmissionsList';
import { useSaveGrade } from '@/hooks/core/useSaveGrade';

import StudentSubmissionModal from './StudentSubmissionModal';
import TeacherAIGradeModal from './TeacherAIGradeModal';
import StudentRow from './StudentRow';

export default function TeacherStudentsList({ taskId, courseId }: { taskId: string; courseId: string }) {

  // --- 2. HOOKS ACTUALIZADOS ---
  const { data, isLoading: loading, refetch } = useTaskSubmissionsList(taskId);
  const { saveGrade, isLoading: isSaving } = useSaveGrade(taskId);

  const [openId, setOpenId] = useState<string | null>(null);
  const [openAIGradeId, setOpenAIGradeId] = useState<string | null>(null);
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
            <StudentRow
              key={s.id}
              submission={s}
              index={i}
              onOpenAIGrade={() => setOpenAIGradeId(s.id)}
              onOpenManualGrade={() => setOpenId(s.id)}
              onRequestRefresh={() => {
                // Evitamos rechazos silenciosos si se llama varias veces
                void refetch();
              }}
            />
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

      {/* --- 7. MODAL DE EVALUACIÓN DE IA PARA DOCENTE --- */}
      {openAIGradeId && (
        <TeacherAIGradeModal
          submission={items.find((x) => x.id === openAIGradeId)!}
          onClose={() => setOpenAIGradeId(null)}
        />
      )}
    </section>
  );
}