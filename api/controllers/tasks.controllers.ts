import { Request, Response, NextFunction } from "express";
import Task, { ITask } from "../models/Tasks.ts";
import { z } from "zod";

// Validación con Zod
const taskSchema = z.object({
  description: z.string().min(1, "Description is required"),
  date: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id); 
    
    /*
    if (!task) {
      return res.status(404).json({
        status: "Not Found",
        message: `Task with id ${id} not found`
      });
    }
*/
    console.log("La tarea traída es:", task);

    res.status(200).json({
      status: "OK",
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.query as { username?: string }; // Convertir `req.query` a tipo correcto
    console.log("El username en el back es", username);

    const query = username ? { username } : {};
    console.log("El query es", query);

    const allTasks = await Task.find(query).sort({ date: -1 });
    console.log("Las tareas recuperadas en el back son ", allTasks);

    res.status(200).json(allTasks);
  } catch (error) {
    next(error);
  }
};

export const createTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = taskSchema.safeParse(req.body);
    const username: string = req.body.username;

    /*
    if (!parsed.success) {
      return res.status(400).json({
        status: "Bad Request",
        errors: parsed.error.errors,
      });
    } */

    const { description, date } = parsed.data;
    console.log(description, date, username);

    const taskDate = date || new Date().toISOString();

      const newTask: ITask = new Task({
      description,
      date: taskDate,
      username
    });

    await newTask.save();

    res.status(201).json({
      status: "Created",
      data: newTask
    });
  } catch (error) {
    next(error);
  }
};

export const editTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { description } = req.params;
    const decodedDescription = decodeURIComponent(description);
    const { description: newDescription, date } = req.body;

    const parsed = taskSchema.partial().safeParse(req.body);
   
   /* if (!parsed.success) {
      return res.status(400).json({
        status: "Bad Request",
        errors: parsed.error.errors,
      });
    }*/

    const task = await Task.findOneAndUpdate(
      { description: decodedDescription },
      {
        description: newDescription || undefined,
        date: date || new Date().toISOString()
      },
      { new: true }
    );

   /* if (!task) {
      return res.status(404).json({
        status: "Not Found",
        message: `Task with description "${decodedDescription}" not found`
      });
    }*/

    res.status(200).json({
      status: "Updated",
      data: task
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);

    /*
    if (!task) {
      return res.status(404).json({
        status: "Not Found",
        message: `Task with ID ${id} not found`,
      });
    }*/
    
    console.log("La tarea eliminada es:", task);

    res.status(200).json({
      status: "Deleted",
      message: `Task with ID ${id} was successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

/*import Tasks from "../models/Tasks.js";
import { z } from 'zod';
import dotenv from 'dotenv'; 

export const getTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Tasks.findById(id); 
    
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
    next(error);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const { username } = req.query; // Obtenemos el userName de los query params
    console.log("el username en el back es", username)
    // Si hay userName, filtramos por él, si no, traemos todas las tareas
    const query = username ? { username } : {};
    console.log('el query es', query)
    const allTasks = await Tasks.find(query).sort({ date: -1 }); // -1 para orden descendente
    console.log("las tareas recuperadas en el back son ", allTasks)
    res.status(200).send(allTasks);
  } catch (error) {
    next(error);
  }
};

const taskSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  date: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  })
});

export const createTasks = async (req, res, next) => {
  try {
    const parsed = taskSchema.safeParse(req.body);
    console.log('2' ,req.body.username);
    const username = req.body.username;
    if (!parsed.success) {
      return res.status(400).json({
        status: 'Bad Request',
        errors: parsed.error.errors,
      });
    }

    const { description, date } = parsed.data;
    console.log(  description, date, username );
    const taskDate = date || new Date().toISOString();

    const newTask = new Tasks({
      description,
      date: taskDate,
      username: username
    });

    console.log(newTask);

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
    const { description } = req.params;
    // Decode la descripción que viene en la URL
    const decodedDescription = decodeURIComponent(description);
    const { description: newDescription, date } = req.body;
    const parsed = taskSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: 'Bad Request',
        errors: parsed.error.errors,
      });
    }

    const task = await Tasks.findOneAndUpdate(
      { description: decodedDescription }, // Usamos la descripción decodificada
      {
        description: newDescription || undefined,
        date: date || new Date().toISOString()
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        status: 'Not Found',
        message: `Task with description "${decodedDescription}" not found`
      });
    }

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
    const task = await Tasks.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        status: 'Not Found',
        message: `Task with ID ${id} not found`,
      });
    }
    
    console.log("La tarea eliminada es:", task);

    res.status(200).json({
      status: 'Deleted',
      message: `Task with ID ${id} was successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
}; */