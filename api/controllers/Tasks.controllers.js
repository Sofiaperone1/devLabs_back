import Tasks from "../models/Tasks.js";
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
    const allTasks = await Tasks.find();
    console.log("trayendo las tareas: ", allTasks)
    res.status(200).send(allTasks)
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
    if (!parsed.success) {
      return res.status(400).json({
        status: 'Bad Request',
        errors: parsed.error.errors,
      });
    }

    const { description, date } = parsed.data;
    const taskDate = date || new Date().toISOString();

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

    const parsed = taskSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: 'Bad Request',
        errors: parsed.error.errors,
      });
    }

    const task = await Tasks.findByIdAndUpdate(
      id,
      { 
        description: description || undefined,
        date: date || new Date().toISOString()
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        status: 'Not Found',
        message: `Task with id ${id} not found`
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
};