'use client';

import { useState } from 'react';
import {
  DocumentText, DocumentCode, Document, DocumentDownload,
  PlayCircle, Link1, Add, Trash, Eye
} from 'iconsax-react';

// --- 1. IMPORTACIONES CORREGIDAS ---
import type { Role } from '@/lib/types/core/role.model'; // 👈 El tipo 'Role' correcto
import type { Resource } from '@/hooks/core/useTaskResources'; // 👈 El tipo 'Resource' del hook
// (Se elimina la definición local de 'Resource')

export default function TaskResources({
  // --- 2. CORRECCIÓN DEL VALOR POR DEFECTO ---
  role = 'ESTUDIANTE',
  resources = [],
  onDownloadAll,
  onAddResource,
  onRemoveResource,
}: {
  // --- 3. CORRECCIÓN DEL TIPO DE PROP ---
  role?: Role; // 👈 Acepta 'DOCENTE', 'ESTUDIANTE', 'ADMIN'
  resources?: Resource[];
  onDownloadAll?: (items: Resource[]) => void;
  onAddResource?: () => void;
  onRemoveResource?: (id: string) => void;
}) {

  // --- 4. CORRECCIÓN DE LA LÓGICA ---
  const isTeacher = role === 'DOCENTE'; // 👈 Comparamos con 'DOCENTE'
  const hasItems = (resources?.length ?? 0) > 0;
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);

  return (
    <section className="relative border border-[var(--border)] rounded-2xl p-5 bg-[var(--card)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-[15px] sm:text-[16px] text-[var(--fg)]">Recursos</h2>
         
        
        </div>

        <div className="flex items-center gap-2">
          {/* --- 5. LÓGICA DE ROL CORREGIDA --- */}
          {isTeacher && (
            <button
              onClick={onAddResource}
              aria-label="Agregar recurso"
              className="icon-btn" /* h-9 w-9 redondo de globals.css */
              title="Agregar recurso"
            >
              <Add size={18} color="var(--icon)" />
            </button>
          )}
          <button
            onClick={() => hasItems && onDownloadAll?.(resources)}
            disabled={!hasItems}
            className="h-9 px-3 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] text-[13px] enabled:hover:bg-[var(--section)] disabled:opacity-50"
            title="Descargar todo"
          >
            <DocumentDownload size={18} color="var(--icon)" />
            Descargar
          </button>
        </div>
      </div>

      <div className="mt-3 h-px w-full bg-[var(--border)]" />

      {!hasItems ? (
        <p className="mt-3 text-[14px] text-[color:var(--muted)]">No hay recursos aún.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {resources.map((r) => (
            <li key={r.id}>
              <ResourceRow
                r={r}
                teacher={isTeacher}
                onRemove={onRemoveResource}
                onPreview={() => setPreviewResource(r)}
              />
            </li>
          ))}
        </ul>
      )}

      {/* Modal de vista previa */}
      {previewResource && (
        <ResourcePreviewModal
          resource={previewResource}
          onClose={() => setPreviewResource(null)}
        />
      )}
    </section>
  );
}

function ResourceRow({
  r,
  teacher,
  onRemove,
  onPreview,
}: {
  r: Resource;
  teacher: boolean;
  onRemove?: (id: string) => void;
  onPreview?: () => void;
}) {
  const icon = getIcon(r.type);
  const colors = getColors(r.type);

  const handleDownload = async () => {
    try {
      const response = await fetch(r.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = r.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al descargar:', error);
      // Fallback: abrir en nueva pestaña
      window.open(r.url, '_blank');
    }
  };

  return (
    <div className="group relative flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--section)]/60 px-3 py-3 transition-colors hover:bg-[var(--section)]">
      {/* Icono del tipo */}
      <div className={`grid place-items-center h-10 w-10 rounded-lg ${colors.bg} ${colors.fg}`} aria-hidden="true">
        {icon}
      </div>

      {/* Texto */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-[15px] text-[var(--fg)]">{r.title}</p>
        <p className="text-[12.5px] text-[color:var(--muted)]">{labelType(r.type)}</p>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2">
        {/* Botón de Vista Previa */}
        <button
          onClick={onPreview}
          title="Vista previa"
          aria-label={`Vista previa de ${r.title}`}
          className="h-9 w-9 inline-grid place-items-center rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--section)]"
        >
          <Eye size={18} color="var(--icon)" />
        </button>

        {/* Botón de Descarga */}
        <button
          onClick={handleDownload}
          title="Descargar"
          aria-label={`Descargar ${r.title}`}
          className="h-9 w-9 inline-grid place-items-center rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--section)]"
        >
          <DocumentDownload size={18} color="var(--icon)" />
        </button>

        {teacher && (
          <button
            onClick={() => onRemove?.(r.id)}
            title="Eliminar"
            className="h-9 w-9 inline-grid place-items-center rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-rose-500/10"
          >
            <Trash size={18} color="var(--accent-red)" />
          </button>
        )}
      </div>
    </div>
  );
}

/* helpers visuales (sin cambios) */
function getIcon(t: Resource['type']) {
  switch (t) {
    case 'pdf': return <DocumentText size={18} color="var(--icon)" />;
    case 'notebook': return <DocumentCode size={18} color="var(--icon)" />;
    case 'video': return <PlayCircle size={18} color="var(--icon)" />;
    case 'link': return <Link1 size={18} color="var(--icon)" />;
    default: return <Document size={18} color="var(--icon)" />;
  }
}
function getColors(t: Resource['type']) {
  switch (t) {
    case 'pdf': return { bg: 'bg-rose-500/10',    fg: 'text-rose-600' };
    case 'notebook': return { bg: 'bg-indigo-500/10',  fg: 'text-indigo-600' };
    case 'slide': return { bg: 'bg-amber-500/10',  fg: 'text-amber-600' };
    case 'video': return { bg: 'bg-sky-500/10',    fg: 'text-sky-600' };
    case 'link': return { bg: 'bg-emerald-500/10', fg: 'text-emerald-600' };
    default: return { bg: 'bg-[var(--brand)]/10', fg: 'text-[var(--brand)]' };
  }
}
function labelType(t: Resource['type']) {
  switch (t) {
    case 'pdf': return 'PDF';
    case 'document': return 'Documento';
    case 'notebook': return 'Notebook';
    case 'slide': return 'Presentación';
    case 'link': return 'Enlace';
    case 'video': return 'Video';
  }
}

/* Modal de Vista Previa */
function ResourcePreviewModal({
  resource,
  onClose,
}: {
  resource: Resource;
  onClose: () => void;
}) {
  const renderPreview = () => {
    switch (resource.type) {
      case 'pdf':
        return (
          <iframe
            src={resource.url}
            className="w-full h-full border-0"
            title={resource.title}
          />
        );

      case 'video':
        return (
          <video
            src={resource.url}
            controls
            className="w-full h-full"
            title={resource.title}
          >
            Tu navegador no soporta el elemento de video.
          </video>
        );

      case 'link':
        return (
          <iframe
            src={resource.url}
            className="w-full h-full border-0"
            title={resource.title}
          />
        );

      case 'document':
      case 'slide':
      case 'notebook':
        // Para documentos de Office, usar vista previa de Google Docs
        const googleDocsUrl = `https://docs.google.com/gview?url=${encodeURIComponent(resource.url)}&embedded=true`;
        return (
          <iframe
            src={googleDocsUrl}
            className="w-full h-full border-0"
            title={resource.title}
          />
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Document size={64} color="var(--muted)" />
            <p className="text-[var(--muted)]">Vista previa no disponible para este tipo de archivo</p>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[var(--brand)] text-white rounded-lg hover:opacity-90"
            >
              Abrir en nueva pestaña
            </a>
          </div>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[90vw] h-[90vh] bg-[var(--card)] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div>
            <h3 className="font-semibold text-[16px] text-[var(--fg)]">{resource.title}</h3>
            <p className="text-[13px] text-[color:var(--muted)]">{labelType(resource.type)}</p>
          </div>
          <button
            onClick={onClose}
            className="h-10 w-10 inline-grid place-items-center rounded-xl hover:bg-[var(--section)] transition-colors"
            aria-label="Cerrar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="h-[calc(100%-73px)] bg-[var(--section)]">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
}