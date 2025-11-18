import type { AppItem } from '@/lib/types/core/app.model';

// Importamos los iconos que usaremos
import { 
  Book1, 
  Calendar, 
  TaskSquare, 
  MessageTick, 
  People, 
  Setting2 
} from 'iconsax-react';

/**
 * (SIMULADO) Lista de aplicaciones disponibles en el menú
 */
export const apps: AppItem[] = [
  { 
    label: 'Cursos', 
    href: '/dashboard/courses', // (Ruta simulada)
    Icon: Book1 
  },
  { 
    label: 'Agenda', 
    href: '/dashboard', // (Ruta simulada)
    Icon: Calendar 
  },
  { 
    label: 'Tareas', 
    href: '/dashboard', // (Ruta simulada)
    Icon: TaskSquare 
  },
  { 
    label: 'Notas', 
    href: '/dashboard', // (Ruta simulada)
    Icon: MessageTick 
  },
  { 
    label: 'Equipo', 
    href: '/dashboard', // (Ruta simulada)
    Icon: People 
  },
  { 
    label: 'Ajustes', 
    href: '/dashboard', // (Ruta simulada)
    Icon: Setting2 
  },
];