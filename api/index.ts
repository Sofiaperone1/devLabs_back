import express from "express";
import type { Request, Response } from "express";
import { connectDB } from "./database.js";
import tasksRouter from "./routes/tasks.js";
import cors from "cors";
import dotenv from 'dotenv';
import { auth } from 'express-oauth2-jwt-bearer';
import { notFoundHandler, globalErrorHandler } from './middleware/errorMiddleware.ts';

// Configurar dotenv
dotenv.config();

// Crear la aplicación Express
const app = express();

// Conectar a la base de datos
connectDB();

// Configurar CORS
const corsOptions = {
    origin: ['https://dev-labs-front.vercel.app', 'http://localhost:3000' ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Configurar el middleware de Auth0
const checkJwt = auth({
    audience: 'https://dev-labs-api/',
    issuerBaseURL: 'https://dev-zkygxlxjb67xsubp.us.auth0.com/',
    tokenSigningAlg: 'RS256'
});

// Aplicar middlewares
app.use(cors(corsOptions));
app.use(express.json());


// Configurar rutas
app.use("/tasks", checkJwt, tasksRouter);

// Ruta principal
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello World" });
});

app.use(notFoundHandler);
app.use(globalErrorHandler);

// Verificar que app sea una instancia de Express
console.log('App initialized:', typeof app.listen === 'function');



// Iniciar el servidor solo si no está en un entorno de prueba
if (process.env.NODE_ENV !== "test") {
    const PORT: number = parseInt(process.env.PORT || "4000", 10);
    const server = app.listen(PORT, () => {
        console.log(`Servidor ejecutándose en el puerto ${PORT}`);
    });
}

export default app;
