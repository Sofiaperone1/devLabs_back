import Tasks from "../models/Tasks.js";
import { z } from 'zod';
import dotenv from 'dotenv'; 


export const getTask = async (req, res, next) => {
  try {
   const { id } = req.params;
    const task = await Tasks.findOne({id:id}); 
    
    if (!task) {
      return res.status(404).json({
        status: 'Not Found',
        message: `Task with id ${id} not found`
      });
    }

    console.log("La tarea traida es:", task);

    res.status(200).json({
      status: 'OK',
      data: task
    });
  } catch (error) {
    next(error); // Pasamos el error al middleware global
  }
};



export const getAllTasks = async (req, res, next) => {
  try {
    const allTasks = await Tasks.find();
   
    console.log("trayendo las tareas: ", allTasks)
    res.status(200).send(allTasks)
  } catch (error) {
    next(error); // Pasamos el error al middleware global
  }
};



// Esquema de validación para crear una tarea
const taskSchema = z.object({
  description: z.string().min(1, 'Description is required'),  // Validación para la descripción
  date: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: 'Invalid date format',  // Validación de formato de fecha
  })
});




export const createTasks = async (req, res, next) => {
  try {
    // Validar el cuerpo de la solicitud
    const parsed = taskSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: 'Bad Request',
        errors: parsed.error.errors,
      });
    }

    const { description, date } = parsed.data;

    const taskDate = date || new Date().toISOString(); // Si no se proporciona fecha, usar la fecha actual

    const newTask = new Tasks({
      description,
      date: taskDate,
    });

    await newTask.save();

    res.status(201).json({
      status: 'Created',
      data: newTask
    });
  } catch (error) {
    next(error);
  }
};



export const editTasks = async (req, res, next) => {
  try {

    const { id } = req.params;
    const { description, date } = req.body;

    // Validar el cuerpo de la solicitud
    const parsed = taskSchema.partial().safeParse(req.body);  // La validación para editar es parcial
    if (!parsed.success) {
      return res.status(400).json({
        status: 'Bad Request',
        errors: parsed.error.errors,
      });
    }

  
    const task = await Tasks.findOne({id:id});
    if (!task) {
      return res.status(404).json({
        status: 'Not Found',
        message: `Task with id ${id} not found`
      });
    }


    const taskDate = date || new Date().toISOString();

    task.description = description || task.description;
    task.date = taskDate;

    await task.save();

    res.status(200).json({
      status: 'Updated',
      data: task
    });

  } catch (error) {
    next(error);
  }
};



export const deleteTasks = async (req, res, next) => {
  try {
    const { id } = req.params;  
    const task = await Tasks.findOne({id:id}); // Busca la tarea por ID

    if (!task) {
      return res.status(404).json({
        status: 'Not Found',
        message: `Task with ID ${id} not found`, // Usamos el ID para el mensaje
      });
    }
    
    console.log("La tarea eliminada es:", task);
    await Tasks.findOneAndDelete({ id:id });

    res.status(200).json({ // Devuelve un mensaje de confirmación
      status: 'Deleted',
      message: `Task with ID ${id} was successfully deleted`,
    });
  } catch (error) {
    next(error); // Maneja errores de forma centralizada
  }
};
