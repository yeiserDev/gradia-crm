'use client';

import { User, Sms, CallCalling } from 'iconsax-react';

export default function EditProfileModal({ isOpen, onClose, user }: { isOpen: boolean; onClose: () => void; user: { name: string; email?: string | null; phone?: string | null; bio?: string | null } }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Editar perfil</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--section)] transition">
            
          </button>
        </div>

        <form className="space-y-5">
          <div>
            <label className="text-[13px] font-medium text-[var(--muted)]">Nombre completo</label>
            <input
              defaultValue={user.name}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--section)] text-[14px]"
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-[var(--muted)] flex items-center gap-2">
              <Sms size={16} /> Correo
            </label>
            <input
              type="email"
              defaultValue={user.email ?? ''}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--section)] text-[14px]"
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-[var(--muted)] flex items-center gap-2">
              <CallCalling size={16} /> Teléfono
            </label>
            <input
              defaultValue={user.phone ?? ''}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--section)] text-[14px]"
            />
          </div>

          <div>
            <label className="text-[13px] font-medium text-[var(--muted)] flex items-center gap-2">
              <User size={16} /> Sobre mí
            </label>
            <textarea
              rows={4}
              defaultValue={user.bio ?? ''}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--section)] text-[14px] resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-[var(--border)] hover:bg-[var(--section)] transition text-[13px] font-medium">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2.5 rounded-xl text-white font-medium text-[13px]" style={{ backgroundColor: 'var(--accent-amber)' }}>
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}