import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Este es el GET que pide la guía para conectar con tu Backend
export const fetchHabits = createAsyncThunk('habits/fetchHabits', async () => {
  const response = await fetch('http://localhost:3001/habits'); // Tu puerto de la semana 1
  return response.json();
});

const habitsSlice = createSlice({
  name: 'habits',
  initialState: { items: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchHabits.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export default habitsSlice.reducer;