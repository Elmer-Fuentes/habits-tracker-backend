import './globals.css';
import {Providers} from './Providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-50">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}