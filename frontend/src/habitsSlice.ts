import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ============================================================
// Archivo: habitsSlice.ts
// Descripción: Estado global de hábitos con Redux Toolkit.
//              Conecta el frontend con el backend Express + MongoDB.
// ============================================================

//#region 1. ACCIONES ASÍNCRONAS (Thunks - conexión al backend)

// 1.1 Obtener todos los hábitos desde MongoDB
export const fetchHabits = createAsyncThunk('habits/fetchHabits', async () => {
  const response = await fetch('http://localhost:3001/habits');
  return response.json();
});

// 1.2 Crear un nuevo hábito en MongoDB
export const addHabit = createAsyncThunk(
  'habits/addHabit',
  async (newHabit: { title: string; description: string }) => {
    const response = await fetch('http://localhost:3001/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newHabit),
    });
    return response.json();
  }
);

// 1.3 Marcar hábito como completado hoy → activa lógica de racha en backend
// IMPORTANTE: usa PUT /habits/:id/done (mismo método y ruta definida en index.js)
export const markHabitDone = createAsyncThunk(
  'habits/markDone',
  async (habitId: string) => {
    const response = await fetch(`http://localhost:3001/habits/${habitId}/done`, {
      method: 'PUT',
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
    });
    return habitId; // Retornamos el id para removerlo del estado
  }
);

//#endregion

//#region 2. SLICE - ESTADO GLOBAL DE HÁBITOS

const habitsSlice = createSlice({
  name: 'habits',
  initialState: {
    items: [] as any[],       // Lista de hábitos cargados desde MongoDB
    status: 'idle',           // idle | loading | succeeded | failed
    error: null as string | null,
  },
  reducers: {},

  // extraReducers escucha las acciones asíncronas y actualiza el estado
  extraReducers: (builder) => {

    //#region Caso A: Cargar hábitos
    builder.addCase(fetchHabits.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = 'succeeded';
    });
    builder.addCase(fetchHabits.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchHabits.rejected, (state) => {
      state.status = 'failed';
      state.error = 'No se pudo conectar con el servidor';
    });
    //#endregion

    //#region Caso B: Marcar como Done (actualiza racha en pantalla)
    builder.addCase(markHabitDone.fulfilled, (state, action) => {
      // El backend devuelve { habit: {...}, streak, completedDays }
      const updatedHabit = action.payload.habit || action.payload;
      const index = state.items.findIndex((h: any) => h._id === updatedHabit._id);
      if (index !== -1) {
        state.items[index] = updatedHabit;
      }
    });
    //#endregion

    //#region Caso C: Agregar nuevo hábito
    builder.addCase(addHabit.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
    //#endregion

    //#region Caso D: Eliminar hábito
    builder.addCase(deleteHabit.fulfilled, (state, action) => {
      state.items = state.items.filter((h: any) => h._id !== action.payload);
    });
    //#endregion

  },
});

export default habitsSlice.reducer;

//#endregion