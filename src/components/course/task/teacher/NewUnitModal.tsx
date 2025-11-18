'use client';

import { useEffect, useState } from 'react';
import Portal from '@/components/ui/Portal';
import { CloseCircle, TickCircle } from 'iconsax-react';

type Props = {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  onSave?: (unit: { id: string; title: string; description: string }) => void;
};

export default function NewUnitModal({ open, isOpen, onClose, onSave }: Props) {
  const visible = (open ?? isOpen) ?? false;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Esc + scroll lock
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

  if (!visible) return null;

  const canSave = title.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;

    const newUnit = {
      id: `unit-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
    };

    onSave?.(newUnit);
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[200]">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          onClick={onClose}
        />

        <div className="relative z-[210] grid place-items-center h-full w-full p-4">
          <div className="w-[min(600px,98vw)] rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="bg-[var(--brand)]/12 border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
              <div className="text-[17px] font-semibold text-[var(--brand)]">
                Nueva unidad
              </div>

              <button onClick={onClose} className="p-1 hover:bg-[var(--border)] rounded-lg transition">
                <CloseCircle size={22} color="var(--brand)" />
              </button>
            </div>

            {/* BODY */}
            <div className="p-6 space-y-5 bg-[var(--section)]">
              <Field label="Título de la unidad">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 text-[14px] outline-none focus:border-[var(--brand)] transition"
                  placeholder="Ej: Unidad 1 - Fundamentos"
                />
              </Field>

              <Field label="Descripción">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[14px] resize-none outline-none focus:border-[var(--brand)] transition"
                  placeholder="Descripción breve de la unidad…"
                />
              </Field>
            </div>

            {/* FOOTER */}
            <div className="bg-[var(--card)] border-t border-[var(--border)] px-6 py-4 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="h-9 px-4 rounded-xl text-[13px] bg-[var(--section)] hover:bg-[var(--border)] transition"
              >
                Cancelar
              </button>

              <button
                disabled={!canSave}
                onClick={handleSave}
                className="h-9 px-4 inline-flex items-center gap-2 rounded-xl text-white text-[13px]
                           bg-[var(--accent-green)] hover:bg-[var(--accent-green)]/90 disabled:opacity-50 transition"
              >
                <TickCircle size={18} color="#ffffff" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}

/* Field layout reutilizado */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="text-[13.5px] font-medium text-[var(--fg)] space-y-1 block">
      <span>{label}</span>
      {children}
    </label>
  );
}
