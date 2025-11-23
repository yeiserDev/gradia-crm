'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from '@/lib/utils/motion';
import { DocumentUpload, Video, DocumentText, VideoPlay, Link as LinkIcon } from 'iconsax-react';
import { getMaterialsByActivityStudent } from '@/lib/services/core/materialService';
import type { Material } from '@/lib/types/core/material.model';

type Props = {
  role: 'STUDENT' | 'TEACHER';
  courseId: string;
  taskId: string;
};

export default function TaskSubmitPanelClient({ role, taskId }: Props) {
  const [hover, setHover] = useState<'file' | 'record' | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(true);

  const isTeacher = role === 'TEACHER';

  // Cargar materiales de la actividad
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoadingMaterials(true);
        const data = await getMaterialsByActivityStudent(taskId);
        setMaterials(data);
      } catch (error) {
        console.error('Error al cargar materiales:', error);
      } finally {
        setLoadingMaterials(false);
      }
    };

    if (taskId) {
      fetchMaterials();
    }
  }, [taskId]);

  const getMaterialIcon = (tipo: string) => {
    switch (tipo) {
      case 'pdf':
      case 'doc':
      case 'docx':
        return <DocumentText size={18} color="var(--brand)" />;
      case 'video':
        return <VideoPlay size={18} color="var(--brand)" />;
      case 'link':
        return <LinkIcon size={18} color="var(--brand)" />;
      default:
        return <DocumentText size={18} color="var(--brand)" />;
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      {/* Izquierda: descripción y materiales */}
      <div className="space-y-4">
        <motion.section
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .25 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
        >
          <div className="text-[13px] font-medium text-[color:var(--muted)] mb-2">Descripción</div>

          <div className="relative pl-3">
            <div className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-[var(--brand)]/70" />
            <h3 className="font-semibold">Tarea t1: Taller de análisis exploratorio</h3>
          </div>

          <p className="mt-3 text-[14px] leading-relaxed">
            Prepara un EDA breve con hallazgos clave y adjunta tu notebook con el
            preprocesamiento. Usa visualizaciones simples y justifica decisiones de limpieza.
          </p>

          <ul className="mt-3 list-disc pl-6 text-[14px] space-y-1">
            <li>Contexto del problema</li>
            <li>Datos disponibles y calidad</li>
            <li>KPIs candidatos</li>
          </ul>
        </motion.section>

        {/* Materiales de apoyo */}
        {!loadingMaterials && materials.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .25, delay: .1 }}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <div className="text-[13px] font-medium text-[color:var(--muted)] mb-3">
              Material de apoyo ({materials.length})
            </div>

            <ul className="space-y-2">
              {materials.map((material) => (
                <li key={material.id_documento_actividad}>
                  <a
                    href={material.url_archivo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--section)] px-3 py-2.5 hover:bg-[var(--border)] transition group"
                  >
                    <div className="flex-shrink-0">
                      {getMaterialIcon(material.tipo_documento)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium text-[var(--fg)] truncate group-hover:text-[var(--brand)]">
                        {material.nombre_documento}
                      </div>
                      <div className="text-[12px] text-[color:var(--muted)] uppercase">
                        {material.tipo_documento}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <DocumentUpload size={16} color="var(--icon)" className="rotate-180" />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </motion.section>
        )}
      </div>

      {/* Derecha: entrega */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .25, delay: .05 }}
        className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-[13px] font-medium text-[color:var(--muted)]">Entrega</div>
          <div className="text-[12px] text-[color:var(--muted)]">
            Archivos subidos: <span className="font-semibold text-[var(--fg)]">{files.length}</span>
          </div>
        </div>

        {/* Zona drag & drop (simplificada) */}
        <div
          className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--section)] p-6 grid place-items-center"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const dropped = Array.from(e.dataTransfer.files);
            setFiles((prev) => [...prev, ...dropped]);
          }}
        >
          <div className="text-center">
            <div className="text-[13px] mb-1">Arrastra y suelta aquí</div>
            <div className="text-[12px] text-[color:var(--muted)]">o elige una opción</div>

            {/* Botones circulares con tooltip hover */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onMouseEnter={() => setHover('file')}
                onMouseLeave={() => setHover(null)}
                className="h-11 w-11 rounded-full border border-[var(--border)] bg-[var(--card)] grid place-items-center hover:shadow-sm"
                onClick={async () => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.onchange = () => {
                    const picked = Array.from(input.files ?? []);
                    setFiles((prev) => [...prev, ...picked]);
                  };
                  input.click();
                }}
                aria-label="Adjuntar archivo"
              >
                <DocumentUpload size={20} color="var(--icon)" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onMouseEnter={() => setHover('record')}
                onMouseLeave={() => setHover(null)}
                className="h-11 w-11 rounded-full border border-[var(--border)] bg-[var(--card)] grid place-items-center hover:shadow-sm"
                onClick={() => alert('Simular “Grabarme en vivo”')}
                aria-label="Grabarme en vivo"
              >
                <Video size={20} color="var(--icon)" />
              </motion.button>
            </div>

            {/* Tooltip */}
            <AnimatePresence>
              {hover && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-2 inline-block rounded-full px-3 py-1 text-[12px] border border-[var(--border)] bg-[var(--card)]"
                >
                  {hover === 'file' ? 'Adjuntar archivo' : 'Grabarme en vivo'}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Lista simple de archivos */}
        <ul className="mt-4 space-y-2">
          {files.map((f, i) => (
            <li key={i} className="text-[13px] flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--section)] px-3 py-2">
              <span className="truncate">{f.name}</span>
              <button
                onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                className="text-[12px] underline decoration-dotted hover:opacity-80"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>

        {/* Acciones (si es profesor, cambia el CTA) */}
        <div className="mt-4">
          {isTeacher ? (
            <button className="w-full h-11 rounded-xl bg-[var(--brand)]/10 border border-[var(--brand)]/40 text-[var(--brand)] font-medium hover:bg-[var(--brand)]/15">
              Revisar entregas
            </button>
          ) : (
            <button className="w-full h-11 rounded-xl bg-[var(--brand)] text-white font-medium hover:opacity-95">
              Enviar mi tarea
            </button>
          )}
        </div>
      </motion.section>
    </div>
  );
}
