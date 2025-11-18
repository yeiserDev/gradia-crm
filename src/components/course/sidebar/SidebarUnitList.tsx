'use client';

// --- ¡IMPORTACIÓN CORREGIDA! ---
import type { Unit } from '@/lib/types/core/course.model';
// import type { Unit } from '@/lib/types/course.types'; // 👈 ELIMINADO

import SidebarUnitItem from './SidebarUnitItem';

export default function SidebarUnitList({
  units,
  courseId,
  pathname,
  openUnitId,
  onToggle,
}: {
  units: Unit[]; // 👈 Este tipo 'Unit' ahora es el correcto
  courseId: string;
  pathname: string;
  openUnitId: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <ul className="grid gap-2">
      {units.map((u, idx) => (
        <SidebarUnitItem
          key={u.id}
          unit={u}
          unitOrder={idx + 1}
          courseId={courseId}
          pathname={pathname}
          open={openUnitId === u.id}
          onToggle={() => onToggle(u.id)}
        />
      ))}
    </ul>
  );
}