// routes/tasks.ts
import { Router } from "express";
import { getTask, getAllTasks, createTasks, editTasks, deleteTasks } from "../controllers/tasks.controllers.ts";
import { validateSchema } from "../middleware/validationMiddleware.ts";
import { taskSchemas } from "../schemas/taskSchemas.ts";

const router = Router();

// Las rutas ya tienen el middleware checkJwt aplicado desde index.ts
router.get("/getTask/:id", 
  validateSchema(taskSchemas.getTask),
  getTask
);

router.get("/getAllTasks", 
  validateSchema(taskSchemas.getAllTasks),
  getAllTasks
);

router.post("/createTasks", 
  validateSchema(taskSchemas.createTask),
  createTasks
);

router.put("/editTasks/:description", 
  validateSchema(taskSchemas.updateTask),
  editTasks
);

router.delete("/deleteTask/:id", 
  validateSchema(taskSchemas.deleteTask),
  deleteTasks
);

export default router;