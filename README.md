# Habits Tracker - Fullstack

Este proyecto es una solución integral diseñada para ayudar a las personas a gestionar sus hábitos diarios, inspirada en el libro "Hábitos Atómicos" de James Clear.

## Estructura del Repositorio
El proyecto se organiza en dos carpetas principales para separar el servidor de la interfaz de usuario:

* **/backend**: API REST construida con **Node.js**, **Express.js** y **MongoDB Atlas**.
* **/frontend**: Aplicación web desarrollada con **Next.js** y **Redux** para la gestión de estados.

---

## Instrucciones de Ejecución

### 1. Configuración del Backend (Servidor)
1.  Navegar a la carpeta: `cd backend`.
2.  **Instalar dependencias**: Ejecutar `npm install`.
3.  **Variables de entorno**: Configurar el archivo `.env` con:
    * `MONGO_URI`: mongodb+srv://delacruzelmer27_db_user:ozBucYhOGuqRalIt@cluster0.rkngviu.mongodb.net/habitosApp?retryWrites=true&w=majority.
    * `PORT`: 3001.
4.  **Iniciar el servidor**: Ejecutar `npm start`.

### 2. Configuración del Frontend (Next.js)
1.  Navegar a la carpeta: `cd frontend`.
2.  **Instalar dependencias**: Ejecutar `npm install`.
3.  **Iniciar desarrollo**: Ejecutar `npm run dev` para visualizar en `http://localhost:3000`.

---

## Historial de Entregas

### Semana 1: Setup Inicial y API
* **Configuración Express**: Estructura inicial del servidor.
* **Base de Datos**: Conexión exitosa a **MongoDB Atlas** mediante **Mongoose**.
* **Endpoints CRUD**: 
    * `GET /habits`: Lista todos los hábitos.
    * `POST /habits`: Crea un nuevo hábito.
    * `DELETE /habits/:id`: Elimina un hábito por su ID.

### Semana 2: Frontend y Gestión de Estados
* **Next.js**: Configuración inicial del proyecto frontend.
* **Redux**: Integración para el manejo global de datos de hábitos.
* **Integración GET**: Request al backend para sincronizar la lista de hábitos en la interfaz.
* **Reorganización**: Separación física del proyecto en carpetas `/backend` y `/frontend`.

---

## Rama de Entrega Actual
* Todo el progreso de la segunda fase se encuentra en la rama: **`semana2`**.


### Semana 3: Diseño Avanzado con Tailwind y Persistencia Visual
En esta fase se transformó la interfaz de usuario de un diseño básico a uno profesional y se optimizó el flujo de datos con Redux.

* **Tailwind CSS Integration**: 
    * Configuración de `globals.css` con directivas `@tailwind`.
    * Diseño "Mobile First" y responsivo utilizando clases de utilidad.
    * Uso de sombras (`shadow-xl`), bordes redondeados (`rounded-3xl`) y tipografía moderna (`font-sans`).
* **Redux Toolkit (Mock Data)**:
    * Implementación de datos de prueba (*Initial State*) para asegurar la visualización sin dependencia del backend.
    * Uso de `useSelector` para mapear dinámicamente la lista de hábitos en el componente principal.
* **Componentes de UI Requeridos**:
    * **Barra de Progreso**: Implementada con contenedores dinámicos y transiciones suaves (`transition-all`).
    * **Botón "Done"**: Integración estética del botón de acción en cada tarjeta de hábito.
    * **Indicadores de Estado**: Etiquetas visuales ("ACTIVO") para identificar hábitos vigentes.
* **Arquitectura de React (App Router)**:
    * Creación de un `Providers.tsx` para encapsular el contexto de Redux en el `layout.tsx`.

#### Tecnologías Incorporadas (Nuevos Paquetes)
* `tailwindcss`, `postcss`, `autoprefixer`: Motor de estilos.
* `@reduxjs/toolkit` & `react-redux`: Gestión de estado global.

---

## Rama de Entrega Actual
* Todo el progreso de la tercera fase se encuentra en la rama: **`Semana3`**.


### Semana 4: Autenticación, Racha de Días y Barra de Progreso Dinámica
En esta fase se implementó la lógica completa de racha de días, autenticación de usuarios con JWT y una interfaz rediseñada con tema oscuro.

#### Backend
* **Modelo `Habit.js` actualizado**:
  * Se agregaron los campos `streak` (días consecutivos), `completedDays` (total acumulado) y `lastCompletedAt` (última fecha de completado).
* **Nuevo endpoint `PUT /habits/:id/done`**:
  * Implementa la lógica de racha: si el hábito fue completado ayer, incrementa `streak`; si no, lo reinicia a 1.
  * Evita doble registro si el hábito ya fue marcado el mismo día.
* **Autenticación de usuarios (`users.js`)**:
  * `POST /users/register`: Registra un nuevo usuario con contraseña hasheada usando **bcryptjs**.
  * `POST /users/login`: Valida credenciales y retorna un **token JWT** con expiración de 24 horas.
  * La clave secreta JWT se lee desde la variable de entorno `JWT_SECRET`.

#### Frontend
* **`habitsSlice.ts` actualizado**:
  * Corrección del endpoint a `PUT /habits/:id/done`.
  * Se agregó la acción `deleteHabit` para eliminar hábitos desde la UI.
  * Manejo de estados `loading`, `succeeded` y `failed` para cada acción asíncrona.
* **`page.tsx` (página principal) rediseñada**:
  * Tema oscuro con gradiente y tarjetas con efecto glassmorphism.
  * **Barra de progreso dinámica**: cambia de color según el avance (🔴 rojo → 🟡 amarillo → 🟢 verde).
  * **Botón ✓ Done**: conectado al backend, muestra mensaje de feedback con la racha actualizada.
  * Emojis motivacionales según el nivel de racha: 😴 🌱 🔥 ⚡ 🏆.
  * Botón para navegar al Login (`→ Ir al Login`).
  * Botón para eliminar hábitos individuales.
* **`Login/page.tsx` (nueva página)**:
  * Formulario con tabs para **Iniciar Sesión** y **Registrarse** en una sola vista.
  * Guarda el token JWT en `localStorage` tras el login exitoso.
  * Redirige automáticamente a la página principal tras autenticarse.
  * Botón `← Volver a Habits Tracker` para navegar sin necesidad de autenticarse.
  * Mensajes de error y éxito con diseño visual diferenciado.
* **Documentación con `#region`**:
  * Todos los archivos `.ts`, `.tsx` y `.js` están organizados con bloques `#region` / `#endregion` y comentarios descriptivos por sección.

#### Tecnologías Incorporadas
* `bcryptjs`: Hash seguro de contraseñas.
* `jsonwebtoken`: Generación y verificación de tokens JWT.
* `next/navigation` (`useRouter`): Navegación programática entre páginas en Next.js.

> Rama de entrega: **`semana4`**
