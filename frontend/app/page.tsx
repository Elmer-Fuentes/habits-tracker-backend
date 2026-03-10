'use client';
//import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchHabits } from '../src/habitsSlice';
// import { RootState, AppDispatch } from '../src/store';

export default function Home() {
  // const dispatch = useDispatch<AppDispatch>();
  // const { items } = useSelector((state: RootState) => state.habits);
  const { items } = useSelector((state: any) => state.habits);

  // useEffect(() => {
  //   dispatch(fetchHabits());
  // }, [dispatch]);

  return (
    <main className="min-h-screen bg-slate-50 p-10 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-black text-slate-900 mb-2 text-center">
          Habits Tracker
        </h1>
        <p className="text-center text-slate-500 mb-12 text-lg">
          Método de los 66 días para hábitos atómicos
        </p>
        
        <div className="grid gap-8">
          {items.map((habit: any) => (
            <div key={habit._id} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  {/* <h2 className="text-3xl font-bold text-slate-800">{habit.title}</h2>
                  <p className="text-xl text-slate-600 mt-2">{habit.description}</p> */}
                  <h2 className="text-3xl font-bold text-slate-800">{habit.name}</h2>
                  <p className="text-xl text-slate-600 mt-2">Construyendo el hábito diario...</p>                 
                </div>
                <span className="bg-blue-100 text-blue-700 text-xs font-black px-4 py-2 rounded-full tracking-widest">
                  ACTIVO
                </span>
                {/* agregar el boton done  */}
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-colors">
                    Done
                  </button>

              </div>
              
              <div className="mt-10">
                <div className="flex justify-between text-base font-bold text-slate-500 mb-3">
                  <span>Día 1 de 66</span>
                  <span className="text-red-600">1.5% completado</span>
                </div>
                
                {/* BARRA DE PROGRESO VISUAL */}
                <div className="w-full bg-slate-100 rounded-full h-5 overflow-hidden shadow-inner">
                  <div 
                    className="bg-red-500 h-full rounded-full transition-all duration-1000" 
                    style={{ width: '1.5%' }}
                  ></div>
                </div>
              </div>
              
              <p className="text-sm text-slate-400 mt-6 italic text-center border-t pt-4">
                * Recuerda: si fallas un día, el contador vuelve a cero.
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}