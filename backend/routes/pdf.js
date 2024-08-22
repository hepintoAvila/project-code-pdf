const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const pdfController = require('../controllers/pdfController');
const multer = require('multer');
const mongoose = require('mongoose');
const DataModel = require('../models/PdfFile'); // Asegúrate de definir tu modelo en models/DataModel.js

const upload = multer({ dest: 'uploads/' });
router.post('/upload', upload.single('pdf'), pdfController.uploadPdf);
 

// Obtener todos los datos
router.get('/data', async (req, res) => {
  try {
    const data = await DataModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener un dato por ID
router.get('/data/:id', async (req, res) => {
  try {
    const data = await DataModel.findById(req.params.id);
    if (data == null) return res.status(404).json({ message: 'No se encuentra el dato' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un nuevo dato
router.post('/data', async (req, res) => {
  const data = new DataModel({
    name: req.body.name,
    // Agrega más campos según tu modelo
  });
  try {
    const newData = await data.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar un dato
router.patch('/data/:id', async (req, res) => {
  try {
    const data = await DataModel.findById(req.params.id);
    if (data == null) return res.status(404).json({ message: 'No se encuentra el dato' });

    if (req.body.name != null) {
      data.name = req.body.name;
    }
    // Actualiza más campos según tu modelo

    const updatedData = await data.save();
    res.json(updatedData);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un dato
router.delete('/data/:id', async (req, res) => {
  
    try {
      const { id } = req.params;
       const pdfFile = await DataModel.findById(id);
  
      if (!pdfFile) {
        return res.status(404).json({ message: 'PDF not found' });
      }
  
      if (!pdfFile.filename) {
        return res.status(500).json({ message: 'Filename not found in the database record' });
      }
  
      // Construye la ruta del archivo
      const filePath = path.join(__dirname, '../uploads', `${pdfFile.filename}`);
    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
        console.error(`El archivo no existe en la ruta especificada: ${filePath}`);
        return res.status(404).json({ message: 'File not found on server' });
      }
  
      // Elimina el archivo del sistema de archivos
      fs.unlink(filePath, async (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return res.status(500).json({ message: 'Failed to delete file' });
        }
  
     // Eliminar el registro de la base de datos
         await DataModel.findByIdAndDelete(id);
         console.log(`Archivo y registro de base de datos eliminados exitosamente para ID: ${id}`);
        return res.status(200).json({ message: 'PDF deleted successfully' });
      });
    } catch (error) {
      console.error('Error deleting PDF:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;