import express from 'express';
import { changeFolderName, createFolder, deleteFolder, getFolderById } from '../controllers/folderController.js';
import { isAuthenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', isAuthenticate,createFolder);
router.get('/',isAuthenticate, getFolderById);
router.delete('/',isAuthenticate, deleteFolder);
router.put('/',isAuthenticate, changeFolderName);

export default router;
