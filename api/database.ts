import mongoose from "mongoose";
import dotenv from "dotenv";

// Cargar las variables de entorno usando dotenv
dotenv.config();

export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    const db = await mongoose.connect(process.env.MONGO_URL || '');
    console.log("dbb", db.connection.name);
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("colecciones", collections);
  } catch (error: any) {
    console.error("Error conectando a la base de datos:", error.message);
    process.exit(1);
  }
};