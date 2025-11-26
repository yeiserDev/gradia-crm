'use client';

import { useEffect, useMemo, useRef } from 'react';
import { ArrowRight2, Award, Eye, Clock } from 'iconsax-react';
import type { Submission } from '@/lib/types/core/submission.model';
import { useAIEvaluationStatus } from '@/hooks/core/useAIEvaluationStatus';
import { toast } from 'sonner';

type StudentRowProps = {
  submission: Submission;
  index: number;
  onOpenAIGrade: () => void;
  onOpenManualGrade: () => void;
  onRequestRefresh?: () => void;
};

export default function StudentRow({
  submission,
  index,
  onOpenAIGrade,
  onOpenManualGrade,
  onRequestRefresh,
}: StudentRowProps) {
  const hasNotifiedRef = useRef(false);

  // Detectar si hay video en los attachments
  const hasVideo = submission.attachments?.some(a =>
    a.type === 'video' || a.type?.includes('video/')
  ) ?? false;

  // Usar hook de polling solo si hay video
  const { status: aiStatus, data: aiFeedback } = useAIEvaluationStatus(
    submission.id,
    hasVideo, // Solo hacer polling si hay video
    ['DOCENTE'] // Rol docente
  );

  // Mostrar notificación cuando la evaluación esté completa
  useEffect(() => {
    if (hasVideo && aiStatus === 'completed' && aiFeedback && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      toast.success('✅ Calificado por IA', {
        description: `${submission.studentName} - Nota: ${aiFeedback.nota_final.toFixed(2)}/20`,
        duration: 8000,
      });
      onRequestRefresh?.();
    }
  }, [hasVideo, aiStatus, aiFeedback, submission.studentName, onRequestRefresh]);

  // Reset notificación cuando cambia el estudiante
  useEffect(() => {
    hasNotifiedRef.current = false;
  }, [submission.id]);

  // Determinar si mostrar "Evaluando..."
  const isEvaluating = hasVideo && aiStatus === 'evaluating';

  const formattedGrade = useMemo(() => {
    const resolved =
      submission.grade ?? (aiFeedback ? aiFeedback.nota_final : null);

    if (resolved == null) return 'Sin nota';

    const numericValue =
      typeof resolved === 'number' ? resolved : parseFloat(resolved);

    if (Number.isNaN(numericValue)) return 'Sin nota';

    const gradeText = Number.isInteger(numericValue)
      ? `${numericValue}`
      : numericValue.toFixed(2);

    return `${gradeText}/20`;
  }, [submission.grade, aiFeedback]);

  return (
    <li className="px-5 py-3 flex items-center gap-3">
      <div className="w-7 text-[12px] text-[color:var(--muted)]">
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Avatar */}
      <img
        src={
          submission.avatarUrl ??
          `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(
            submission.studentName
          )}&backgroundColor=b6e3f4,c0aede,d1d4f9`
        }
        alt={submission.studentName}
        className="h-8 w-8 rounded-full"
      />

      <div className="min-w-0 flex-1">
        <div className="truncate font-medium text-[14px]">
          {submission.studentName}
        </div>
        {submission.submittedAt && (
          <div className="text-[12px] text-[color:var(--muted)]">
            {new Date(submission.submittedAt).toLocaleString('es-PE')}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Status Chip */}
        <StatusChip status={submission.status} isEvaluating={isEvaluating} />

        {/* Nota o "Evaluando..." */}
        {isEvaluating ? (
          <span className="inline-flex items-center gap-1.5 h-8 min-w-[110px] px-2 rounded-xl border border-amber-500/30 bg-amber-500/10 text-[13px] font-medium text-amber-600">
            <Clock size={14} className="animate-pulse" />
            Evaluando...
          </span>
        ) : (
          <span className="inline-grid place-items-center h-8 min-w-[80px] px-2 rounded-xl border border-[var(--border)] bg-[var(--section)] text-[13px] font-medium">
            {formattedGrade}
          </span>
        )}

        {/* Botón para ver evaluación de IA */}
        <button
          onClick={onOpenAIGrade}
          className="h-9 w-9 grid place-items-center rounded-xl border border-[var(--border)] hover:bg-[var(--brand)]/10 hover:border-[var(--brand)] transition-colors"
          title="Ver evaluación de IA"
        >
          <Eye size={18} color="var(--brand)" />
        </button>

        {/* Botón de calificación manual - SOLO SI NO HAY VIDEO */}
        {!hasVideo && (
          <button
            onClick={onOpenManualGrade}
            className="h-9 w-9 grid place-items-center rounded-xl border border-[var(--border)] hover:bg-[var(--section)] transition-colors"
            title="Revisar y calificar"
          >
            <ArrowRight2 size={18} color="var(--icon)" />
          </button>
        )}
      </div>
    </li>
  );
}

// Status chip con indicador de evaluación
function StatusChip({
  status,
  isEvaluating,
}: {
  status: Submission['status'];
  isEvaluating: boolean;
}) {
  if (isEvaluating) {
    return (
      <span className="inline-flex items-center gap-1 h-8 px-2 rounded-xl text-[13px] font-medium text-amber-600 bg-amber-500/10 border border-amber-500/30">
        <Clock size={16} className="animate-pulse" /> IA evaluando
      </span>
    );
  }

  if (status === 'SUBMITTED') {
    return (
      <span className="inline-flex items-center gap-1 h-8 px-2 rounded-xl text-[13px] font-medium text-white bg-[color:var(--accent-green)]">
        <Award size={16} color="#ffffff" /> Entregado
      </span>
    );
  }

  if (status === 'NOT_SUBMITTED') {
    return (
      <span className="inline-flex items-center gap-1 h-8 px-2 rounded-xl text-[13px] font-medium text-white bg-[color:var(--accent-red)]">
        <ArrowRight2 size={16} color="#ffffff" /> No entregó
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

  return null;
}
