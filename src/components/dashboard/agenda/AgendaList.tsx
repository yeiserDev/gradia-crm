'use client';
// 1. ¡IMPORTACIÓN CORREGIDA!
import type { AgendaItem } from '@/lib/types/core/dashboard.model';

export default function AgendaList({ items }: { items: AgendaItem[] }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="p-3 border-b border-[var(--border)] text-[13px] font-medium">Agenda</div>
      
      {/* 2. (Recomendado) Manejo de "no hay items" */}
      {items.length === 0 ? (
        <div className="p-3 text-sm text-[color:var(--muted)]">
          No hay eventos en tu agenda.
        </div>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {items.map(ev => (
            <li key={ev.id} className="p-3 flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-6 px-2 rounded-full bg-[var(--section)] text-[11px] font-medium">
                {ev.type}
              </span>
              <div className="min-w-0">
                <div className="text-[14px] font-medium">{ev.title}</div>
                <div className="text-[12px] text-[color:var(--muted)]">
                  {new Date(ev.when).toLocaleString('es-PE')} {ev.location ? `• ${ev.location}` : ''}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// 3. (Opcional) Esqueleto para el estado de carga
export const AgendaListSkeleton = () => (
  <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] animate-pulse">
    <div className="p-3 border-b border-[var(--border)] h-5 bg-[var(--border)] rounded-t-lg w-1/4"></div>
    <ul className="divide-y divide-[var(--border)]">
      {[...Array(2)].map((_, i) => (
        <li key={i} className="p-3 flex items-start gap-3">
          <span className="mt-0.5 h-6 w-12 rounded-full bg-[var(--section)]"></span>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-4 bg-[var(--border)] rounded w-3/4"></div>
            <div className="h-3 bg-[var(--border)] rounded w-1/2"></div>
          </div>
        </li>
      ))}
    </ul>
  </div>
);