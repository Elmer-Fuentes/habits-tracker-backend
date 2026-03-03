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