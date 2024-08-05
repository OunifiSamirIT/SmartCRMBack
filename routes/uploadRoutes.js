import express from 'express';
import { upload, uploadFacture } from '../controller/uploadController.js';

const router = express.Router();

router.post('/upload', upload.single('file'), uploadFacture);

export default router;
