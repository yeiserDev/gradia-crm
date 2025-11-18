'use client';

import { useEffect, useMemo, useState } from 'react';

// --- 1. ¡IMPORTACIONES CORREGIDAS! ---
import { useAgenda } from '@/hooks/core/useAgenda'; // 👈 El hook "inteligente"
import type { AgendaEvent } from '@/lib/types/core/agenda.model'; // 👈 El tipo nuevo
// (Se eliminan 'fetchMonthEvents' y el tipo antiguo)

import BigClock from './agenda/BigClock';
import MonthCalendar from './agenda/MonthCalendar';
import DayTimeline from './agenda/DayTimeline';

export default function RightAgendaRail({ className = '' }: { className?: string }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0-11
  const [selectedDate, setSelectedDate] = useState(new Date(now.getFullYear(), now.getMonth(), now.getDate()));

  // --- 2. ¡LÓGICA DE DATOS CORREGIDA! ---
  // 'events' y 'isLoading' (opcional) ahora vienen de React Query
  const { events, isLoading } = useAgenda(year, month);
  
  // (Se eliminan el 'useState' para 'events' y el 'useEffect' con 'fetchMonthEvents')

  const dayEvents = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth();
    const d = selectedDate.getDate();
    return events // 👈 'events' ahora viene del hook
      .filter(e => {
        const st = new Date(e.start);
        return st.getFullYear() === y && st.getMonth() === m && st.getDate() === d;
      })
      .sort((a, b) => +new Date(a.start) - +new Date(b.start));
  }, [events, selectedDate]);

  return (
    <aside
      className={[
        'w-full sm:w-[400px] lg:w-[340px] xl:w-[320px] shrink-0 space-y-4',
        'lg:sticky lg:top-[calc(var(--header-h)+var(--rail-gap))]',
        className,
      ].join(' ')}
    >
      <BigClock />
      <MonthCalendar
        year={year}
        month={month}
        events={events}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onPrev={() => setMonth(m => (m === 0 ? (setYear(y => y - 1), 11) : m - 1))}
        onNext={() => setMonth(m => (m === 11 ? (setYear(y => y + 1), 0) : m + 1))}
      />
      <DayTimeline events={dayEvents} />
    </aside>
  );
}