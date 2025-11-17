'use client';

import { useEffect, useMemo, useState } from 'react';

// --- 1. ¡IMPORTACIÓN CORREGIDA! ---
import type { AgendaEvent } from '@/lib/types/core/agenda.model';
// import type { AgendaEvent } from '@/lib/utils/types-agenda'; // 👈 ELIMINADO

type Props = { events: AgendaEvent[]; showTitle?: boolean; enhanced?: boolean };

export default function DayTimeline({ events, showTitle = true, enhanced = false }: Props) {
  const startHour = 8;
  const collapsedEnd = 13;
  const expandedEnd = 20;

  const rowHeight = typeof window !== 'undefined' && window.innerWidth < 640 ? 28 : 32;

  const [expanded, setExpanded] = useState(false);
  const endHour = expanded ? expandedEnd : collapsedEnd;

  const slots = useMemo(() => {
    const a: { label: string; isHour: boolean }[] = [];
    for (let h = startHour; h <= endHour; h++) {
      a.push({ label: `${pad2(h)}:00`, isHour: true });
      if (h < endHour) a.push({ label: `${pad2(h)}:30`, isHour: false });
    }
    return a;
  }, [startHour, endHour]);

  // --- 2. ESTA LÓGICA ESTÁ BIEN ---
  // (Porque nuestro nuevo 'AgendaEvent' SÍ tiene 'start' y 'end')
  const items = useMemo(() => {
    const toIndex = (d: Date) =>
      (d.getHours() - startHour) * 2 + (d.getMinutes() >= 30 ? 1 : 0);

    const maxIdx = slots.length;

    return [...events]
      .map((e) => {
        const s = new Date(e.start);
        const t = new Date(e.end);
        // ... (el resto de la lógica de 'items' está bien)
        const startMin = s.getHours() * 60 + s.getMinutes();
        const endMin = t.getHours() * 60 + t.getMinutes();
        const visStartMin = startHour * 60;
        const visEndMin = endHour * 60;
        if (endMin <= visStartMin || startMin >= visEndMin) return null;
        const rawStart = toIndex(s);
        const rawEnd = toIndex(t) + 1;
        const startIdx = clamp(rawStart, 0, maxIdx - 1);
        const endIdx = clamp(rawEnd, 1, maxIdx);
        if (startIdx >= endIdx) return null;
        return { e, startIdx, endIdx };
      })
      .filter(Boolean)
      .sort((a, b) => (a && b ? a.startIdx - b.startIdx : 0)) as Array<{
        e: AgendaEvent; startIdx: number; endIdx: number;
      }>;
  }, [events, slots.length, startHour, endHour]);

  const [, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 60000); return () => clearInterval(id); }, []);

  const gridRowsStyle = { gridTemplateRows: `repeat(${slots.length}, ${rowHeight}px)` };

  // ... (La lógica de 'nowLine' también está bien porque usa 'e.start') ...
  const now = new Date();
  const sameDay = events.some(e => {
    const d = new Date(e.start);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  });
  const nowIdx = (now.getHours() - startHour) * 2 + (now.getMinutes() >= 30 ? 1 : 0);
  const showNowLine = enhanced && sameDay && now.getHours() >= startHour && now.getHours() <= endHour;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      {showTitle && <div className="text-[14px] font-semibold mb-3">Agenda del día</div>}

      <div className="relative grid grid-cols-[64px_minmax(0,1fr)] sm:grid-cols-[72px_minmax(0,1fr)]" style={gridRowsStyle}>
        {/* ... (JSX de etiquetas y líneas se queda igual) ... */}
        {slots.map((s, i) => (
          <div
            key={`lbl-${i}`}
            className={[
              'col-start-1 col-end-2 flex items-center justify-end pr-2 text-[11px] sm:text-[12px]',
              s.isHour ? 'text-[var(--fg)]' : 'text-[color:var(--muted)]',
            ].join(' ')}
            style={{ gridRow: `${i + 1} / ${i + 2}` }}
          >
            {s.label}
          </div>
        ))}
        {slots.map((s, i) => (
          <div
            key={`line-${i}`}
            className={[
              'col-start-2 col-end-3 border-b border-dashed',
              s.isHour ? 'border-[var(--border)]' : 'border-[color:var(--border)]/60',
              enhanced && s.isHour ? 'bg-[var(--section)]/25' : '',
            ].join(' ')}
            style={{ gridRow: `${i + 1} / ${i + 2}` }}
          />
        ))}
        {showNowLine && nowIdx >= 0 && nowIdx < slots.length && (
          <div
            className="pointer-events-none absolute left-[72px] right-0 h-[2px] bg-rose-500/80"
            style={{ top: `calc(${nowIdx} * ${rowHeight}px + ${rowHeight / 2}px)` }}
          />
        )}
        
        {/* --- 3. EL LLAMADO A EventTile ESTÁ BIEN --- */}
        {/* (El error está DENTRO de EventTile) */}
        {items.map(({ e, startIdx, endIdx }) => (
          <EventTile
            key={e.id}
            event={e}
            style={{ gridColumn: '2 / 3', gridRow: `${startIdx + 1} / ${endIdx + 1}` }}
            enhanced={enhanced}
          />
        ))}

        {items.length === 0 && (
          <div className="col-start-2 col-end-3 flex items-center text-[13px] text-[color:var(--muted)]">
            No hay eventos para este rango.
          </div>
        )}
      </div>

      <div className="pt-3">
        <button
          onClick={() => setExpanded(v => !v)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--section)] py-2 text-[14px] hover:bg-[var(--card)] transition"
        >
          {expanded ? 'Mostrar menos horas' : 'Ver más horas'}
        </button>
      </div>
    </div>
  );
}

// --- 4. ¡AQUÍ ESTÁ LA CORRECCIÓN PRINCIPAL! ---
function EventTile({
  event,
  style,
  enhanced,
}: {
  event: AgendaEvent; // 👈 Ahora es el tipo 'AgendaEvent' NUEVO
  style: React.CSSProperties;
  enhanced?: boolean;
}) {
  const end = new Date(event.end);
  const endHM = end.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });

  // Lógica de color actualizada (basada en 'event.type' y no 'event.color')
  const color =
    event.type === 'task'
      ? 'bg-emerald-200/60 text-emerald-900 border-emerald-300'
      : event.type === 'meeting'
      ? 'bg-violet-200/60 text-violet-900 border-violet-300'
      : 'bg-[var(--section)] text-[var(--fg)] border-[var(--border)]';

  const bodyBase = [
    'w-full rounded-xl border shadow-sm px-2 py-2 flex flex-col justify-center',
    'transition hover:shadow-md',
    color,
    enhanced ? 'backdrop-blur-[1px]' : '',
  ].join(' ');

  const inner = (
    <div className={bodyBase}>
      {/* Lógica de título actualizada (usa 'event.title' y no 'event.course') */}
      <div className="text-[12px] sm:text-[13px] font-semibold leading-tight">{event.title}</div>
      <div className="text-[10px] sm:text-[11px] font-extrabold opacity-80">{endHM}</div>
      
      {/* El tipo nuevo no tiene 'description', por lo que esta línea
          evaluará a 'false' y no se renderizará (lo cual está bien). */}
      {event.description && (
        <p className="text-[12px] sm:text-[12px] opacity-90 line-clamp-2">{event.description}</p>
      )}
    </div>
  );

  // El tipo nuevo no tiene 'href', así que eliminamos el '<a>' tag
  return (
    <div style={style}>{inner}</div>
  );
}

/* utils (sin cambios) */
function pad2(n: number) { return String(n).padStart(2, '0'); }
function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }