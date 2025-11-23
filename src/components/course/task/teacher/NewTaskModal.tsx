'use client';

import { useEffect, useMemo, useState } from 'react';
import Portal from '@/components/ui/Portal';
import { CloseCircle, TickCircle, DocumentDownload, Trash } from 'iconsax-react';

import { useTaskDetails } from '@/hooks/core/useTaskDetails';
import { useSaveTask } from '@/hooks/core/useSaveTask';
import type { SaveTaskPayload } from '@/lib/services/core/taskService';
import { createMaterial, uploadFile } from '@/lib/services/core/materialService';
import type { MaterialType } from '@/lib/types/core/material.model';

type UnitItem = {
  id: string;
  title: string;
};

type Props = {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  courseId: string;
  defaultTaskId?: string;
  units: UnitItem[]; // 👈 NUEVO
  onSave?: (result: {
    taskId: string;
    title: string;
    dueAt: string | null;
    description: string;
    mode: 'create' | 'update';
    unitId: string;
  }) => void;
};

const DELIVERY_TYPES = ['Test inicial', 'Encuesta', 'Entrega de trabajo', 'Examen parcial'];
const INDICATORS = ['Pensamiento lógico', 'Autonomía', 'Trabajo en equipo', 'Creatividad'];
const LEVELS = ['Secundaria', 'Pre universitario', 'Pregrado', 'Posgrado'] as const;

const INPUT =
  'h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 text-[14px] text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/40';

export default function NewTaskModal({
  isOpen,
  open,
  onClose,
  courseId,
  defaultTaskId,
  units,
  onSave,
}: Props) {
  const visible = (isOpen ?? open) ?? false;
  const mode: 'create' | 'update' = defaultTaskId ? 'update' : 'create';

  const taskId = useMemo(() => defaultTaskId ?? `tmp-${Date.now()}`, [defaultTaskId]);

  const { data: baseMeta, isLoading: isLoadingMeta } = useTaskDetails(defaultTaskId);
  const { saveTask, isLoading: isSaving } = useSaveTask();

  const [title, setTitle] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [description, setDescription] = useState('');

  // Selección de módulo
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');

  const [types, setTypes] = useState<string[]>([]);
  const [indicators, setIndicators] = useState<string[]>([]);
  const [level, setLevel] = useState<string>('');
  const [rubric, setRubric] = useState<File | null>(null);
  const [docs, setDocs] = useState<File[]>([]);

  // ------- ESC + scroll block -------
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [visible, onClose]);

  // ------- Rellenar en modo edit -------
  useEffect(() => {
    if (baseMeta) {
      setTitle(baseMeta.title ?? '');
      setDescription(baseMeta.description ?? '');
      const iso = baseMeta.dueAt;
      setDueAt(iso ? new Date(iso).toISOString().slice(0, 10) : '');
      if (baseMeta.unitId) setSelectedUnitId(baseMeta.unitId);
    }
  }, [baseMeta]);

  if (!visible) return null;

  const canSave = title.trim().length > 0 && selectedUnitId.length > 0;
  const busy = isLoadingMeta || isSaving;

  const handleSave = async () => {
    if (!canSave || busy) return;

    const dueIso = dueAt ? new Date(`${dueAt}T23:59:59Z`).toISOString() : null;

    const payload: SaveTaskPayload = {
      title: title.trim(),
      dueAt: dueIso,
      description: description.trim(),
      unitId: selectedUnitId,
    };

    try {
      // 1. Guardar la actividad
      const savedTask = await saveTask({ taskId, data: payload });
      const actividadId = parseInt(savedTask.id);

      // 2. Subir materiales de apoyo (docs)
      if (docs.length > 0) {
        console.log('📤 Subiendo materiales de apoyo...');
        for (const file of docs) {
          try {
            // Subir archivo y obtener URL
            const url = await uploadFile(file);

            // Detectar tipo de archivo
            const extension = file.name.split('.').pop()?.toLowerCase() || 'otro';
            let tipoDocumento: MaterialType = 'otro';

            if (extension === 'pdf') tipoDocumento = 'pdf';
            else if (['mp4', 'avi', 'mov', 'webm'].includes(extension)) tipoDocumento = 'video';
            else if (['ppt', 'pptx'].includes(extension)) tipoDocumento = 'ppt';
            else if (['doc', 'docx'].includes(extension)) tipoDocumento = 'doc';

            // Crear material en el backend
            await createMaterial({
              id_actividad: actividadId,
              nombre_documento: file.name,
              tipo_documento: tipoDocumento,
              url_archivo: url,
            });

            console.log('✅ Material subido:', file.name);
          } catch (err) {
            console.error('❌ Error al subir material:', file.name, err);
          }
        }
      }

      // 3. Subir rúbrica (si existe)
      if (rubric) {
        console.log('📤 Subiendo rúbrica...');
        try {
          const url = await uploadFile(rubric);
          await createMaterial({
            id_actividad: actividadId,
            nombre_documento: rubric.name,
            tipo_documento: 'pdf',
            url_archivo: url,
          });
          console.log('✅ Rúbrica subida:', rubric.name);
        } catch (err) {
          console.error('❌ Error al subir rúbrica:', err);
        }
      }

      onSave?.({
        taskId: savedTask.id,
        title: savedTask.title,
        dueAt: savedTask.dueAt,
        description: savedTask.description ?? '',
        mode,
        unitId: selectedUnitId,
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert('Error al guardar la tarea.');
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[200]">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          onClick={onClose}
        />

        {/* 🟩 EL NUEVO CONTENEDOR: scroll perfecto */}
        <div className="relative z-[210] flex items-start justify-center h-full w-full overflow-y-auto p-4">

          <div className="w-[min(880px,98vw)] rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden mb-10">

            {/* Header */}
            <div className="bg-[var(--brand)]/10 px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-semibold text-[var(--fg)]">
                  {mode === 'create' ? 'Crear nueva tarea' : 'Editar tarea'}
                </h2>
                <p className="text-[12.5px] text-[color:var(--muted)]">
                  Define los datos básicos de la actividad para este curso.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-black/5 transition"
              >
                <CloseCircle size={22} color="var(--fg-soft)" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 bg-[var(--section)]">

              {/* Selección de módulo */}
              <Field label="Asignar a módulo">
                <Select
                  options={units.map((u) => ({ value: u.id, label: u.title }))}
                  value={selectedUnitId}
                  onChange={setSelectedUnitId}
                  placeholder="Selecciona un módulo…"
                />
              </Field>

              {/* Título + Fecha */}
              <div className="grid gap-4 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
                <Field label="Título de la tarea">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={INPUT}
                    placeholder="Nombre de la actividad"
                  />
                </Field>

                <Field label="Fecha límite">
                  <input
                    type="date"
                    value={dueAt}
                    onChange={(e) => setDueAt(e.target.value)}
                    className={INPUT}
                  />
                </Field>
              </div>

              {/* Descripción */}
              <Field label="Descripción">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-[120px] rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-[14px] focus:ring-2 focus:ring-[var(--brand)]/40"
                  placeholder="Describe la actividad..."
                />
              </Field>

              {/* Opciones (demo) */}
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Tipo de entrega">
                  <MultiSelect
                    options={DELIVERY_TYPES}
                    values={types}
                    onChange={setTypes}
                    placeholder="Seleccionar..."
                  />
                </Field>

                <Field label="Indicadores">
                  <MultiSelect
                    options={INDICATORS}
                    values={indicators}
                    onChange={setIndicators}
                    placeholder="Seleccionar..."
                  />
                </Field>

                <Field label="Nivel educativo">
                  <Select
                    options={LEVELS.map((l) => ({ value: l, label: l }))}
                    value={level}
                    onChange={setLevel}
                    placeholder="Seleccionar nivel..."
                  />
                </Field>
              </div>

              {/* Archivos */}
              <div className="grid gap-4 md:grid-cols-2">
                <UploadArea
                  title="Rúbrica (opcional)"
                  file={rubric}
                  onPick={setRubric}
                  onRemove={() => setRubric(null)}
                />

                <UploadList
                  title="Material de apoyo"
                  files={docs}
                  onAdd={(f) => setDocs((prev) => [...prev, f])}
                  onRemove={(idx) =>
                    setDocs((prev) => prev.filter((_, i) => i !== idx))
                  }
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-[var(--card)] border-t border-[var(--border)] px-6 py-4 flex justify-end gap-2 sticky bottom-0">
              <button
                onClick={onClose}
                className="h-9 px-4 rounded-xl text-[13px] bg-[var(--section)] hover:bg-[var(--border)] transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                disabled={!canSave || busy}
                className="h-9 px-4 inline-flex items-center gap-2 rounded-xl text-white text-[13px] bg-[var(--accent-green)] hover:bg-[var(--accent-green)]/90 disabled:opacity-50 transition"
              >
                <TickCircle size={18} color="#ffffff" />
                {isSaving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}

/* === COMPONENTES REUTILIZABLES === */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="text-[13.5px] font-medium text-[var(--fg)] space-y-1 block">
      <span>{label}</span>
      {children}
    </label>
  );
}

function MultiSelect({
  options,
  values,
  onChange,
  placeholder,
}: {
  options: string[];
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (v: string) =>
    onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${INPUT} text-left truncate`}
      >
        {values.length ? values.join(', ') : placeholder ?? 'Seleccionar…'}
      </button>

      {open && (
        <div className="absolute z-[500] mt-1 max-h-60 w-full overflow-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-lg">
          {options.map((op) => (
            <label
              key={op}
              className="flex items-center gap-2 px-2 py-1.5 text-[14px] hover:bg-[var(--section)] rounded-lg cursor-pointer"
            >
              <input
                type="checkbox"
                className="accent-[var(--brand)]"
                checked={values.includes(op)}
                onChange={() => toggle(op)}
              />
              <span className="truncate">{op}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function Select({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: { value: string; label: string }[];
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);

  const current = options.find((o) => o.value === value)?.label;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((x) => !x)}
        className={`${INPUT} text-left`}
      >
        {current || placeholder || 'Seleccionar…'}
      </button>

      {open && (
        <div className="absolute z-[500] mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-1 shadow-lg">
          {options.map((op) => (
            <button
              key={op.value}
              className="w-full text-left px-3 py-2 text-[14px] hover:bg-[var(--section)] rounded-lg"
              onClick={() => {
                onChange(op.value);
                setOpen(false);
              }}
            >
              {op.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadArea({
  title,
  file,
  onPick,
  onRemove,
}: {
  title: string;
  file: File | null;
  onPick: (f: File) => void;
  onRemove: () => void;
}) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onPick(f);
    e.currentTarget.value = '';
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-[var(--brand)]/35 bg-[var(--card)] p-4 hover:bg-[var(--section)] transition">
      <div className="text-[13px] font-medium mb-2 text-[var(--brand)]">
        {title}
      </div>

      {!file ? (
        <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--section)] px-3 py-2 text-[13px] hover:bg-[var(--border)]">
          <DocumentDownload size={18} color="var(--brand)" />
          <span className="text-[var(--brand)]">Adjuntar archivo</span>
          <input type="file" className="hidden" onChange={onChange} />
        </label>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--section)] px-3 py-2">
          <div className="truncate text-[14px] text-[var(--fg)]">{file.name}</div>
          <button
            className="hover:bg-rose-100 rounded-lg p-1"
            onClick={onRemove}
          >
            <Trash size={18} color="#e11d48" />
          </button>
        </div>
      )}
    </div>
  );
}

function UploadList({
  title,
  files,
  onAdd,
  onRemove,
}: {
  title: string;
  files: File[];
  onAdd: (f: File) => void;
  onRemove: (idx: number) => void;
}) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onAdd(f);
    e.currentTarget.value = '';
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-[var(--brand)]/35 bg-[var(--card)] p-4 hover:bg-[var(--section)]">
      <div className="text-[13px] font-medium mb-2 text-[var(--brand)]">{title}</div>

      <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--section)] px-3 py-2 text-[13px] hover:bg-[var(--border)]">
        <DocumentDownload size={18} color="var(--brand)" />
        <span className="text-[var(--brand)]">Adjuntar archivo</span>
        <input type="file" className="hidden" onChange={onChange} />
      </label>

      {!!files.length && (
        <ul className="mt-3 space-y-2">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--section)] px-3 py-2"
            >
              <div className="truncate text-[14px] text-[var(--fg)]">{f.name}</div>
              <button
                className="hover:bg-rose-100 rounded-lg p-1"
                onClick={() => onRemove(i)}
              >
                <Trash size={18} color="#e11d48" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
