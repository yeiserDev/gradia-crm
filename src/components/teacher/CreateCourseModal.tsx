'use client';

import { useState } from 'react';
import { useCreateCourse } from '@/hooks/teacher/useCourses';

type CreateCourseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateCourseModal({ isOpen, onClose }: CreateCourseModalProps) {
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const { mutate: createCourse, isPending, isError, error } = useCreateCourse();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createCourse(
      {
        nombre_curso: nombre,
        codigo_curso: codigo || undefined,
        descripcion: descripcion || undefined,
      },
      {
        onSuccess: () => {
          // Limpiar formulario y cerrar modal
          setNombre('');
          setCodigo('');
          setDescripcion('');
          onClose();
          alert('¡Curso creado exitosamente!');
        },
        onError: (err) => {
          console.error('Error al crear curso:', err);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-bold">Crear Nuevo Curso</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre del curso */}
          <div>
            <label htmlFor="nombre" className="mb-1 block text-sm font-medium">
              Nombre del curso *
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              placeholder="ej. Matemáticas I"
            />
          </div>

          {/* Código del curso */}
          <div>
            <label htmlFor="codigo" className="mb-1 block text-sm font-medium">
              Código del curso
            </label>
            <input
              id="codigo"
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              placeholder="ej. MAT101"
            />
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="mb-1 block text-sm font-medium">
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full rounded border border-gray-300 px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
              placeholder="Describe el curso..."
            />
          </div>

          {/* Error */}
          {isError && (
            <div className="rounded bg-red-100 p-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
              Error: {error instanceof Error ? error.message : 'Error al crear curso'}
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              disabled={isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? 'Creando...' : 'Crear Curso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
