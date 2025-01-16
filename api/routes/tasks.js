import { Router } from "express";
import { getTask, getAllTasks, createTasks, editTasks, deleteTasks } from "../controllers/Tasks.controllers.js";

const router = Router();

// Definir rutas
router.get('/getTask/:id', getTask);
router.get('/getAllTasks', getAllTasks);
router.post('/createTasks', createTasks);
router.put('/editTasks/:description', editTasks);

router.delete('/deleteTask/:id', deleteTasks);

// Exportar el router
export default router;
