import express from 'express';
import multer from 'multer';
import { changeFileName, deleteFile, uploadFile, uploadFileStructure } from '../controllers/fileController.js';
import { isAuthenticate } from '../middlewares/auth.js';

const router = express.Router();
const upload = multer({ });

router.post('/upload', upload.single('file'), isAuthenticate, uploadFile);
router.delete('/', isAuthenticate, deleteFile);
router.put('/', isAuthenticate, changeFileName);
router.post(
    '/upload-structure',
    isAuthenticate,
    uploadFileStructure
);

export default router;
