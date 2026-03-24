import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// ============================================================
// Archivo: habitsSlice.ts
// Descripción: Estado global de hábitos con Redux Toolkit.
//              Actualizado: Librería Cookies y Tipado Headers (Semana 5).
// ============================================================

//#region Utilidad para obtener Token con Tipado Correcto
/**
 * Retorna el header de autorización tipado como HeadersInit para evitar
 * el error de sobrecarga en la función fetch.
 */
const getAuthHeader = (): Record<string, string> => {
  const token = Cookies.get('token'); // Punto 23: Uso de librería de cookies
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};
//#endregion

//#region 1. ACCIONES ASÍNCRONAS (Thunks - conexión al backend)

// 1.1 Obtener todos los hábitos desde MongoDB
export const fetchHabits = createAsyncThunk('habits/fetchHabits', async () => {
  const response = await fetch('http://localhost:3001/habits', {
    headers: getAuthHeader()
  });
  return response.json();
});

// 1.2 Crear un nuevo hábito en MongoDB (Punto 24)
export const addHabit = createAsyncThunk(
  'habits/addHabit',
  async (newHabit: { title: string; description: string }) => {
    const response = await fetch('http://localhost:3001/habits', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeader() 
      },
      body: JSON.stringify(newHabit),
    });
    return response.json();
  }
);

// 1.3 Marcar hábito como completado hoy (Punto 18: Lógica de racha)
export const markHabitDone = createAsyncThunk(
  'habits/markDone',
  async (habitId: string) => {
    const response = await fetch(`http://localhost:3001/habits/${habitId}/done`, {
      method: 'PUT',
      headers: getAuthHeader()
    });
    return response.json();
  }
);

// 1.4 Eliminar un hábito de MongoDB
export const deleteHabit = createAsyncThunk(
  'habits/deleteHabit',
  async (habitId: string) => {
    await fetch(`http://localhost:3001/habits/${habitId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return habitId;
  }
);

//#endregion

//#region 2. SLICE - ESTADO GLOBAL DE HÁBITOS

const habitsSlice = createSlice({
  name: 'habits',
  initialState: {
    items: [] as any[],
    status: 'idle',
    error: null as string | null,
  },
  reducers: {},

  extraReducers: (builder) => {
    //#region Casos de respuesta
    builder.addCase(fetchHabits.fulfilled, (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      state.status = 'succeeded';
    });
    builder.addCase(fetchHabits.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchHabits.rejected, (state) => {
      state.status = 'failed';
      state.error = 'No se pudo conectar con el servidor';
    });

    builder.addCase(markHabitDone.fulfilled, (state, action) => {
      const updatedHabit = action.payload.habit || action.payload;
      const index = state.items.findIndex((h: any) => h._id === updatedHabit._id);
      if (index !== -1) {
        state.items[index] = updatedHabit;
      }
    });

    builder.addCase(addHabit.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    builder.addCase(deleteHabit.fulfilled, (state, action) => {
      state.items = state.items.filter((h: any) => h._id !== action.payload);
    });
    //#endregion
  },
});

export default habitsSlice.reducer;
//#endregion