'use client';

import { useState, useEffect } from 'react';
import Portal from '@/components/ui/Portal';
import { CloseCircle, TickCircle, FolderAdd } from 'iconsax-react';
import { useSaveUnit } from '@/hooks/core/useSaveUnit';

interface NewUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  onUnitCreated?: () => void;
}

const INPUT =
  'h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--section)] px-3 text-[14px] outline-none focus:ring-2 focus:ring-[var(--brand)]/40';

const TEXTAREA =
  'w-full rounded-xl border border-[var(--border)] bg-[var(--section)] px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[var(--brand)]/40 resize-none';

export const NewUnitModal = ({
  isOpen,
  onClose,
  courseId,
  onUnitCreated,
}: NewUnitModalProps) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [numeroUnidad, setNumeroUnidad] = useState('');

  const { saveUnit, isLoading, error } = useSaveUnit();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTitulo('');
      setDescripcion('');
      setNumeroUnidad('');
    }
  }, [isOpen]);

  // Handle ESC key and overflow
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  // Show error notification
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  if (!isOpen) return null;

  const canSave = titulo.trim().length > 0 && numeroUnidad.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSave || isLoading) return;

    // Validación
    if (isNaN(Number(numeroUnidad))) {
      alert('El número de módulo debe ser un número válido');
      return;
    }

    const unitData = {
      titulo_unidad: titulo.trim(),
      descripcion: descripcion.trim() || undefined,
      numero_unidad: Number(numeroUnidad),
      id_curso: Number(courseId),
    };

    const result = await saveUnit(unitData);

    if (result) {
      alert('Módulo creado exitosamente');
      onClose();
      onUnitCreated?.();
    }
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

            {/* Header */}
            <div className="bg-[var(--brand)]/12 border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--brand)]/15">
                  <FolderAdd size={22} color="var(--brand)" />
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold text-[var(--fg)]">
                    Crear Nuevo Módulo
                  </h2>
                  <p className="text-[13px] text-[var(--muted)]">
                    Completa los datos para crear un nuevo módulo
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="hover:bg-[var(--section)] rounded-xl p-2 transition"
                disabled={isLoading}
              >
                <CloseCircle size={22} color="var(--muted)" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 bg-[var(--section)]">
              {/* Número de Módulo */}
              <Field label="Número de Módulo *">
                <input
                  type="number"
                  min="1"
                  value={numeroUnidad}
                  onChange={(e) => setNumeroUnidad(e.target.value)}
                  placeholder="Ej: 1, 2, 3..."
                  className={INPUT}
                  disabled={isLoading}
                  autoFocus
                />
              </Field>

              {/* Título del Módulo */}
              <Field label="Título del Módulo *">
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej: Introducción a la Programación"
                  className={INPUT}
                  disabled={isLoading}
                />
              </Field>

              {/* Descripción */}
              <Field label="Descripción (Opcional)">
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describe el contenido y objetivos de este módulo..."
                  rows={4}
                  className={TEXTAREA}
                  disabled={isLoading}
                />
              </Field>
            </div>

            {/* Footer */}
            <div className="bg-[var(--card)] border-t border-[var(--border)] px-6 py-4 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="h-9 px-4 rounded-xl text-[13px] bg-[var(--section)] hover:bg-[var(--border)] transition"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSave || isLoading}
                className="h-9 px-4 inline-flex items-center gap-2 rounded-xl text-white text-[13px]
                           bg-[var(--accent-green)] hover:bg-[var(--accent-green)]/90 disabled:opacity-50 transition"
              >
                <TickCircle size={18} color="#ffffff" />
                {isLoading ? 'Creando...' : 'Crear Módulo'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

/* ----------- Subcomponente Field ----------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="text-[13.5px] font-medium text-[var(--fg)] space-y-1">
      <span>{label}</span>
      {children}
    </label>
  );
}
