import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

//#region Conexion al BACKEND (SEMANA 1 Y 2)
// Este es el GET que pide la guía para conectar con tu Backend
// export const fetchHabits = createAsyncThunk('habits/fetchHabits', async () => {
//   const response = await fetch('http://localhost:3001/habits'); // Tu puerto de la semana 1
//   return response.json();
// });


//const habitsSlice = createSlice({
 // name: 'habits',
 // initialState: { items: [], status: 'idle' },
 // reducers: {},
 // extraReducers: (builder) => {
 //   builder.addCase(fetchHabits.fulfilled, (state, action) => {
 //     state.items = action.payload;
 //   });
 // },
// });

// export default habitsSlice.reducer;
//#endregion

 //#region 2. ESTADO Semana 3)
const habitsSlice = createSlice({
  name: 'habits',
  
 
  initialState: {
    // Estos son los datos de prueba para que Tailwind dibujar la lista en pantalla
    items: [
      { _id: '1', name: 'Leer Hábitos Atómicos' },
      { _id: '2', name: 'Hacer ejercicio 30 min' },
      { _id: '3', name: 'Beber 2 litros de agua' }
    ],
    status: 'idle',
    error: null as string | null,
  },

  
  reducers: {},

  });

export default habitsSlice.reducer;
  //#endregion