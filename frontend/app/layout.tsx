import './globals.css';
import { Providers } from './Providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <body className="bg-slate-50"></body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}