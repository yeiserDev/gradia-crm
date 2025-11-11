'use client';

import { useAuth } from '@/context/AuthProvider'; // 👈 Usamos el nuevo hook
import type { Role } from '@/lib/types/core/role.model'; // 👈 Usamos el tipo 'Role'
import TaskRolePanelClient from './TaskRolePanelClient';

export default function TaskRolePanelBridge({
  courseId,
  taskId,
}: {
  courseId: string;
  taskId: string;
}) {
  
  // --- 2. USAMOS EL NUEVO HOOK ---
  const { user, isAuthenticated } = useAuth();
  // const user = useCurrentUser(); // 👈 ELIMINADO

  // 3. ESTADO DE CARGA / GUARDIA
  // Si el usuario no ha cargado, no mostramos nada.
  if (!isAuthenticated || !user) {
    return null; // O un esqueleto de carga
  }

  // 4. "TRADUCCIÓN" DE ROL
  // Convertimos el array 'user.roles' al string 'Role' que el hijo espera
  let userRole: Role = 'ESTUDIANTE'; // Rol por defecto
  if (user.roles.includes('DOCENTE')) {
    userRole = 'DOCENTE';
  } else if (user.roles.includes('ADMIN')) {
    userRole = 'ADMIN';
  }

  // --- 5. PASAMOS EL ROL CORRECTO ---
  return <TaskRolePanelClient role={userRole} courseId={courseId} taskId={taskId} />;
}