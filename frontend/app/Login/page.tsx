'use client';

// ============================================================
// Archivo: app/Login/page.tsx
// Descripción: Página de autenticación — Login y Registro.
//              Permite crear cuenta o iniciar sesión.
//              Al autenticarse, redirige a la página principal.
// ============================================================

//#region 1. IMPORTACIONES
import { useState } from 'react';
import { useRouter } from 'next/navigation';
//#endregion

export default function LoginPage() {

  //#region 2. ESTADOS
  const router = useRouter();

  const [isLogin, setIsLogin]   = useState(true);   // true = login | false = registro
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);
  //#endregion

  //#region 3. LÓGICA DE AUTENTICACIÓN

  /**
   * Maneja el envío del formulario.
   * Llama a /users/register o /users/login según el modo activo.
   * En login exitoso guarda el token JWT y redirige al inicio.
   * En registro exitoso muestra mensaje y cambia al modo login.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Selecciona el endpoint según si es login o registro
    const endpoint = isLogin
      ? 'http://localhost:3001/users/login'
      : 'http://localhost:3001/users/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Muestra el error que devuelve el servidor
        setError(data.message || 'Ocurrió un error, intenta de nuevo.');
      } else {
        if (isLogin) {
          // Guardar token JWT en localStorage para mantener la sesión
          if (data.token) localStorage.setItem('token', data.token);
          // Redirigir a la página principal de hábitos
          router.push('/');
        } else {
          // Registro exitoso: cambiar a modo login con mensaje de confirmación
          setSuccess('¡Cuenta creada! Ahora inicia sesión.');
          setIsLogin(true);
          setEmail('');
          setPassword('');
        }
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor. ¿Está corriendo el backend?');
    } finally {
      setLoading(false);
    }
  };

  //#endregion

  //#region 4. INTERFAZ DE USUARIO (UI)
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif", padding: '20px'
    }}>
      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px', padding: '40px',
        backdropFilter: 'blur(12px)'
      }}>

        {/* ── TÍTULO ── */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <h1 style={{
            fontSize: '2.2rem', fontWeight: 900, letterSpacing: '-1.5px',
            background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            margin: '0 0 8px'
          }}>
            HABITS TRACKER
          </h1>
          <p style={{ color: '#94a3b8', margin: '0 0 12px', fontSize: '0.9rem' }}>
            {isLogin ? 'Inicia sesión para continuar' : 'Crea tu cuenta gratis'}
          </p>

          {/* Botón para volver a la página principal */}
          <button onClick={() => router.push('/')} style={{
            background: 'transparent', border: 'none',
            color: '#64748b', fontSize: '0.8rem',
            cursor: 'pointer', textDecoration: 'underline'
          }}>
            ← Volver a Habits Tracker
          </button>
        </div>

        {/* ── TABS LOGIN / REGISTRO ── */}
        <div style={{
          display: 'flex', background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px', padding: '4px', margin: '24px 0'
        }}>
          {['Iniciar Sesión', 'Registrarse'].map((label, i) => (
            <button key={label}
              onClick={() => { setIsLogin(i === 0); setError(null); setSuccess(null); }}
              style={{
                flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
                background: (isLogin && i === 0) || (!isLogin && i === 1)
                  ? 'linear-gradient(90deg, #7c3aed, #4f46e5)' : 'transparent',
                color: '#fff', fontWeight: 600, fontSize: '0.9rem',
                cursor: 'pointer', transition: 'background 0.3s'
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── FORMULARIO ── */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Campo correo electrónico */}
          <div>
            <label style={{
              color: '#c4b5fd', fontSize: '0.85rem',
              fontWeight: 600, display: 'block', marginBottom: '6px'
            }}>
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Campo contraseña */}
          <div>
            <label style={{
              color: '#c4b5fd', fontSize: '0.85rem',
              fontWeight: 600, display: 'block', marginBottom: '6px'
            }}>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '12px 16px', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff', fontSize: '1rem', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Mensaje de error del servidor */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444',
              borderRadius: '10px', padding: '10px 14px',
              color: '#fca5a5', fontSize: '0.85rem'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Mensaje de éxito tras registro */}
          {success && (
            <div style={{
              background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e',
              borderRadius: '10px', padding: '10px 14px',
              color: '#86efac', fontSize: '0.85rem'
            }}>
              ✅ {success}
            </div>
          )}

          {/* Botón de envío */}
          <button type="submit" disabled={loading} style={{
            padding: '14px', borderRadius: '12px', border: 'none',
            background: loading
              ? 'rgba(255,255,255,0.1)'
              : 'linear-gradient(90deg, #7c3aed, #4f46e5)',
            color: '#fff', fontWeight: 700, fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px'
          }}>
            {loading ? 'Cargando...' : isLogin ? 'Entrar →' : 'Crear cuenta →'}
          </button>

        </form>
      </div>
    </main>
  );
  //#endregion
}