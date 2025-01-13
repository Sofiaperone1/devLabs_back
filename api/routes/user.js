import { Router } from "express";
import { getProfile, getDashboard} from "../controllers/User.controllers.js"
import { ensureAuthenticated } from '../middleware/authMiddleware.js';

const router = Router();
// Ruta pública
router.get('/profile', ensureAuthenticated, getProfile);
// Ruta protegida
router.get('/dashboard', ensureAuthenticated, getDashboard);


export default router;
