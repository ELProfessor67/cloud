import express from 'express';
import { changePassword, createUser, loadme, login, logout } from '../controllers/userController.js';
import { isAuthenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', login);
router.get('/logout', isAuthenticate, logout);
router.put('/change-password', isAuthenticate, changePassword);
router.get('/me', isAuthenticate, loadme);

export default router;
