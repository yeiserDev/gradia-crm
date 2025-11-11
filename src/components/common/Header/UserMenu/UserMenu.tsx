'use client';
import Link from 'next/link';
import { useCallback, useId, useState } from 'react';
import Popover from '@/components/ui/Propover'; // (Asumo que la ruta es correcta)
import ThemeToggleMenuItem from './ThemeToggleMenuItem';
import type { UiUser } from '@/lib/types/core/user.model';
import { useLogout } from '@/hooks/auth/useLogout';

import {
  TagUser, Book, Award, AlignBottom,
  MessageQuestion, Setting2, Logout, Briefcase
} from 'iconsax-react';

type Props = { user: UiUser };

export default function UserMenu({ user }: Props) {
  const [open, setOpen] = useState(false);
  const btnId = useId();
  
  // Lógica de rol corregida (agrupa 'DOCENTE' y 'ADMIN')
  const isTeacher = user.role === 'DOCENTE' || user.role === 'ADMIN';
  
  const toggle = useCallback(() => setOpen(v => !v), []);
  const close  = useCallback(() => setOpen(false), []);
  
  // Hook de Logout
  const { logout, isLoading } = useLogout();

  return (
    <div className="relative flex items-center gap-2">
      <button id={btnId} type="button" onClick={toggle} className="flex items-center gap-2">
        <span className="inline-grid place-items-center h-9 w-9 rounded-full bg-[var(--brand)] text-white text-sm">
          {user.name.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase()}
        </span>
        <div className="hidden sm:block text-left">
          <div className="text-[14px] font-medium text-[var(--fg)]">{user.name}</div>
          <div className="text-[12px] text-[color:var(--muted)]">{user.org ?? ''}</div>
        </div>
      </button>

      <Popover isOpen={open} onClose={close} align="right" className="mt-3">
        <MenuHeader 
          roleLabel={user.role === 'ADMIN' ? 'Admin' : (isTeacher ? 'Docente' : 'Estudiante')}
          iconName={isTeacher ? 'teacher' : 'student'} 
        />

        <ul id={`${btnId}-menu`} role="menu" aria-labelledby={btnId} className="pb-2">
          <li><MenuLink href="/profile" onSelect={close} icon={<TagUser size={18} color="var(--icon)" />}>Perfil</MenuLink></li>
          
          {isTeacher ? (
            <li><MenuLink href="/courses" onSelect={close} icon={<Book size={18} color="var(--icon)" />}>Mis cursos</MenuLink></li>
          ) : (
            <>
              <li><MenuLink href="/certificates" onSelect={close} icon={<Award size={18} color="var(--icon)" />}>Certificados</MenuLink></li>
              <li><MenuLink href="/grades" onSelect={close} icon={<AlignBottom size={18} color="var(--icon)" />}>Calificaciones</MenuLink></li>
            </>
          )}

          <li><MenuDivider /></li>

          <li><MenuLink href="/help" onSelect={close} icon={<MessageQuestion size={18} color="var(--icon)" />}>Centro de ayuda</MenuLink></li>
          <li><MenuLink href="/settings" onSelect={close} icon={<Setting2 size={18} color="var(--icon)" />}>Ajustes</MenuLink></li>
          <li><ThemeToggleMenuItem className="menu-row" /></li>

          <li><MenuDivider /></li>

          <li>
            <button
              role="menuitem"
              onClick={() => {
                close();
                logout(); 
              }}
              disabled={isLoading}
              className="menu-row w-full text-left"
            >
              <span className="menu-icon"><Logout size={18} color="var(--accent-red)" className="text-[--accent-red]" /></span>
              <span className="menu-text">{isLoading ? 'Cerrando...' : 'Cerrar sesión'}</span>
            </button>
          </li>
        </ul>
      </Popover>
    </div>
  );
}

// --- Subcomponentes (sin cambios) ---

function MenuHeader({ roleLabel, iconName }:{ roleLabel: string; iconName: 'student'|'teacher' }) {
  const icon = iconName === 'student'
    ? <Book size={14} color="var(--brand)" />
    : <Briefcase size={14} color="var(--brand)" />;

  return (
    <div className="px-3.5 pt-3 pb-2">
      <div className="flex items-center gap-2.5 rounded-t-xl border border-[var(--border)]
                      bg-[var(--section)] px-2.5 py-1.5">
        <span className="inline-grid place-items-center h-6 w-6 rounded-full bg-[var(--card)] border border-[var(--border)]">
          {icon}
        </span>
        <span className="text-[14px] leading-none font-medium text-[var(--fg)]">{roleLabel}</span>
      </div>
    </div>
  );
}

function MenuLink({ href, icon, children, onSelect }: { href: string; icon: React.ReactNode; children: React.ReactNode; onSelect?: () => void; }) {
  return (
    <Link href={href} role="menuitem" onClick={onSelect} className="menu-row">
      <span className="menu-icon">{icon}</span>
      <span className="menu-text">{children}</span>
    </Link>
  );
}

function MenuDivider() {
  return <div className="h-px my-2 bg-[var(--border)]" role="separator" />;
}