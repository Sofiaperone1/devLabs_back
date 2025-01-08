import { Router } from "express";
const router = Router();
var { getProfile, getDashboard} = require("../controller/User.controllers");
import { ensureAuthenticated } from '../middleware/authMiddleware.js';

// Ruta pública
//router.get('/profile', ensureAuthenticated, getProfile);

// Ruta protegida
//router.get('/dashboard', ensureAuthenticated, getDashboard);


module.exports = router;
