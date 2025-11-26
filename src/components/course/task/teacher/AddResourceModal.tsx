'use client';

import { useEffect, useRef, useState } from 'react';
import { CloseCircle, TickCircle, DocumentDownload } from 'iconsax-react';

type ResourceFileType = 'rubrica' | 'material';

export default function AddResourceModal({
  open,
  onClose,
  onSubmit,
  hasRubricUploaded = false,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (file: File) => Promise<void>;
  hasRubricUploaded?: boolean;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<ResourceFileType>('material');
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setFileType('material');
      if (fileRef.current) fileRef.current.value = '';
    }
  }, [open]);

  if (!open) return null;

  const onFilePicked = (f: File) => {
    if (!f) return;

    // Si es rúbrica, validar formato y nombre
    if (fileType === 'rubrica') {
      if (hasRubricUploaded) {
        alert('Ya existe una rúbrica para esta actividad. Elimina la anterior antes de subir una nueva.');
        if (fileRef.current) fileRef.current.value = '';
        return;
      }
      if (!f.name.endsWith('.docx')) {
        alert('Las rúbricas solo se permiten en formato .docx');
        if (fileRef.current) fileRef.current.value = '';
        return;
      }

      // Validar que el nombre contenga "Rubrica" o "Rúbrica"
      const fileName = f.name.toLowerCase();
      if (!fileName.includes('rubrica') && !fileName.includes('rúbrica')) {
        alert('El archivo de rúbrica debe contener "Rubrica" en el nombre');
        if (fileRef.current) fileRef.current.value = '';
        return;
      }
    }
    // Si es material de apoyo, cualquier formato es válido

    setSelectedFile(f);
  };

  const submit = async () => {
    if (!selectedFile) {
      alert('Debes seleccionar un archivo');
      return;
    }
    if (fileType === 'rubrica' && hasRubricUploaded) {
      alert('Ya existe una rúbrica para esta actividad. Elimina la anterior antes de subir una nueva.');
      return;
    }

    try {
      await onSubmit(selectedFile);
      onClose();
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error('Error al subir el archivo');
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-[min(560px,92vw)] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px] font-semibold">Agregar recurso</h3>
          <button className="icon-btn" onClick={onClose}><CloseCircle size={18} color="var(--icon)" /></button>
        </div>

        <div className="mt-4 grid gap-4">
          {/* Selector de tipo de recurso */}
          <div className="grid gap-2">
            <label className="text-[13px] font-medium">Tipo de recurso</label>
            <select
              className="w-full h-10 rounded-xl border border-[var(--border)] bg-[var(--section)] px-3 text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20"
              value={fileType}
              onChange={(e) => {
                const nextType = e.target.value as ResourceFileType;
                if (nextType === 'rubrica' && hasRubricUploaded) {
                  alert('Ya existe una rúbrica para esta actividad. Elimina la anterior antes de subir una nueva.');
                  return;
                }
                setFileType(nextType);
                setSelectedFile(null);
                if (fileRef.current) fileRef.current.value = '';
              }}
            >
              <option value="material">Material de apoyo</option>
              <option value="rubrica" disabled={hasRubricUploaded}>
                Rúbrica de evaluación
              </option>
            </select>
          </div>

          {/* Instrucciones según el tipo */}
          <div className="rounded-xl bg-[var(--section)] p-3 border border-[var(--border)]">
            <p className="text-[13px] font-medium mb-2">
              {fileType === 'rubrica' ? '📋 Requisitos para rúbricas:' : '📎 Material de apoyo:'}
            </p>
            {fileType === 'rubrica' ? (
              <ul className="text-[12px] text-[var(--text-secondary)] space-y-1 list-disc list-inside">
                <li>Solo formato <strong>.docx</strong> (Word)</li>
                <li>El nombre del archivo debe contener <strong>&quot;Rubrica&quot;</strong></li>
                <li>Ejemplo: <code className="px-1 py-0.5 rounded bg-[var(--card)]">Rubrica_Final.docx</code></li>
                {hasRubricUploaded && (
                  <li className="text-rose-600">
                    Ya existe una rúbrica. Elimina la anterior si necesitas subir otra.
                  </li>
                )}
              </ul>
            ) : (
              <ul className="text-[12px] text-[var(--text-secondary)] space-y-1 list-disc list-inside">
                <li>Cualquier formato de archivo es válido</li>
                <li>PDF, Word, Excel, imágenes, videos, etc.</li>
                <li>Sin restricciones en el nombre del archivo</li>
              </ul>
            )}
          </div>

          {/* Selector de archivo */}
          <div className="grid gap-2">
            <span className="text-[13px] font-medium">Seleccionar archivo</span>
            <div className="flex items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                accept={fileType === 'rubrica' ? '.docx' : '*'}
                onChange={(e) => e.target.files?.[0] && onFilePicked(e.target.files[0])}
                className="hidden"
                id="filePick"
              />
              <label
                htmlFor="filePick"
                className="h-10 px-4 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] text-[13px] hover:bg-[var(--section)] cursor-pointer transition-colors flex-1"
              >
                <DocumentDownload size={18} color="var(--icon)" />
                <span className="truncate">
                  {selectedFile ? selectedFile.name : 'Seleccionar archivo'}
                </span>
              </label>
              {selectedFile && (
                <span className="text-[12px] text-[var(--text-secondary)] whitespace-nowrap">
                  {fmt(selectedFile.size)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button className="h-9 px-3 rounded-xl border border-[var(--border)] hover:bg-[var(--section)] transition-colors" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="h-9 px-3 inline-flex items-center gap-2 rounded-xl border border-[var(--brand)]/30 bg-[var(--brand)]/10 text-[var(--brand)] hover:bg-[var(--brand)]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--brand)]/10"
            onClick={submit}
            disabled={!selectedFile}
          >
            <TickCircle size={18} color="var(--brand)" /> Subir
          </button>
        </div>
      </div>
    </div>
  );
}

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}
