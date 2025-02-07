import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validateSchema = (schema: AnyZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Mantener consistencia con tu manejo de errores global
        const validationError = new Error('Validation Error');
        validationError.name = 'ValidationError';
        // @ts-ignore
        validationError.errors = error.errors;
        return next(validationError);
      }
      return next(error);
    }
  };

// schemas/task.schemas.ts
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
}