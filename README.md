# Habits Tracker - Backend (Semana 1)

Proyecto inicial para la gestión de hábitos, desarrollado con **Node.js**, **Express.js** y **MongoDB Atlas** utilizando la librería **Mongoose**.

## Instrucciones de ejecución

1. **Instalar dependencias:**
   Ejecutar `npm install` en la terminal para instalar todos los módulos necesarios.

2. **Configuración de variables de entorno:**
   Crear un archivo `.env` en la raíz del proyecto con la siguiente configuración:
   - `MONGO_URI`: mongodb+srv://delacruzelmer27_db_user:ozBucYhOGuqRalIt@cluster0.rkngviu.mongodb.net/habitosApp?retryWrites=true&w=majority
   - `PORT`: 3001

3. **Iniciar el servidor:**
   Ejecutar el siguiente comando para poner en marcha la aplicación:
   ```bash
   npm start


   ## Endpoints desarrollados
- **GET /habits**: Lista todos los hábitos.
- **POST /habits**: Crea un nuevo hábito (requiere title y description).
- **DELETE /habits/:id**: Elimina un hábito por su ID único.