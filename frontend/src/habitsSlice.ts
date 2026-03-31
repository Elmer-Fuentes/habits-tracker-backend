import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// URL base del backend (cambia esto cuando hagas deploy en Vercel)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Utilidad para obtener el token desde localStorage
const getAuthHeader = (): Record<string, string> => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// GET /api/habits
export const fetchHabits = createAsyncThunk('habits/fetchHabits', async () => {
  const response = await fetch(`${API_URL}/api/habits`, {
    headers: getAuthHeader()
  });
  return response.json();
});

// POST /api/habits
export const addHabit = createAsyncThunk(
  'habits/addHabit',
  async (newHabit: { title: string; description: string }) => {
    const response = await fetch(`${API_URL}/api/habits`, {
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

// PUT /api/habits/:id/done
export const markHabitDone = createAsyncThunk(
  'habits/markDone',
  async (habitId: string) => {
    const response = await fetch(`${API_URL}/api/habits/${habitId}/done`, {
      method: 'PUT',
      headers: getAuthHeader()
    });
    return response.json();
  }
);

// DELETE /api/habits/:id
export const deleteHabit = createAsyncThunk(
  'habits/deleteHabit',
  async (habitId: string) => {
    await fetch(`${API_URL}/api/habits/${habitId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return habitId;
  }
);

const habitsSlice = createSlice({
  name: 'habits',
  initialState: {
    items: [] as any[],
    status: 'idle',
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchHabits.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchHabits.fulfilled, (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      state.status = 'succeeded';
    });
    builder.addCase(fetchHabits.rejected, (state) => {
      state.status = 'failed';
      state.error = 'No se pudo conectar con el servidor';
    });
    builder.addCase(markHabitDone.fulfilled, (state, action) => {
      const updatedHabit = action.payload.habit || action.payload;
      const index = state.items.findIndex((h: any) => h._id === updatedHabit._id);
      if (index !== -1) state.items[index] = updatedHabit;
    });
    builder.addCase(addHabit.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });
    builder.addCase(deleteHabit.fulfilled, (state, action) => {
      state.items = state.items.filter((h: any) => h._id !== action.payload);
    });
  },
});

export default habitsSlice.reducer;