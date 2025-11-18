'use client';

import { useEffect, useMemo, useState } from 'react';
import Portal from '@/components/ui/Portal';
import { CloseCircle, TickCircle, DocumentDownload, Trash } from 'iconsax-react';

// --- 1. IMPORTACIONES CORREGIDAS ---
import { useTaskDetails } from '@/hooks/core/useTaskDetails';
import { useSaveTask } from '@/hooks/core/useSaveTask';
import type { SaveTaskPayload } from '@/lib/services/core/taskService';
// (Se eliminan los mocks 'getTaskMeta', 'setTaskBasics', etc.)

/* ---------------- Props ---------------- */
type Props = {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  courseId: string;
  defaultTaskId?: string; // Si esto existe, estamos en modo "update"
  onSave?: (result: {
    taskId: string;
    title: string;
    dueAt: string | null;
    description: string;
    mode: 'create' | 'update';
  }) => void;
};

/* ---------------- Opciones mock (Sin cambios) ---------------- */
const DELIVERY_TYPES = [ 'Test inicial', 'Encuesta', /* ...etc */ ];
const INDICATORS = [ 'Pensamiento lógico', 'Autonomía', /* ...etc */ ];
const LEVELS = ['Secundaria', 'Pre universitario', 'Pregrado', 'Posgrado'] as const;
const INPUT = 'h-10 w-full rounded-xl border ...'; // (Sin cambios)

/* ---------------- Component ---------------- */
export default function NewTaskModal({
  isOpen,
  open,
  onClose,
  courseId,
  defaultTaskId,
  onSave,
}: Props) {
  const visible = (isOpen ?? open) ?? false;
  const mode: 'create' | 'update' = defaultTaskId ? 'update' : 'create';
  
  // Si es 'create', genera un ID temporal. Si es 'update', usa el 'defaultTaskId'
  const taskId = useMemo(() => defaultTaskId ?? `tmp-${Date.now()}`, [defaultTaskId]);

  // --- 2. HOOKS DE DATOS ---
  // Hook para OBTENER datos (solo se activa si 'defaultTaskId' existe)
  const { data: baseMeta, isLoading: isLoadingMeta } = useTaskDetails(defaultTaskId);
  // Hook para GUARDAR datos
  const { saveTask, isLoading: isSaving } = useSaveTask();

  // --- 3. ESTADO LOCAL DEL FORMULARIO ---
  const [title, setTitle] = useState<string>('');
  const [dueAt, setDueAt] = useState<string>(''); // Formato YYYY-MM-DD
  const [description, setDescription] = useState<string>('');
  // (Campos extra 'demo' - sin cambios)
  const [types, setTypes] = useState<string[]>([]);
  const [indicators, setIndicators] = useState<string[]>([]);
  const [level, setLevel] = useState<string>('');
  const [rubric, setRubric] = useState<File | null>(null);
  const [docs, setDocs] = useState<File[]>([]);

  // --- 4. EFECTOS (ACTUALIZADOS) ---
  
  // Efecto para el 'Esc' y 'overflow' (sin cambios)
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

  // Efecto para RELLENAR el formulario cuando los datos cargan (modo 'update')
  useEffect(() => {
    if (baseMeta) { // 'baseMeta' son los datos de 'useTaskDetails'
      setTitle(baseMeta.title ?? '');
      setDescription(baseMeta.description ?? '');
      const iso = baseMeta.dueAt;
      // Convierte el ISO string a YYYY-MM-DD para el input <input type="date">
      setDueAt(iso ? new Date(iso).toISOString().slice(0, 10) : '');
    }
  }, [baseMeta]); // Se activa cuando 'baseMeta' cambia

  if (!visible) return null;
  
  // El formulario no se puede guardar si no tiene título
  const canSave = title.trim().length > 0;
  // Está "ocupado" si está cargando datos O si está guardando
  const busy = isLoadingMeta || isSaving; 

  // --- 5. FUNCIÓN DE GUARDADO (ACTUALIZADA) ---
  const handleSave = async () => {
    if (!canSave || busy) return;
    
    // Convierte la fecha del input (YYYY-MM-DD) a un ISO string (o null)
    const dueIso = dueAt ? new Date(`${dueAt}T23:59:59Z`).toISOString() : null;
    
    // Preparamos el payload para el servicio/hook
    const payload: SaveTaskPayload = {
      title: title.trim(),
      dueAt: dueIso,
      description: description.trim(),
    };

    try {
      // Llamamos al hook de mutación
      const savedTask = await saveTask({ taskId, data: payload });
      
      // Notificamos al componente padre (como antes)
     onSave?.({
        taskId: savedTask.id, // 👈 Mapeamos 'id' a 'taskId'
        title: savedTask.title,
        dueAt: savedTask.dueAt,
        description: savedTask.description ?? '',
        mode,
      });
      onClose(); // Cerramos el modal
      
    } catch (err) {
      console.error("Error al guardar la tarea:", err);
      alert("Error al guardar la tarea. Intenta de nuevo.");
    }
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[200]">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />

        <div className="relative z-[210] grid place-items-center h-full w-full p-4">
          <div className="w-[min(880px,98vw)] rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden">

            {/* Header (sin cambios) */}
            <div className="bg-[var(--brand)]/12 ...">
              {/* ... (título del modal) ... */}
            </div>

            {/* Body (sin cambios en el JSX) */}
            <div className="p-6 space-y-5 bg-[var(--section)]">
              {/* ... (todos tus 'Field', 'MultiSelect', 'UploadArea', etc.) ... */}
            </div>

            {/* Footer con colores (ACTUALIZADO) */}
            <div className="bg-[var(--card)] border-t border-[var(--border)] px-6 py-4 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="h-9 px-4 rounded-xl text-[13px] bg-[var(--section)] hover:bg-[var(--border)] transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!canSave || busy} // 👈 'busy' controla el 'disabled'
                className={`h-9 px-4 inline-flex items-center gap-2 rounded-xl text-white text-[13px]
                            bg-[var(--accent-green)] hover:bg-[var(--accent-green)]/90 disabled:opacity-50 transition`}
              >
                <TickCircle size={18} color="#ffffff" />
                {isSaving ? 'Guardando…' : 'Guardar'} {/* 👈 Muestra texto de carga */}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>       
  );
}

/* ----------- Subcomponentes reutilizables ----------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="text-[13.5px] font-medium text-[var(--fg)] space-y-1">
      <span>{label}</span>
      {children}
    </label>
  );
}

function MultiSelect({
  options, values, onChange, placeholder,
}: { options: string[]; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const toggle = (v: string) => onChange(values.includes(v) ? values.filter(x => x !== v) : [...values, v]);

  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)} className={`${INPUT} text-left truncate`}>
        {values.length ? values.join(', ') : (placeholder ?? 'Seleccionar…')}
      </button>
      {open && (
        <div className="absolute z-[220] mt-1 max-h-60 w-full overflow-auto rounded-xl border border-[var(--border)] bg-[var(--card)] p-2 shadow-lg">
          {options.map(op => (
            <label
              key={op}
              className="flex items-center gap-2 px-2 py-1.5 text-[14px] hover:bg-[var(--section)] rounded-lg cursor-pointer transition"
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
  options, value, onChange, placeholder,
}: { options: string[]; value?: string; onChange: (v: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)} className={`${INPUT} text-left`}>
        {value || (placeholder ?? 'Seleccionar…')}
      </button>
      {open && (
        <div className="absolute z-[220] mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-1 shadow-lg">
          {options.map(op => (
            <button
              key={op}
              className="w-full text-left px-3 py-2 text-[14px] hover:bg-[var(--section)] rounded-lg transition"
              onClick={() => { onChange(op); setOpen(false); }}
            >
              {op}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Uploads ---------------- */
function UploadArea({
  title, file, onPick, onRemove,
}: { title: string; file: File | null; onPick: (f: File) => void; onRemove: () => void }) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onPick(f);
    e.currentTarget.value = '';
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-[var(--brand)]/35 bg-[var(--card)] p-4 hover:bg-[var(--section)] transition">
      <div className="text-[13px] font-medium mb-2 text-[var(--brand)]">{title}</div>
      {!file ? (
        <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--section)] px-3 py-2 text-[13px] hover:bg-[var(--border)]/50 transition">
          <DocumentDownload size={18} color="var(--brand)" />
          <span className="text-[var(--brand)]">Adjuntar archivo</span>
          <input type="file" className="hidden" onChange={onChange} />
        </label>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--section)] px-3 py-2">
          <div className="truncate text-[14px] text-[var(--fg)]">{file.name}</div>
          <button className="hover:bg-rose-100 rounded-lg p-1" onClick={onRemove} title="Quitar">
            <Trash size={18} color="#e11d48" />
          </button>
        </div>
      )}
    </div>
  );
}

function UploadList({
  title, files, onAdd, onRemove,
}: { title: string; files: File[]; onAdd: (f: File) => void; onRemove: (idx: number) => void }) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onAdd(f);
    e.currentTarget.value = '';
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-[var(--brand)]/35 bg-[var(--card)] p-4 hover:bg-[var(--section)] transition">
      <div className="text-[13px] font-medium mb-2 text-[var(--brand)]">{title}</div>
      <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--section)] px-3 py-2 text-[13px] hover:bg-[var(--border)]/50 transition">
        <DocumentDownload size={18} color="var(--brand)" />
        <span className="text-[var(--brand)]">Adjuntar archivo</span>
        <input type="file" className="hidden" onChange={onChange} />
      </label>

      {!!files.length && (
        <ul className="mt-3 space-y-2">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--section)] px-3 py-2">
              <div className="truncate text-[14px] text-[var(--fg)]">{f.name}</div>
              <button className="hover:bg-rose-100 rounded-lg p-1" onClick={() => onRemove(i)} title="Quitar">
                <Trash size={18} color="#e11d48" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
