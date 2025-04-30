import express from 'express';
import multer from 'multer';
import { changeFileName, deleteFile, save_cube_acr_file, uploadFile, uploadFileStructure } from '../controllers/fileController.js';
import { isAuthenticate } from '../middlewares/auth.js';
import path from 'path';
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Upload folder (make sure it exists or create it)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 1234567890-.jpg
    }
});
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 * 1024 }, storage }); // 10GB limit

router.post('/upload', upload.single('file'), isAuthenticate, uploadFile);
router.delete('/', isAuthenticate, deleteFile);
router.put('/', isAuthenticate, changeFileName);
router.post(
    '/upload-structure',
    isAuthenticate,
    uploadFileStructure
);
router.post(
    '/upload-cube_acr_file',
    save_cube_acr_file
);

export default router;
