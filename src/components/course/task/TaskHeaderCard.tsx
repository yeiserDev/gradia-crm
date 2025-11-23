'use client';

import { useState } from 'react';
import { Book1, Calendar, Eye } from 'iconsax-react';
import GradeDetailModal from './notamodal/GradeDetailModal';

// --- 1. IMPORTAMOS EL TIPO 'Role' CORRECTO ---
import type { Role } from '@/lib/types/core/role.model';

// (Asumimos que estos tipos son locales o mocks temporales)
type RubricItem = { label: string; score: number; max: number; date?: string; };
type AIFeedback = {
  videoUrl?: string; overall?: string;
  bullets?: Array<{ text: string; at?: string }>;
  aspects?: Array<{ label: string; score: number; max: number }>;
};

const toGradeNumber = (grade: unknown): number | null => {
  if (typeof grade === 'number' && Number.isFinite(grade)) return grade;
  if (typeof grade === 'string') { const n = Number(grade); return Number.isFinite(n) ? n : null; }
  return null;
};

export default function TaskHeaderCard({
  // --- 2. CORRECCIÓN DEL VALOR POR DEFECTO ---
  role = 'ESTUDIANTE',
  title,
  dueAt,
  grade,
  eyebrow,
  dueHref,
  rubric,
  ai,
}: {
  // --- 3. CORRECCIÓN DEL TIPO DE PROP ---
  role?: Role; // 👈 Acepta 'DOCENTE', 'ESTUDIANTE', 'ADMIN'
  title: string;
  dueAt?: string | null;
  grade?: string | number | null;
  eyebrow?: string;
  dueHref?: string;
  rubric?: RubricItem[];
  ai?: AIFeedback;
}) {
  const [open, setOpen] = useState(false);

  const formattedDate = dueAt
    ? new Date(dueAt).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : 'Sin fecha';

  const gradeNum = toGradeNumber(grade);
  const displayedGrade = gradeNum == null ? '—' : String(gradeNum);
  
  // --- 4. CORRECCIÓN DE LA LÓGICA ---
  // Un 'ESTUDIANTE' es el único que debe ver su nota aquí.
  const isStudent = role === 'ESTUDIANTE';

  // (Estos son los mocks que el modal necesita)
  const rubricData: RubricItem[] = rubric ?? [
    { label: 'Resistencia (test de milla)', score: 4, max: 5, date: '13/03/2024' },
    { label: 'Estructura', score: 3, max: 5, date: '13/03/2024' },
    { label: 'Uso de lenguaje', score: 5, max: 5, date: '13/03/2024' },
    { label: 'Presentación', score: 4, max: 5, date: '13/03/2024' },
  ];
  const aiData: AIFeedback = ai ?? { overall: '—' };

  return (
    <>
      <section className="relative rounded-2xl border border-[var(--border)] bg-[var(--section)] px-5 py-4 overflow-visible">
        <div className="flex items-center justify-between gap-3">
          {/* ... (El H1 y el ícono de 'Book1' se quedan igual) ... */}
          <div className="min-w-0 flex items-center gap-3">
            <span className="inline-grid place-items-center h-8 w-8 rounded-lg bg-[var(--brand)]/10 text-[var(--brand)]">
              <Book1 size={18} color="currentColor" variant="Linear" />
            </span>
            <h1 className="truncate text-[16px] sm:text-[17px] font-medium text-[var(--fg)]">
              {title}
            </h1>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* ... (La fecha de entrega 'dueAt' se queda igual) ... */}
            <div className="hidden sm:flex items-center gap-2 text-[14px] text-[color:var(--muted)]">
              <Calendar size={18} color="currentColor" variant="Linear" />
              <span>Entrega:</span>
              {dueHref ? (
                <a href={dueHref} className="font-medium text-[var(--brand)] underline underline-offset-2">
                  {formattedDate}
                </a>
              ) : (
                <span className="font-medium text-[var(--brand)]">{formattedDate}</span>
              )}
            </div>

            {/* --- 5. LÓGICA DE RENDERIZADO CORREGIDA --- */}
            {/* Nota + Ver detalle SOLO para 'ESTUDIANTE' */}
            {isStudent && (
              <>
                
                <button
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[13px] hover:bg-[var(--section)] transition-colors"
                >
                  <Eye size={18} color="var(--icon)" />
                  Ver detalle
                </button>
              </>
            )}
          </div>
        </div>

        {/* ... (El 'eyebrow' se queda igual) ... */}
        {eyebrow && (
          <div className="absolute -top-3 -left-2 rotate-[-8deg]">
            <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-[3px] text-[12px]">
              <span className="h-2 w-2 rounded-full bg-[var(--brand)]/70" />
              <span className="font-medium text-[var(--fg)]">{eyebrow}</span>
            </div>
          </div>
        )}
      </section>

      {/* --- 6. LÓGICA DE MODAL CORREGIDA --- */}
      {isStudent && (
        <GradeDetailModal
          isOpen={open}
          onClose={() => setOpen(false)}
          grade={gradeNum}
          rubric={rubricData}
          ai={aiData}
        />
      )}
    </>
  );
}