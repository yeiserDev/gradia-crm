'use client';

import { useEffect, useMemo, useState } from 'react';

// --- 1. IMPORTACIONES CORREGIDAS ---
import NotesCard from './NotesCard'; // 👈 El 'NotesCard' inteligente
import AgendaCard from './AgendaCard';
import CalendarCard from './CalendarCard';
import ClockCard from './ClockCard';

// (Importamos nuestros nuevos hooks y tipos)
import { useAgenda } from '@/hooks/core/useAgenda';
import type { AgendaEvent } from '@/lib/types/core/agenda.model';

// (Se eliminan 'fetchMonthEvents', 'types-agenda', y el viejo 'useNotes')

export default function VistaAmpliadaTab() {
  
  // (Se elimina userId = 'u1')

  // -------- Agenda (eventos) --------
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth()); // 0..11
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // --- 2. USAMOS EL NUEVO HOOK DE AGENDA ---
  // 'events' y 'loading' ahora vienen de React Query
  const { events, isLoading: loading } = useAgenda(year, month);
  
  // (Se elimina el 'useState' para events y loading)
  // (Se elimina el 'useEffect' que llamaba a fetchMonthEvents)

  // Esta lógica se mantiene
  const dayEvents = useMemo(() => {
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth();
    const d = selectedDate.getDate();
    return events.filter(e => {
      const st = new Date(e.start);
      return st.getFullYear() === y && st.getMonth() === m && st.getDate() === d;
    });
  }, [events, selectedDate]);

  const goPrevMonth = () => setMonth(m => (m === 0 ? (setYear(y => y - 1), 11) : m - 1));
  const goNextMonth = () => setMonth(m => (m === 11 ? (setYear(y => y + 1), 0) : m + 1));

  // -------- Notas (LocalStorage por usuario) --------
  // --- 3. SE ELIMINA EL VIEJO 'useNotes' ---
  // (El componente NotesCard ahora se encarga de esto internamente)
  
  if (loading) return <div className="p-6 text-[13px] text-[color:var(--muted)]">Cargando…</div>;

  return (
    <div className="va-bg grid gap-5 lg:gap-6 grid-cols-1 lg:grid-cols-[1.2fr_1fr_0.85fr]">
      {/* IZQUIERDA: Notas + Hora actual */}
      <div className="space-y-5">
        
        {/* --- 4. 'NotesCard' AHORA ES INDEPENDIENTE --- */}
        <NotesCard /> 
        {/* (Se eliminan todas las props: items, onToggle, onCreate, etc.) */}
        
        <ClockCard />
      </div>

      {/* CENTRO: Agenda del día (sin cambios) */}
      <div className="space-y-5 lg:max-w-[520px]">
        <AgendaCard
          title="Mi agenda"
          selectedDate={selectedDate}
          events={dayEvents}
        />
      </div>

      {/* DERECHA: Calendario (sin cambios) */}
      <div className="space-y-5 lg:sticky lg:top-[calc(var(--header-h)+16px)] self-start">
        <CalendarCard
          year={year}
          month={month}
          selectedDate={selectedDate}
          events={events} // 👈 Pasa los eventos del hook
          onPrev={goPrevMonth}
          onNext={goNextMonth}
          onSelectDate={setSelectedDate}
        />
      </div>
    </div>
  );
}