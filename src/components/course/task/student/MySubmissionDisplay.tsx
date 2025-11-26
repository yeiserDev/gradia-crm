'use client';

import { useEffect, useMemo, useState } from 'react';
import { DocumentDownload, TickCircle, Document, DocumentText, Clock, PlayCircle, Eye } from 'iconsax-react';
import { useMySubmission } from '@/hooks/core/useMySubmission';
import { useAIEvaluationStatus } from '@/hooks/core/useAIEvaluationStatus';
type SubmissionAttachment = {
  id_archivo_entrega: number;
  nombre_archivo: string;
  tipo_archivo: string;
  url_archivo: string;
};

export default function MySubmissionDisplay({ taskId }: { taskId: string }) {
  const { data: submission, isLoading, refetch } = useMySubmission(taskId);
  const [previewFile, setPreviewFile] = useState<SubmissionAttachment | null>(null);

  // Detectar si hay video en la entrega
  const hasVideo = submission?.archivos?.some(f => f.tipo_archivo.includes('video')) ?? false;

  // Activar polling solo si hay video
  const { status: aiStatus, data: aiFeedback } = useAIEvaluationStatus(
    submission?.id_entrega,
    hasVideo // Solo hacer polling si hay video
  );

  // Cuando la IA califica y aún no tenemos nota persistida, refrescar entrega
  useEffect(() => {
    if (!submission?.calificacion && hasVideo && aiStatus === 'completed' && aiFeedback) {
      void refetch();
    }
  }, [submission?.calificacion, hasVideo, aiStatus, aiFeedback, refetch]);

  const finalGrade = useMemo(() => {
    const grade = submission?.calificacion ?? aiFeedback?.nota_final ?? null;
    if (grade == null) return null;
    const numeric = typeof grade === 'number' ? grade : parseFloat(String(grade));
    if (Number.isNaN(numeric)) return null;
    return Number.isInteger(numeric) ? `${numeric}` : numeric.toFixed(2);
  }, [submission?.calificacion, aiFeedback]);

  // Debug log
  console.log('📊 [MySubmissionDisplay] Submission data:', submission);

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="h-32 animate-pulse bg-[var(--section)] rounded-lg" />
      </section>
    );
  }

  if (!submission) {
    return null; // No mostrar nada si no hay entrega
  }

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <TickCircle size={20} className="text-green-500" />
        <h3 className="font-semibold text-[15px]">Tu entrega</h3>
      </div>

      {/* Fecha de entrega */}
      <div className="text-[13px] text-[color:var(--muted)] mb-4">
        Entregado el {new Date(submission.fecha_entrega).toLocaleString('es-PE', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })}
      </div>

      {/* Estado de evaluación de IA (si hay video) */}
      {hasVideo && aiStatus === 'evaluating' && (
        <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-amber-600 animate-pulse" />
            <div className="text-[13px] font-medium text-amber-700">🤖 Gradia evaluando...</div>
          </div>
          <div className="text-[12px] text-amber-600">
            Tu video está siendo evaluado por IA. Recibirás una notificación cuando esté listo.
          </div>
        </div>
      )}

      {/* Calificación */}
      <div className="mb-4 p-3 rounded-lg bg-[var(--section)] border border-[var(--border)]">
        <div className="text-[13px] text-[color:var(--muted)] mb-1 flex items-center gap-2">
          Calificación
          {hasVideo && aiStatus === 'evaluating' && (
            <span className="inline-flex items-center gap-1 text-[11px] px-2 py-[2px] rounded-full bg-amber-500/15 text-amber-700 border border-amber-500/30">
              <Clock size={12} className="animate-pulse" />
              IA evaluando
            </span>
          )}
        </div>
        <div className="text-[20px] font-semibold">
          {finalGrade ? `${finalGrade}/20` : 'Sin nota'}
        </div>
        {submission.retroalimentacion && (
          <div className="mt-2 text-[13px]">{submission.retroalimentacion}</div>
        )}
      </div>

      {/* Archivos entregados */}
      {submission.archivos.length > 0 && (
        <div>
          <div className="text-[13px] font-medium text-[color:var(--muted)] mb-2">
            Archivos adjuntos ({submission.archivos.length})
          </div>
          <ul className="space-y-2">
            {submission.archivos.map((archivo) => (
              <li
                key={archivo.id_archivo_entrega}
                className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--section)] px-3 py-2"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid place-items-center h-9 w-9 rounded-md bg-blue-500/10 text-blue-600">
                    {archivo.tipo_archivo.includes('video') ? (
                      <PlayCircle size={18} />
                    ) : archivo.tipo_archivo.includes('pdf') ? (
                      <DocumentText size={18} />
                    ) : (
                      <Document size={18} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-[14px]">{archivo.nombre_archivo}</div>
                    <div className="text-[12px] text-[color:var(--muted)]">
                      {archivo.tipo_archivo}
                    </div>
                  </div>
                </div>
                <a
                  href={archivo.url_archivo}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="grid place-items-center h-9 w-9 min-w-[36px] rounded-lg border border-[var(--border)] hover:bg-[var(--card)]"
                  aria-label="Descargar archivo"
                  title="Descargar archivo"
                >
                  <DocumentDownload size={18} color="currentColor" />
                </a>
                <button
                  onClick={() => setPreviewFile(archivo)}
                  className="grid place-items-center h-9 w-9 min-w-[36px] rounded-lg border border-[var(--border)] hover:bg-[var(--card)]"
                  aria-label="Ver archivo"
                  title="Ver archivo"
                >
                  <Eye size={18} color="currentColor" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {previewFile && (
        <AttachmentPreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </section>
  );
}

function AttachmentPreviewModal({
  file,
  onClose,
}: {
  file: {
    nombre_archivo: string;
    tipo_archivo: string;
    url_archivo: string;
  };
  onClose: () => void;
}) {
  const isVideo = file.tipo_archivo?.includes('video');
  const isPdf = file.tipo_archivo?.includes('pdf');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[min(640px,92vw)] h-[min(480px,80vh)] bg-[var(--card)] rounded-2xl shadow-2xl overflow-hidden border border-[var(--border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
          <div>
            <div className="font-semibold text-[15px] truncate max-w-[360px]">{file.nombre_archivo}</div>
            <div className="text-[12px] text-[color:var(--muted)]">{file.tipo_archivo}</div>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 inline-grid place-items-center rounded-xl hover:bg-[var(--section)] transition-colors"
            aria-label="Cerrar vista previa"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        <div className="h-[calc(100%-57px)] bg-[var(--section)] grid place-items-center p-3">
          {isVideo ? (
            <video
              src={file.url_archivo}
              controls
              className="w-full h-full rounded-lg"
            />
          ) : isPdf ? (
            <iframe
              src={file.url_archivo}
              className="w-full h-full rounded-lg border-0"
              title={file.nombre_archivo}
            />
          ) : (
            <div className="text-center space-y-3">
              <Document size={48} color="var(--muted)" />
              <p className="text-[13px] text-[color:var(--muted)]">
                Vista previa no disponible. Puedes descargar el archivo para revisarlo.
              </p>
              <a
                href={file.url_archivo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--brand)] text-white text-[13px]"
              >
                <DocumentDownload size={16} /> Abrir en nueva pestaña
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}