const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const multer = require('multer');

// Configuración de multer para subir archivos
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('pdf'), pdfController.uploadPdf);

module.exports = router;

