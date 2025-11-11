'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeSlash } from 'iconsax-react';

import { useResetPassword } from '@/hooks/auth/useResetPassword';
import type { ResetPasswordPayload } from '@/lib/types/auth/password.model';

// Definimos el esquema de validación (incluyendo la confirmación local)
const schema = z.object({
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string().min(8, 'Mínimo 8 caracteres'),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Nota: El tipo 'ResetPasswordPayload' de la API solo necesita { token, newPassword }
type FormInput = { password: string; confirmPassword: string };

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token'); // 👈 Obtenemos el token de la URL

  // --- USAMOS EL HOOK ---
  const { reset, isLoading, errorMsg } = useResetPassword();

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  // (Eliminamos el 'useState' para loading, lo maneja el hook)

  const { register, handleSubmit, formState: { errors } } =
    useForm<FormInput>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormInput) {
    // 1. Verificamos que tengamos un token
    if (!token) {
      router.replace('/auth/forgot-password'); // Si no hay token, lo mandamos a empezar de nuevo
      return;
    }
    
    // 2. Llamamos a la mutación con los datos que la API espera
    const payload: ResetPasswordPayload = {
      token: token,
      newPassword: values.password // Solo enviamos el campo 'password'
    };
    
    reset(payload); // Disparamos la mutación
  }

  // Si el token es nulo (alguien entró a la ruta sin el enlace), mostramos un mensaje
  if (!token) {
    return (
      <div className="p-6 text-center">
        Token no encontrado. Por favor, usa el enlace enviado a tu correo.
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="mb-8">
        <h1 className="text-[32px] sm:text-[36px] font-semibold leading-tight">Nueva contraseña</h1>
        <p className="mt-2 text-[13px] text-[var(--muted)]">Ingresa tu nueva contraseña para continuar.</p>
      </div>
      
      {errorMsg && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs mb-1">Nueva contraseña</label>
          <div className="relative">
            <input
              type={show1 ? 'text' : 'password'}
              {...register('password')}
              className="w-full rounded-md border px-4 py-3 pr-12 text-sm bg-[var(--input)] border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              placeholder="Mínimo 8 caracteres"
            />
            <button type="button" onClick={() => setShow1(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
              {show1 ? <EyeSlash size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{String(errors.password.message)}</p>}
        </div>

        <div>
          <label className="block text-xs mb-1">Confirmar contraseña</label>
          <div className="relative">
            <input
              type={show2 ? 'text' : 'password'}
              {...register('confirmPassword')}
              className="w-full rounded-md border px-4 py-3 pr-12 text-sm bg-[var(--input)] border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              placeholder="Repite tu nueva contraseña"
            />
            <button type="button" onClick={() => setShow2(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)]">
              {show2 ? <EyeSlash size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{String(errors.confirmPassword.message)}</p>}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full py-3 text-sm font-medium bg-[var(--accent)] text-white disabled:opacity-60"
        >
          {isLoading ? 'Guardando…' : 'Guardar contraseña'}
        </motion.button>
      </form>
    </motion.div>
  );
}