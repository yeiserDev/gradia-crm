'use client';
import Link from 'next/link';
import { useCallback, useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageText1 } from 'iconsax-react';
import { Flyout } from '@/components/ui/Flyout';
import { IconButton } from '@/components/ui/IconButton';
import { MenuSectionTitle, MenuList } from '@/components/ui/MenuPrimitives';

// --- 1. ¡IMPORTACIONES CORREGIDAS! ---
import { useMessages } from '@/hooks/core/useMessages'; // 👈 El nuevo hook
// (Se eliminan 'getMessages', 'MessageItem' y 'awaitWrap')

import { spring420 } from '@/lib/utils/motion'; // (Asumimos que esta ruta es correcta)

export function MessagesMenu() {
  const [open, setOpen] = useState(false);
  
  // --- 2. ¡LÓGICA DE DATOS CORREGIDA! ---
  // 'items', 'unread' y 'isLoading' ahora vienen de nuestro hook
  const { items, unread, isLoading } = useMessages();
  // (Se elimina 'useState', 'awaitWrap', etc.)
  
  const btnId = useId();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const toggle = useCallback(() => setOpen(v => !v), []);
  const close  = useCallback(() => setOpen(false), []);

  const badge = unread;

  return (
    <div className="relative">
      <IconButton id={btnId} label="Mensajes" onClick={toggle} hasBadge badgeCount={badge} btnRef={btnRef}>
        <MessageText1 size={24} color="var(--icon)" />
      </IconButton>

      <Flyout anchorRef={btnRef} open={open} onClose={close} align="right" width={340}>
        <MenuSectionTitle>Mensajes</MenuSectionTitle>
        
        {/* 3. Lógica de renderizado (con 'isLoading') */}
        {isLoading ? (
          <div className="px-2.5 pb-2 pt-4 text-center text-sm text-[var(--muted)]">Cargando...</div>
        ) : items.length === 0 ? (
          <div className="px-2.5 pb-2 pt-4 text-center text-sm text-[var(--muted)]">No hay mensajes nuevos.</div>
        ) : (
          <MenuList id={`${btnId}-menu`} aria-labelledby={btnId} className="px-2.5 pb-2">
            {items.map((m, i) => ( // 'items' ahora viene del hook
              <motion.li key={m.id}
                role="none"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring420, delay: 0.05 + i * 0.035 }}>
                <Link
                  href={`/messages/${m.id}`} onClick={close} role="menuitem"
                  className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 hover:bg-[var(--section)] transition"
                >
                  <span className="inline-grid place-items-center h-8 w-8 rounded-full bg-[var(--brand)]/10 border border-[var(--border)] text-[12px] text-[var(--brand)]">
                    {m.from.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium text-[var(--fg)] truncate">{m.from}</span>
                      <span className="text-[11px] text-[color:var(--muted)] ml-auto">{m.time}</span>
                    </div>
                    <p className="text-[12px] text-[var(--fg)]/80 line-clamp-2">{m.text}</p>
                  </div>
                  {m.unread && <span className="mt-1 h-2 w-2 rounded-full bg-[var(--brand)]" />}
                </Link>
              </motion.li>
            ))}
          </MenuList>
        )}

        <div className="px-3.5 pb-3 pt-1">
          <Link href="/messages" onClick={close}
            className="w-full inline-flex justify-center rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-[13px] hover:bg-[var(--section)] transition">
            Ver todos los mensajes
          </Link>
        </div>
      </Flyout>
    </div>
  );
}