'use client';

import { useState, useMemo } from 'react';
import { SearchNormal1, CloseCircle } from 'iconsax-react';
import Modal from '@/components/common/Modal';

type Student = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
};

export default function CourseStudentsModal({
  open,
  onClose,
  courseId,
  courseTitle,
}: Props) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // TODO: Implementar hook para obtener estudiantes del curso
  // Por ahora, usamos datos de ejemplo
  const students: Student[] = [
    {
      id: '1',
      name: 'María García',
      email: 'maria.garcia@universidad.edu',
    },
    {
      id: '2',
      name: 'Juan Pérez',
      email: 'juan.perez@universidad.edu',
    },
    {
      id: '3',
      name: 'Ana Rodríguez',
      email: 'ana.rodriguez@universidad.edu',
    },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
  }, [students, query]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Estudiantes - ${courseTitle}`}
      widthClass="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="relative">
          <input
            placeholder="Buscar estudiante por nombre o email..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-[14px] focus:outline-none focus:border-indigo-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SearchNormal1
            size={18}
            color="#94a3b8"
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />
        </div>

        {/* Contador */}
        <div className="flex items-center justify-between text-[13px] text-slate-600">
          <span>
            {filtered.length} estudiante{filtered.length !== 1 ? 's' : ''}
            {query && ` encontrado${filtered.length !== 1 ? 's' : ''}`}
          </span>
        </div>

        {/* Lista de estudiantes */}
        {loading ? (
          <div className="py-12 text-center text-[14px] text-slate-500">
            Cargando estudiantes...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <CloseCircle size={48} color="#cbd5e1" className="mx-auto mb-3" />
            <p className="text-[14px] text-slate-500">
              {query
                ? 'No se encontraron estudiantes con ese criterio'
                : 'No hay estudiantes inscritos en este curso'}
            </p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto rounded-xl border border-slate-200">
            <ul className="divide-y divide-slate-200">
              {filtered.map((student, index) => (
                <li
                  key={student.id}
                  className="px-4 py-3 flex items-center gap-4 hover:bg-slate-50 transition"
                >
                  {/* Número */}
                  <div className="w-8 text-[12px] text-slate-400 font-medium">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Avatar */}
                  <img
                    src={
                      student.avatarUrl ??
                      `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(
                        student.name
                      )}&backgroundColor=b6e3f4,c0aede,d1d4f9`
                    }
                    alt={student.name}
                    className="h-10 w-10 rounded-full"
                  />

                  {/* Información */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[14px] text-slate-800 truncate">
                      {student.name}
                    </div>
                    <div className="text-[13px] text-slate-500 truncate">
                      {student.email}
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-green-100 text-green-700">
                      Activo
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Nota informativa */}
        <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-[12px] text-blue-700">
            <strong>Nota:</strong> Esta lista muestra todos los estudiantes
            inscritos en el curso. Para ver las entregas de una tarea
            específica, accede a la tarea desde el sidebar.
          </p>
        </div>
      </div>
    </Modal>
  );
}