//import Users from "../models/Users";
//import jwt from "jsonwebtoken";

require("dotenv").config();

import { z } from 'zod';

// Esquema de validación (aunque no es estrictamente necesario aquí, lo añadimos por si necesitas validaciones de parámetros en el futuro)
const profileSchema = z.object({
  user: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    // Agrega más validaciones si lo necesitas
  })
});

export const getProfile = (req, res) => {
  try {
    const user = req.oidc.user;
    
    // Validar que el usuario exista en el objeto req.oidc.user
    const parsed = profileSchema.safeParse({ user });
    if (!parsed.success) {
      return res.status(400).json({
        status: 'Bad Request',
        errors: parsed.error.errors,
      });
    }

    res.send(JSON.stringify(user));  // Devuelve los datos del usuario autenticado
  } catch (error) {
    res.status(500).json({
      status: 'Error',
      message: 'An error occurred while fetching the profile'
    });
  }
};

export const getDashboard = (req, res) => {
  res.send('Bienvenido a tu dashboard');
};