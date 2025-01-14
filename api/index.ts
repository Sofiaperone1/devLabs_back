import express from "express";
import type { Request, Response } from "express";
import { connectDB } from "./database.js";
import tasksRouter from "./routes/tasks.js";
import userRouter from "./routes/user.js";
import cors from "cors";
import dotenv from 'dotenv';

// Configurar dotenv
dotenv.config();

// Crear la aplicación Express
const app = express();

// Conectar a la base de datos
connectDB();

// Configurar CORS
const corsOptions = {
    origin: 'https://dev-labs-front.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Aplicar middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Configurar rutas
app.use("/tasks", tasksRouter);
app.use("/user", userRouter);

// Ruta principal
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello World" });
});

// Verificar que app sea una instancia de Express
console.log('App initialized:', typeof app.listen === 'function');

// Iniciar el servidor solo si no está en un entorno de prueba
if (process.env.NODE_ENV !== "test") {
    const PORT = process.env.PORT || 4000;
    const server = app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
}

export default app;
