'use client';

import { Edit2, Calendar, CallCalling, Sms, User, Add, Logout } from 'iconsax-react';
import { useState } from 'react';
import { useLogout } from '@/hooks/auth/useLogout';
import EditProfileModal from './EditProfileModal';

type ProfileFormProps = {
  user: {
    name: string;
    org?: string | null;
    role: 'STUDENT' | 'TEACHER';
    email?: string | null;
    memberSince?: string;
    phone?: string | null;
    bio?: string | null;
  };
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { logout, isLoading } = useLogout();

  const roleLabel = user.role === 'TEACHER' ? 'Docente' : 'Estudiante';

  return (
    <div className="space-y-6">
      {/* HERO - igual que antes pero con botón de cerrar sesión */}
      <section
        className="rounded-3xl p-6 sm:p-8"
        style={{
          background:
            'radial-gradient(1200px 480px at 20% -10%, rgba(var(--brand-rgb)/0.15) 0%, rgba(var(--brand-rgb)/0.05) 40%, transparent 70%)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[clamp(22px,2.6vw,28px)] font-semibold text-[var(--fg)]">
              Perfil
            </h1>
            <p className="mt-1 text-[13px] text-[color:var(--muted)]">
              Tu panel de identidad y asignaciones.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl px-4 h-10 text-[13px] font-semibold text-white shadow-sm transition hover:shadow"
              style={{ backgroundColor: 'var(--accent-amber)' }}
            >
              <Edit2 size={16} color="#fff" />
              Editar perfil
            </button>

            <button
              onClick={() => logout()}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl px-4 h-10 text-[13px] font-medium border border-[var(--border)] hover:bg-red-500/5 transition"
            >
              <Logout size={16} color="var(--accent-red)" />
              {isLoading ? 'Saliendo...' : 'Salir'}
            </button>
          </div>
        </div>
      </section>

      {/* CARD PRINCIPAL - exactamente igual que antes */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
          {/* IZQUIERDA */}
          <div>
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--section)] text-[14px] font-semibold text-[var(--fg)]">
                {getInitials(user.name)}
              </div>
              <div>
                <div className="text-[17px] font-semibold text-[var(--fg)]">
                  {user.name}
                </div>
                <div className="text-[13px] text-[color:var(--muted)]">
                  {user.org ?? 'UPeU'}
                </div>
              </div>
            </div>

            {/* ACERCA DE */}
            <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--section)] p-4">
              <div className="flex items-center gap-2 text-[13px] font-medium text-[color:var(--muted)] mb-1.5">
                <User size={16} color="var(--icon)" />
                Acerca de
              </div>
              <p className="text-[14px] text-[var(--fg)] min-h-[20px]">
                {user.bio?.trim() || '—'}
              </p>
            </div>
          </div>

          {/* DERECHA */}
          <div className="grid grid-cols-2 gap-3">
            <InfoTile
              icon={<User size={15} color="var(--icon)" />}
              label="Rol"
              value={roleLabel}
            />
            <InfoTile
              icon={<Calendar size={15} color="var(--icon)" />}
              label="Miembro desde"
              value={user.memberSince ?? '01 Ene 2024'}
            />
            <InfoTile
              icon={<Sms size={15} color="var(--icon)" />}
              label="Correo"
              value={user.email ?? 'alumno@gradia.edu'}
            />
            <InfoTile
              icon={<CallCalling size={15} color="var(--icon)" />}
              label="Teléfono"
              value={user.phone ?? '+51 9xx xxx xxx'}
            />
          </div>
        </div>
      </section>

      {/* ASIGNACIONES - igual que tenías */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)]">
        <div className="p-4 border-b border-[var(--border)] text-[13px] font-semibold text-[color:var(--muted)]">
          Mis asignaciones
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--section)] p-4">
            <div className="text-[13px] text-[color:var(--muted)]">
              Trabajos actuales
            </div>
            <div className="text-[13px] font-medium text-[var(--fg)]">
              0 en curso • 0 completados
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl px-4 h-9 text-[13px] font-medium text-white transition"
              style={{ backgroundColor: 'var(--accent-amber)' }}
            >
              <Add size={16} color="#fff" />
              Asignar nuevo
            </button>
          </div>
        </div>
      </section>

      {/* MODAL */}
      <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} user={user} />
    </div>
  );
}

// Componentes originales (sin tocar)
function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--section)] p-4">
      <div className="flex items-center gap-2 text-[12px] text-[color:var(--muted)] mb-1">
        {icon}
        {label}
      </div>
      <div className="text-[14px] font-semibold text-[var(--fg)]">{value}</div>
    </div>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}