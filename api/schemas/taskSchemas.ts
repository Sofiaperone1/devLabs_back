import { z } from 'zod';

export const taskSchemas = {
  // Schema para crear tareas
  createTask: z.object({
    body: z.object({
      description: z.string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string"
      }).min(1, "Description cannot be empty"),
      date: z.string().optional()
        .refine(val => !val || !isNaN(Date.parse(val)), {
          message: "Invalid date format"
        }),
      username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string"
      }).min(1, "Username cannot be empty"),
    })
  }),

  // Schema para obtener una tarea específica
  getTask: z.object({
    params: z.object({
      id: z.string({
        required_error: "Task ID is required",
        invalid_type_error: "Task ID must be a string"
      }).min(1, "Task ID cannot be empty")
    })
  }),

  // Schema para obtener todas las tareas
  getAllTasks: z.object({
    query: z.object({
      username: z.string().optional()
    })
  }),

  // Schema para actualizar tareas
  updateTask: z.object({
    params: z.object({
      description: z.string({
        required_error: "Description parameter is required",
        invalid_type_error: "Description parameter must be a string"
      }).min(1, "Description parameter cannot be empty")
    }),
    body: z.object({
      description: z.string().optional(),
      date: z.string().optional()
        .refine(val => !val || !isNaN(Date.parse(val)), {
          message: "Invalid date format"
        })
    })
  }),

  // Schema para eliminar tareas
  deleteTask: z.object({
    params: z.object({
      id: z.string({
        required_error: "Task ID is required",
        invalid_type_error: "Task ID must be a string"
      }).min(1, "Task ID cannot be empty")
    })
  })
};