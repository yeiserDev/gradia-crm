'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// 1. ¡IMPORTACIÓN CORREGIDA!
import type { GradePoint } from '@/lib/types/core/dashboard.model';

export default function GradeTrendChart({ data }: { data: GradePoint[] }) {
  
  // 2. (Recomendado) Asegurarse de que 'data' exista
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 h-[260px]">
        <div className="px-1 pb-2 text-[13px] font-medium">Evolución de notas</div>
        <div className="flex h-full items-center justify-center text-sm text-[var(--muted)]">
          No hay datos de notas.
        </div>
      </div>
    );
  }

  const mapped = data.map(d => ({ 
    ...d, 
    label: new Date(d.date).toLocaleDateString('es-PE') 
  }));
  
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 h-[260px]">
      <div className="px-1 pb-2 text-[13px] font-medium">Evolución de notas</div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={mapped}>
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 20]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="var(--brand)" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// 3. (Opcional) Esqueleto para el estado de carga
export const GradeTrendChartSkeleton = () => (
  <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 h-[260px] animate-pulse">
    <div className="px-1 pb-2 h-5 bg-[var(--border)] rounded w-1/3"></div>
    <div className="w-full h-[85%] bg-[var(--section)] rounded-md"></div>
  </div>
);