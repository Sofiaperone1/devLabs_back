import express, { Request, Response } from "express";
import { auth} from 'express-openid-connect';
import { connectDB } from "./database.js";
import tasksRouter from "./routes/tasks.js";
import userRouter from "./routes/user.js"
import cors from "cors";
//import { notFoundHandler, globalErrorHandler } from './middleware/errorMiddleware.js';
import dotenv from 'dotenv';

dotenv.config();

// Conectar a la base de datos
connectDB();

// Crear la aplicación de Express
const app = express();

// Middleware de CORS
// Configura CORS para permitir solicitudes de tu frontend
const corsOptions = {
  origin: 'https://dev-labs-front.vercel.app', // URL de tu frontend desplegado en Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
};

app.use(cors(corsOptions)); // Usa el middleware de CORS

// Middleware para analizar JSON
app.use(express.json());

// Configuración de Auth0
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL || 'http://localhost:4000',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
};

// Agregar el router de autenticación de Auth0
app.use(auth(config));

// Rutas de tareas
app.use("/tasks", tasksRouter);
app.use("/user", userRouter);

// Ruta protegida de ejemplo
//app.get('/protected', requiresAuth(), (req, res) => {
//  res.send(`Hello ${req.oidc.user?.name}`);
//});

// Manejo de errores
//app.use(notFoundHandler);
//app.use(globalErrorHandler);

// Ruta principal
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Hello World",
  });
});

// Establecer puerto para producción y desarrollo
const PORT = process.env.PORT || 4000;

// Iniciar el servidor solo si no está en un entorno de prueba
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
  });
}

// Exportar la aplicación para pruebas o despliegue en Vercel
export default app;
