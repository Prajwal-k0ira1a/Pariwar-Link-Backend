import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
  registerUser, 
  loginUser, 
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.use(protect);



export default router;
