import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

// Importaciones
import { ThemeProvider } from '@/components/providers/ThemeProvider'; // Tu wrapper
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthProvider } from '@/context/AuthProvider';

export const metadata: Metadata = {
  title: 'GradIA',
  description: 'LMS con IA',
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
        
      </body>
    </html>
  );
}