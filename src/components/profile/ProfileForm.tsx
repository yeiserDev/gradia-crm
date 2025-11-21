'use client';

import { Edit2, Calendar, CallCalling, Sms, User, Add, Logout, Key } from 'iconsax-react';
import { useState } from 'react';
import { useLogout } from '@/hooks/auth/useLogout';
import EditProfileModal from './EditProfileModal';

// --- NUEVOS IMPORTS ---
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useChangePassword } from '@/hooks/auth/useChangePassword';

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
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const { logout, isLoading: isLogoutLoading } = useLogout();

  const roleLabel = user.role === 'TEACHER' ? 'Docente' : 'Estudiante';

  return (
    <div className="space-y-6">
      {/* HERO */}
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

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsEditOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl px-4 h-10 text-[13px] font-semibold text-white shadow-sm transition hover:shadow"
              style={{ backgroundColor: 'var(--accent-amber)' }}
            >
              <Edit2 size={16} color="#fff" />
              Editar perfil
            </button>

            <button
              onClick={() => setIsPasswordOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl px-4 h-10 text-[13px] font-semibold text-white shadow-sm transition hover:shadow"
              style={{ backgroundColor: 'var(--accent-blue)' }}
            >
              <Key size={16} color="#fff" />
              Cambiar contraseña
            </button>

            <button
              onClick={() => logout()}
              disabled={isLogoutLoading}
              className="inline-flex items-center gap-2 rounded-xl px-4 h-10 text-[13px] font-medium border border-[var(--border)] hover:bg-red-500/5 transition"
            >
              <Logout size={16} color="var(--accent-red)" />
              {isLogoutLoading ? 'Saliendo...' : 'Salir'}
            </button>
          </div>
        </div>
      </section>

      {/* CONTENEDOR EN DOS COLUMNAS */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* IZQUIERDA */}
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--section)] text-[16px] font-semibold text-[var(--fg)]">
                {getInitials(user.name)}
              </div>
              <div>
                <div className="text-[18px] font-semibold text-[var(--fg)]">
                  {user.name}
                </div>
                <div className="text-[13px] text-[color:var(--muted)]">
                  {user.org ?? 'UPeU'}
                </div>
              </div>
            </div>

            {/* ACERCA DE */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--section)] p-4">
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
          <div className="grid grid-cols-2 gap-4">
            <InfoTile icon={<User size={15} color="var(--icon)" />} label="Rol" value={roleLabel} />
            <InfoTile icon={<Calendar size={15} color="var(--icon)" />} label="Miembro desde" value={user.memberSince ?? '01 Ene 2024'} />
            <InfoTile icon={<Sms size={15} color="var(--icon)" />} label="Correo" value={user.email ?? 'alumno@gradia.edu'} />
            <InfoTile icon={<CallCalling size={15} color="var(--icon)" />} label="Teléfono" value={user.phone ?? '+51 9xx xxx xxx'} />
          </div>
        </div>
      </section>

      {/* FILA ABAJO — ASIGNACIONES */}
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
        </div>
      </section>

      {/* MODALES */}
      <EditProfileModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} user={user} />

      {isPasswordOpen && (
        <PasswordModal onClose={() => setIsPasswordOpen(false)} />
      )}
    </div>
  );
}

/* ---------------- COMPONENTES ---------------- */

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

/* ---------------- MODAL CAMBIAR CONTRASEÑA (REFACTORIZADO) ---------------- */

// Esquema de validación
const passwordSchema = z.object({
  oldPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma tu nueva contraseña'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

function PasswordModal({ onClose }: { onClose: () => void }) {
  // Usamos nuestro nuevo hook
  const { performChange, isLoading, errorMsg, isSuccess, reset } = useChangePassword();

  const { register, handleSubmit, formState: { errors }, reset: resetForm } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = (values: PasswordFormValues) => {
    performChange({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
  };

  // Si fue exitoso, mostramos un mensaje y botón de cerrar
  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="rounded-3xl w-full max-w-sm bg-[var(--card)] border border-[var(--border)] p-6 text-center">
          <h2 className="text-[18px] font-semibold text-green-600 mb-2">¡Contraseña Actualizada!</h2>
          <p className="text-[13px] text-[var(--muted)] mb-4">Tu contraseña ha sido cambiada correctamente.</p>
          <button
            onClick={() => { reset(); onClose(); }}
            className="text-[13px] px-5 py-2.5 rounded-xl bg-[var(--brand)] text-white"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="rounded-3xl w-full max-w-sm bg-[var(--card)] border border-[var(--border)] p-6 space-y-4">
        <h2 className="text-[18px] font-semibold text-[var(--fg)]">Cambiar contraseña</h2>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[12px]">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <input
              type="password"
              {...register('oldPassword')}
              placeholder="Contraseña actual"
              className="w-full h-11 px-3 rounded-xl bg-[var(--section)] border border-[var(--border)] text-[14px] outline-none focus:border-[var(--brand)]"
            />
            {errors.oldPassword && <p className="text-red-500 text-[11px] mt-1 ml-1">{errors.oldPassword.message}</p>}
          </div>

          <div>
            <input
              type="password"
              {...register('newPassword')}
              placeholder="Nueva contraseña"
              className="w-full h-11 px-3 rounded-xl bg-[var(--section)] border border-[var(--border)] text-[14px] outline-none focus:border-[var(--brand)]"
            />
            {errors.newPassword && <p className="text-red-500 text-[11px] mt-1 ml-1">{errors.newPassword.message}</p>}
          </div>

          <div>
            <input
              type="password"
              {...register('confirmPassword')}
              placeholder="Confirmar nueva contraseña"
              className="w-full h-11 px-3 rounded-xl bg-[var(--section)] border border-[var(--border)] text-[14px] outline-none focus:border-[var(--brand)]"
            />
            {errors.confirmPassword && <p className="text-red-500 text-[11px] mt-1 ml-1">{errors.confirmPassword.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { reset(); onClose(); }}
              className="text-[13px] px-4 py-2 rounded-xl border border-[var(--border)] hover:bg-[var(--section)] transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="text-[13px] px-4 py-2 rounded-xl text-white font-medium transition disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent-blue)' }}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}