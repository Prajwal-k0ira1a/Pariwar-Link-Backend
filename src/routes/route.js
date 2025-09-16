import { Router } from "express";
import authRoute from "./authRoute.js";
import personRoutes from "./personRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

// Public routes
router.use("/auth", authRoute);

// Protected routes (require authentication)
router.use("/users", userRoutes);
router.use("/person", personRoutes);

export default router;