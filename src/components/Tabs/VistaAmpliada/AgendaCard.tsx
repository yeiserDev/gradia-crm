'use client';

import { Calendar as CalIcon } from 'iconsax-react';
import Card from './Card';
import DayTimeline from '@/components/dashboard/rightside/agenda/DayTimeline';

// --- ¡IMPORTACIÓN CORREGIDA! ---
import type { AgendaEvent } from '@/lib/types/core/agenda.model';
// import type { AgendaEvent } from '@/lib/utils/types-agenda'; // 👈 ELIMINADO

export default function AgendaCard({
  title = 'Mi agenda',
  selectedDate,
  events,
}: {
  title?: string;
  selectedDate: Date;
  events: AgendaEvent[]; // 👈 Ahora usa el tipo 'AgendaEvent' correcto
}) {
  const dateLabel = selectedDate.toLocaleDateString('es-PE', {
    weekday: 'short', day: '2-digit', month: 'short',
  }).replace('.', '');

  return (
    <Card
      title={title}
      icon={<CalIcon size={16} color="var(--brand)" />}
      action={
        <span className="inline-flex h-7 items-center rounded-full bg-[var(--section)] px-3 text-[12px]">
          {dateLabel}
        </span>
      }
    >
      {/* ¡OJO! Es probable que 'DayTimeline' sea tu próximo error,
        ya que también debe ser actualizado para aceptar el nuevo tipo 'AgendaEvent'.
      */}
      <DayTimeline events={events} showTitle={false} enhanced />
    </Card>
  );
}