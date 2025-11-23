'use client';

import { DocumentDownload, TickCircle, Document, DocumentText } from 'iconsax-react';
import { useMySubmission } from '@/hooks/core/useMySubmission';

export default function MySubmissionDisplay({ taskId }: { taskId: string }) {
  const { data: submission, isLoading } = useMySubmission(taskId);

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

      {/* Calificación (si existe) */}
      {submission.calificacion !== null && (
        <div className="mb-4 p-3 rounded-lg bg-[var(--section)] border border-[var(--border)]">
          <div className="text-[13px] text-[color:var(--muted)] mb-1">Calificación</div>
          <div className="text-[20px] font-semibold">{submission.calificacion}/20</div>
          {submission.retroalimentacion && (
            <div className="mt-2 text-[13px]">{submission.retroalimentacion}</div>
          )}
        </div>
      )}

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
                    {archivo.tipo_archivo.includes('pdf') ? (
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
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}