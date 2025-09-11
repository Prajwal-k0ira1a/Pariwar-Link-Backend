import { Router } from "express";
import authRoute from "./authRoute.js";
import person from "./peopleRoutes.js";

const router = Router();
router.use("/auth",authRoute); 
router.use("/person",person);

export default router;