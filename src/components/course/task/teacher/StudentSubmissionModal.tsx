'use client';

import Portal from '@/components/ui/Portal';
import {
  CloseCircle,
  DocumentText,
  PlayCircle,
  Link1,
  TickCircle,
} from 'iconsax-react';
import { useEffect, useState } from 'react';

// --- ¡IMPORTACIONES CORREGIDAS! ---
import type {
  Submission,
  Attach, // 👈 Ahora importa 'Attach' de nuestro nuevo archivo
} from '@/lib/types/core/submission.model';
// --- FIN DE IMPORTACIONES ---


export default function StudentSubmissionModal({
  taskId,
  submission,
  onClose,
  onSave,
}: {
  taskId: string;
  submission: Submission; // 👈 Ahora usa el tipo 'Submission' correcto
  onClose: () => void;
  onSave: (grade?: number, feedback?: string) => void;
}) {
  // Detectar si hay video - NO PERMITIR CALIFICACIÓN MANUAL
  const hasVideo = submission.attachments?.some(a =>
    a.type === 'video' || a.type?.includes('video/')
  ) ?? false;

  const [grade, setGrade] = useState<string>(
    submission.grade?.toString() ?? ''
  );
  const [feedback, setFeedback] = useState<string>(
    submission.feedback ?? ''
  );

  // UX: bloquear scroll + Escape (sin cambios)
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const gNum = grade.trim() === '' ? undefined : Number(grade);
  const canSave =
    !hasVideo && (gNum == null || (!Number.isNaN(gNum) && gNum >= 0 && gNum <= 20));

  return (
    <Portal>
      <div className="fixed inset-0 z-[300]">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative z-[310] grid place-items-center h-full p-4">
          <div className="w-[min(760px,96vw)] rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-xl">
            
            {/* Header (sin cambios) */}
            <div className="px-5 py-4 border-b border-[var(--border)] bg-[var(--brand)]/10 flex items-center justify-between">
              <div>
                <div className="text-[15px] font-semibold">
                  Revisión — {submission.studentName}
                </div>
                <div className="text-[12.5px] text-[color:var(--muted)] mt-[2px]">
                  Tarea: <b>{taskId}</b> · Entregado:{' '}
                  {submission.submittedAt
                    ? new Date(submission.submittedAt).toLocaleString('es-PE')
                    : '—'}
                </div>
              </div>
              <button
                className="p-1.5 rounded-xl hover:bg-[var(--brand)]/15"
                title="Cerrar"
                onClick={onClose}
              >
                <CloseCircle size={20} color="var(--brand)" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 grid md:grid-cols-2 gap-5">
              {/* ADVERTENCIA SI HAY VIDEO */}
              {hasVideo && (
                <div className="md:col-span-2 rounded-xl border-2 border-amber-500 bg-amber-50 dark:bg-amber-900/20 p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">🤖</div>
                    <div className="flex-1">
                      <h4 className="text-[14px] font-semibold text-amber-900 dark:text-amber-200 mb-1">
                        Video siendo evaluado por IA
                      </h4>
                      <p className="text-[13px] text-amber-800 dark:text-amber-300">
                        Este estudiante subió un video y está siendo evaluado automáticamente por Gradia.
                        Solo puedes calificar entregas que <strong>no incluyan video</strong>.
                        Para ver la evaluación de IA, usa el botón <strong>&quot;👁️ Ver evaluación de IA&quot;</strong> en la lista.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Adjuntos */}
              <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <h4 className="text-[14px] font-semibold mb-3">Adjuntos</h4>
                {submission.attachments?.length ? (
                  <ul className="space-y-2">
                    {submission.attachments!.map((a) => (
                      <li
                        key={a.id}
                        className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--section)] px-3 py-2"
                      >
                        <div className="h-9 w-9 grid place-items-center rounded-lg bg-[var(--brand)]/10 text-[var(--brand)]">
                          {iconFor(a.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-medium">
                            {a.title}
                          </p>
                          <p className="text-[12px] text-[color:var(--muted)]">
                            {label(a.type)}
                          </p>
                        </div>
                        {a.type === 'video' ? (
                          <div className="text-[12px] text-[color:var(--muted)] text-right max-w-[140px]">
                            <div className="font-medium text-[var(--brand)]">🤖 Gradia evaluando...</div>
                            <div className="text-[11px] mt-0.5">Video en proceso de calificación por IA</div>
                          </div>
                        ) : (
                          <a
                            href={a.url}
                            target="_blank"
                            className="text-[13px] underline underline-offset-2 text-[var(--brand)]"
                          >
                            Abrir
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[13px] text-[color:var(--muted)]">
                    Sin adjuntos.
                  </p>
                )}
              </section>

              {/* Calificación */}
              <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <h4 className="text-[14px] font-semibold mb-3">Calificación</h4>
                <label className="text-[13px] font-medium">
                  Nota (0 – 20)
                  <input
                    disabled={hasVideo}
                    className={`mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--section)] px-3 text-[14px] focus:outline-none focus:border-[var(--brand)] ${
                      hasVideo ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    inputMode="numeric"
                    placeholder={hasVideo ? 'No disponible para videos' : 'Ej: 16'}
                    value={grade}
                    onChange={(e) =>
                      setGrade(e.target.value.replace(',', '.'))
                    }
                  />
                </label>
                <label className="block text-[13px] font-medium mt-3">
                  Feedback
                  <textarea
                    disabled={hasVideo}
                    rows={5}
                    className={`mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--section)] px-3 py-2 text-[14px] focus:outline-none focus:border-[var(--brand)] ${
                      hasVideo ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    placeholder={hasVideo ? 'No disponible para videos' : 'Comentarios para el estudiante…'}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </label>
              </section>
            </div>

            {/* Footer (sin cambios) */}
            <div className="px-5 py-4 border-t border-[var(--border)] bg-[var(--card)] flex justify-end gap-2">
              <button
                onClick={onClose}
                className="h-9 px-4 rounded-xl text-[13px] bg-[var(--section)] hover:bg-[var(--border)]"
              >
                Cancelar
              </button>
              <button
                disabled={!canSave}
                onClick={() =>
                  onSave(gNum, feedback.trim() || undefined)
                }
                className="h-9 px-4 inline-flex items-center gap-2 rounded-xl text-white text-[13px] bg-[var(--accent-green)] hover:bg-[var(--accent-green)]/90 disabled:opacity-50"
              >
                <TickCircle size={18} color="#fff" />
                Guardar nota
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}

/* ---------- Helpers (sin cambios) ---------- */
// El tipo 'Attach' ahora se importa correctamente,
// por lo que 'AttachType' funciona.
type AttachType = Attach['type'];

function iconFor(t: AttachType) {
  switch (t) {
    case 'pdf':
    case 'document':
    case 'slide':
      return <DocumentText size={18} color="currentColor" />;
    case 'video':
      return <PlayCircle size={18} color="currentColor" />;
    case 'link':
      return <Link1 size={18} color="currentColor" />;
    default:
      return <DocumentText size={18} color="currentColor" />;
  }
}

function label(t: AttachType) {
  switch (t) {
    case 'pdf':
      return 'PDF';
    case 'document':
      return 'Documento';
    case 'slide':
      return 'Presentación';
    case 'video':
      return 'Video';
    case 'link':
      return 'Enlace';
  }
}