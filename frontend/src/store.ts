import { configureStore } from '@reduxjs/toolkit';
import habitsReducer from './habitsSlice'; // Importas el reducer que exportaste arriba

export const store = configureStore({
  reducer: {
    habits: habitsReducer, // Aquí le dices a Redux que use tu lógica de hábitos
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;