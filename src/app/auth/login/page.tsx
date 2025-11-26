'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, EyeSlash, Sms, Lock } from 'iconsax-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import GoogleIcon from '@/components/auth/GoogleIcon';
import LoginLoader from '@/components/auth/LoginLoader';
import GoogleLoader from '@/components/auth/GoogleLoader';
import { useLogin } from '@/hooks/auth/useLogin';
import { LoginCredentials } from '@/lib/types/auth/login.model';
import { useGoogleLogin } from '@/hooks/auth/useGoogleLogin';

const schema = z.object({
  email: z.string().email('Correo inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

export default function LoginPage() {
  const { login, isLoading, errorMsg } = useLogin();
  const { loginWithGoogle, isLoading: isGoogleLoading } = useGoogleLogin();
  const [show, setShow] = useState(false);

  // Debug: ver cuándo cambia isLoading
  useEffect(() => {
    console.log('🔄 isLoading cambió a:', isLoading);
  }, [isLoading]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(schema),
  });

  function onSubmit(values: LoginCredentials) {
    console.log('🔐 Iniciando login...', { isLoading });
    login(values);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="w-full"
    >
      <div className="w-full max-w-lg mx0auto">
        {/* LOGO + Título */}
        <div className="mb-10 text-left">
          <div className="flex justify-start mb-6">
            <Image
              src="/logo/GradiaLogowhite.png"
              alt="Grad.IA Logo"
              width={48}
              height={48}
              className="block dark:hidden rounded-lg"
            />
            <Image
              src="/logo/GradiaLogoDark.png"
              alt="Grad.IA Logo"
              width={48}
              height={48}
              className="hidden dark:block rounded-lg"
            />
          </div>

          <h1 className="text-4xl font-light text-[var(--fg)] leading-tight">
            Inicia sesión
          </h1>
          <p className="mt-3 text-base text-[var(--muted)] leading-relaxed">
            Adquiere nuevas habilidades y optimiza tu <br />
            camino al éxito.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Correo */}
          <div>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none">
                <Sms size={22} color="var(--fg)" />
                <div className="h-6 w-px bg-[var(--border)]" />
              </div>

              <input
                type="email"
                {...register('email')}
                autoComplete="email"
                placeholder="tu@email.com"
                className="w-full rounded-full pl-16 pr-4 py-3.5 text-base
                  bg-[var(--input)] border border-[var(--border)] 
                  text-[var(--fg)] placeholder:text-[var(--muted)]
                  focus:outline-none focus:ring-2 focus:ring-[#30E3CA]/30 
                  focus:border-[#30E3CA] transition-all duration-200"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-[var(--accent-red)] mt-1 px-2 text-left">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Contraseña */}
          {/* Contraseña */}
          <div>
            <div className="relative">
              {/* ← AQUÍ ESTABA EL ERROR: faltaba "absolute" */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none">
                <Lock size={22} color="var(--fg)" />
                <div className="h-6 w-px bg-[var(--border)]" />
              </div>

              <input
                type={show ? 'text' : 'password'}
                {...register('password')}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-full pl-16 pr-12 py-3.5 text-base
        bg-[var(--input)] border border-[var(--border)] 
        text-[var(--fg)] placeholder:text-[var(--muted)]
        focus:outline-none focus:ring-2 focus:ring-[#30E3CA]/30 
        focus:border-[#30E3CA] transition-all duration-200"
              />

              <button
                type="button"
                onClick={() => setShow(s => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
              >
                {show ? <EyeSlash size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-sm text-[var(--accent-red)] mt-1 px-2 text-left">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error global */}
          {errorMsg && (
            <div className="rounded-2xl border border-[color-mix(in srgb,var(--accent-red) 30%,transparent)] bg-[color-mix(in srgb,var(--accent-red) 10%,transparent)] px-4 py-3 text-sm text-[var(--accent-red)] text-left">
              {errorMsg}
            </div>
          )}

          {/* Recuérdame + Olvidaste */}
          <div className="flex items-center justify-between pt-2">
            <label className="inline-flex items-center gap-3 text-sm text-[var(--muted)] cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  className="peer appearance-none w-5 h-5 border-2 border-[var(--border)] rounded-full 
                    bg-[var(--input)] checked:bg-gradient-to-br checked:from-[#30E3CA] checked:to-[#7DE69D] 
                    checked:border-transparent focus:outline-none focus:ring-2 focus:ring-[#30E3CA]/30 transition-all"
                  defaultChecked
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-white rounded-full shadow-md" />
                </div>
              </div>
              Recuérdame
            </label>

            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-[var(--fg)] hover:text-[#30E3CA] transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* BOTÓN PRINCIPAL CON GRADIENTE */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full rounded-full py-3.5 text-lg font-light text-white
              bg-gradient-to-r from-[#30E3CA] to-[#7DE69D]
              hover:from-[#25d6bb] hover:to-[#6ed88a]
              disabled:opacity-60 shadow-lg shadow-[#30E3CA]/30
              transition-all duration-300"
          >
            {isLoading ? <LoginLoader /> : 'Iniciar sesión'}
          </motion.button>

          {/* Separador */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-[var(--bg)] px-4 text-[var(--muted)]">
                O autorizar con
              </span>
            </div>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() => loginWithGoogle()}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-full
              border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--section)]
              py-3.5 text-lg font-medium text-[var(--fg)] transition-colors shadow-sm"
          >
            {isGoogleLoading ? (
              <GoogleLoader />
            ) : (
              <>
                <GoogleIcon className="w-6 h-6" />
                Continuar con Google
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 text-left">
          <p className="text-base text-[var(--muted)]">
            ¿No tienes cuenta?{' '}
            <Link
              href="/auth/register"
              className="font-medium text-[var(--fg)] hover:text-[#30E3CA] transition-colors"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}