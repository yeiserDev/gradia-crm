import type { ElementType } from 'react';

/**
 * Representa un ítem en el menú de aplicaciones.
 */
export interface AppItem {
  label: string;
  href: string;
  Icon: ElementType; // 👈 Esto acepta componentes, ej: <Book1 />
}