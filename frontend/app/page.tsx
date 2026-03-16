'use client';

// ============================================================
// Archivo: page.tsx
// Descripción: Página principal del Habits Tracker.
//              Muestra lista de hábitos, barra de progreso,
//              botón Done y navegación al Login.
// ============================================================

//#region 1. IMPORTACIONES
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchHabits, markHabitDone, addHabit, deleteHabit } from '../src/habitsSlice';
//#endregion

export default function Home() {

  //#region 2. ESTADOS Y CONFIGURACIÓN
  const dispatch = useDispatch<any>();
  const router   = useRouter();
  const { items, status } = useSelector((state: any) => state.habits);

  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [doneMessage, setDoneMessage] = useState<string | null>(null);

  // Carga los hábitos desde MongoDB al iniciar la página
  useEffect(() => {
    dispatch(fetchHabits());
  }, [dispatch]);
  //#endregion

  //#region 3. LÓGICA DE NEGOCIO

  /**
   * Crea un nuevo hábito y limpia el formulario.
   * Solo se ejecuta si el título no está vacío.
   */
  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch(addHabit({ title, description: description || 'Meta diaria' }));
      setTitle('');
      setDescription('');
    }
  };

  /**
   * Marca un hábito como completado hoy.
   * Muestra mensaje de feedback según la respuesta del backend.
   * El backend aplica la lógica de racha (streak).
   */
  const handleDone = async (habitId: string) => {
    const result = await dispatch(markHabitDone(habitId));
    if (result.payload?.message === 'Habit already completed today') {
      setDoneMessage('¡Ya completaste este hábito hoy! 🎯');
    } else if (result.payload?.streak) {
      setDoneMessage(`¡Racha actualizada! Día ${result.payload.streak} de 66 🔥`);
    }
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => setDoneMessage(null), 3000);
  };

  /**
   * Determina el color de la barra de progreso según la racha.
   * Rojo   → 0 a 32% (inicio del hábito)
   * Amarillo → 33 a 65% (progreso medio)
   * Verde  → 66 a 100% (cerca o en la meta)
   */
  const getBarColor = (streak: number): string => {
    const pct = (streak / 66) * 100;
    if (pct < 33) return '#ef4444'; // rojo
    if (pct < 66) return '#f59e0b'; // amarillo
    return '#22c55e';               // verde
  };

  /**
   * Retorna un emoji motivacional según el nivel de racha.
   */
  const getStreakEmoji = (streak: number): string => {
    if (streak === 0) return '😴';
    if (streak < 10)  return '🌱';
    if (streak < 30)  return '🔥';
    if (streak < 60)  return '⚡';
    return '🏆';
  };

  //#endregion

  //#region 4. INTERFAZ DE USUARIO (UI)
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', sans-serif",
      color: '#fff'
    }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* ── ENCABEZADO con botón de navegación al Login ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{
              fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-2px',
              background: 'linear-gradient(90deg, #a78bfa, #60a5fa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0
            }}>
              HABITS TRACKER
            </h1>
            <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '0.9rem' }}>
              Método de los 66 días — Hábitos Atómicos
            </p>
          </div>

          {/* Botón para navegar al Login */}
          <button onClick={() => router.push('/Login')} style={{
            padding: '8px 18px', borderRadius: '10px',
            border: '1px solid rgba(167,139,250,0.4)',
            background: 'rgba(167,139,250,0.1)', color: '#c4b5fd',
            fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600
          }}>
            → Ir al Login
          </button>
        </div>

        {/* ── MENSAJE DE FEEDBACK al presionar Done ── */}
        {doneMessage && (
          <div style={{
            background: 'rgba(167,139,250,0.15)', border: '1px solid #a78bfa',
            borderRadius: '12px', padding: '12px 20px', marginBottom: '20px',
            textAlign: 'center', color: '#c4b5fd', fontSize: '0.95rem'
          }}>
            {doneMessage}
          </div>
        )}

        {/* ── FORMULARIO PARA CREAR NUEVO HÁBITO ── */}
        <section style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', padding: '28px', marginBottom: '32px'
        }}>
          <h2 style={{ margin: '0 0 18px', fontSize: '1.2rem', color: '#c4b5fd' }}>
            ✦ Nuevo Hábito
          </h2>
          <form onSubmit={handleAddHabit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="Título del hábito (ej. Leer)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                padding: '12px 16px', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff', fontSize: '1rem', outline: 'none'
              }}
            />
            <input
              type="text"
              placeholder="Descripción breve"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                padding: '12px 16px', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff', fontSize: '1rem', outline: 'none'
              }}
            />
            <button type="submit" style={{
              padding: '13px', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(90deg, #7c3aed, #4f46e5)',
              color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer'
            }}>
              + Crear Hábito
            </button>
          </form>
        </section>

        {/* Indicador de carga mientras se obtienen los hábitos */}
        {status === 'loading' && (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>Cargando hábitos...</p>
        )}

        {/* ── LISTA DE TARJETAS DE HÁBITOS ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {items && items.map((habit: any) => {
            const streak     = habit.streak || 0;
            const percentage = Math.min((streak / 66) * 100, 100);
            const barColor   = getBarColor(streak);
            const emoji      = getStreakEmoji(streak);

            return (
              <div key={habit._id} style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px', padding: '24px'
              }}>

                {/* Título, descripción y botón Done */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <h2 style={{ margin: '0 0 6px', fontSize: '1.4rem', fontWeight: 800 }}>
                      {emoji} {habit.title}
                    </h2>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.95rem' }}>
                      {habit.description}
                    </p>
                  </div>

                  {/* Botón Done: envía la acción al backend para registrar el día */}
                  <button onClick={() => handleDone(habit._id)} style={{
                    padding: '10px 22px', borderRadius: '12px', border: 'none',
                    background: 'linear-gradient(90deg, #059669, #10b981)',
                    color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
                    marginLeft: '16px', whiteSpace: 'nowrap'
                  }}>
                    ✓ Done
                  </button>
                </div>

                {/* Barra de progreso dinámica: cambia de color según la racha */}
                <div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px', fontWeight: 600
                  }}>
                    <span>Día {streak} de 66</span>
                    <span style={{ color: barColor }}>{percentage.toFixed(1)}%</span>
                  </div>

                  {/* Contenedor de la barra */}
                  <div style={{
                    width: '100%', height: '10px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '999px', overflow: 'hidden'
                  }}>
                    {/* Relleno animado que crece con la racha */}
                    <div style={{
                      width: `${percentage}%`, height: '100%',
                      background: barColor, borderRadius: '999px',
                      transition: 'width 0.8s ease, background 0.8s ease',
                      boxShadow: `0 0 8px ${barColor}`
                    }} />
                  </div>
                </div>

                {/* Botón para eliminar el hábito de MongoDB */}
                <div style={{ marginTop: '16px', textAlign: 'right' }}>
                  <button onClick={() => dispatch(deleteHabit(habit._id))} style={{
                    background: 'transparent', border: 'none', color: '#64748b',
                    fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline'
                  }}>
                    Eliminar hábito
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Mensaje cuando no hay hábitos registrados */}
        {items && items.length === 0 && status !== 'loading' && (
          <div style={{ textAlign: 'center', color: '#475569', marginTop: '40px' }}>
            <p style={{ fontSize: '2rem' }}>🌱</p>
            <p>Aún no tienes hábitos. ¡Crea el primero!</p>
          </div>
        )}

      </div>
    </main>
  );
  //#endregion
}