'use client';

import { useEffect, useState } from 'react';
import Portal from '@/components/ui/Portal';
import { CloseCircle, TickCircle } from 'iconsax-react';
import { useCreateUnit } from '@/hooks/core/useCreateUnit';
import type { CreateUnitPayload } from '@/lib/services/core/unitService';

type Props = {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  courseId: string;
  onSuccess?: (unitId: number) => void;
};

const INPUT_CLASS = `h-10 w-full rounded-xl border border-gray-200 px-3 text-[15px]
                     focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30
                     focus:border-[var(--brand)] transition`;

const TEXTAREA_CLASS = `w-full rounded-xl border border-gray-200 px-3 py-2 text-[15px]
                        focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30
                        focus:border-[var(--brand)] transition resize-none`;

export default function NewUnitModal({
  isOpen,
  open,
  onClose,
  courseId,
  onSuccess,
}: Props) {
  const visible = (isOpen ?? open) ?? false;

  // Hook para crear unidad
  const { createUnit, isLoading, error } = useCreateUnit();

  // Estado local del formulario
  const [titulo, setTitulo] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [numeroUnidad, setNumeroUnidad] = useState<string>('1');

  // Efecto para ESC key y bloquear scroll
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

  // Resetear formulario cuando se cierra
  useEffect(() => {
    if (!visible) {
      setTitulo('');
      setDescripcion('');
      setNumeroUnidad('1');
    }
  }, [visible]);

  if (!visible) return null;

  const canSave = titulo.trim().length > 0 && numeroUnidad.trim().length > 0;

  const handleSave = async () => {
    if (!canSave || isLoading) return;

    const payload: CreateUnitPayload = {
      titulo_unidad: titulo.trim(),
      descripcion: descripcion.trim() || undefined,
      numero_unidad: parseInt(numeroUnidad, 10),
      id_curso: parseInt(courseId, 10),
    };

    try {
      const result = await createUnit(payload);
      console.log('✅ Unidad creada:', result);

      // Notificar éxito
      if (onSuccess) {
        onSuccess(result.id_unidad);
      }

      // Cerrar modal
      onClose();
    } catch (err: unknown) {
      console.error('❌ Error al crear unidad:', err);
      // El error ya se maneja en el hook, aquí solo logueamos
    }
  };

  return (
    <Portal>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[61] p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-xl
                     max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-[20px] font-semibold text-gray-800">
              Crear Nueva Unidad/Módulo
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition"
              disabled={isLoading}
            >
              <CloseCircle size={24} color="#666" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-6">
            {/* Título de la Unidad */}
            <div>
              <label className="block text-[14px] font-medium text-gray-700 mb-1.5">
                Título de la Unidad <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={INPUT_CLASS}
                placeholder="Ej: Unidad 1 - Introducción a la Programación"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                disabled={isLoading}
                maxLength={200}
              />
              <p className="text-[12px] text-gray-500 mt-1">
                {titulo.length}/200 caracteres
              </p>
            </div>

            {/* Número de Unidad */}
            <div>
              <label className="block text-[14px] font-medium text-gray-700 mb-1.5">
                Número de Unidad <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                className={INPUT_CLASS}
                placeholder="1"
                value={numeroUnidad}
                onChange={(e) => setNumeroUnidad(e.target.value)}
                disabled={isLoading}
                min="1"
                max="999"
              />
              <p className="text-[12px] text-gray-500 mt-1">
                Orden en el que aparecerá la unidad
              </p>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-[14px] font-medium text-gray-700 mb-1.5">
                Descripción (Opcional)
              </label>
              <textarea
                className={TEXTAREA_CLASS}
                placeholder="Describe brevemente el contenido de esta unidad..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                disabled={isLoading}
                rows={4}
                maxLength={500}
              />
              <p className="text-[12px] text-gray-500 mt-1">
                {descripcion.length}/500 caracteres
              </p>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-[14px] text-red-700">
                  {error instanceof Error ? error.message : 'Error al crear la unidad'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-5 py-2 text-[14px] font-medium text-gray-700
                         hover:bg-gray-200 rounded-lg transition"
              disabled={isLoading}
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              disabled={!canSave || isLoading}
              className="px-5 py-2 bg-[var(--brand)] text-white text-[14px] font-medium
                         rounded-lg hover:bg-[var(--brand)]/90 transition
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creando...
                </>
              ) : (
                <>
                  <TickCircle size={18} />
                  Crear Unidad
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
