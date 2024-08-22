# project-code-pdf
 ![image](https://github.com/user-attachments/assets/bd231a32-20bc-4c36-ad12-21ac363a5fbb)


Configura el proyecto con un frontend en React y un backend en Node.js que se conecte a MongoDB. Asegúrate de que tienes instalado Node.js, MongoDB, y una biblioteca para manejar archivos PDF como pdf-lib.
Organiza el proyecto con las siguientes carpetas y archivos:
Estructura del proyecto
 ![image](https://github.com/user-attachments/assets/f0b69b17-01c8-491c-9fe7-dd83e3a1937b)

3. Backend (Node.js)
3.1 Instalar dependencias
En la carpeta backend, instala las siguientes dependencias:
npm install express mongoose multer crypto pdf-lib
3.2 Crear el modelo de MongoDB
En backend/models/PdfFile.js:
 `const mongoose = require('mongoose');

const pdfFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  md5Hash: { type: String, required: true },
});

module.exports = mongoose.model('PdfFile', pdfFileSchema);
`
3.3 Crear el controlador
En backend/controllers/pdfController.js:
`const crypto = require('crypto');
const { PDFDocument } = require('pdf-lib');
const PdfFile = require('../models/PdfFile');
const fs = require('fs').promises;

exports.uploadPdf = async (req, res) => {
  try {
    const fileBuffer = await fs.readFile(req.file.path);
    const md5Hash = crypto.createHash('md5').update(fileBuffer).digest('hex');

    const pdfDoc = await PDFDocument.load(fileBuffer);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    firstPage.drawText(md5Hash, { x: 50, y: 750, size: 12 });

    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(req.file.path, pdfBytes);

    const newPdfFile = new PdfFile({
      filename: req.file.originalname,
      md5Hash,
    });

    await newPdfFile.save();
    res.status(200).json({ message: 'PDF updated and saved to MongoDB', md5Hash });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process PDF' });
  }
};
`
3.4 Configurar rutas y servidor
En backend/routes/pdf.js:
`const express = require('express');
const mongoose = require('mongoose');
const pdfRoutes = require('./routes/pdf');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/pdfdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use('/api/pdf', pdfRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
`
4. Frontend (React)
En la carpeta frontend, instala las dependencias necesarias:
`npm install axios`
4.2 Crear un componente para subir archivos
En frontend/src/components/UploadFile.js:
`import React, { useState } from 'react';
import axios from 'axios';

function UploadFile() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post('/api/pdf/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(`File uploaded successfully! MD5: ${response.data.md5Hash}`);
    } catch (error) {
      setMessage('Failed to upload file');
    }
  };

  return (
    <div>
      <h2>Upload PDF</h2>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload</button>
      <p>{message}</p>
    </div>
  );
}

export default UploadFile;
`
4.3 Configurar el servicio API
En frontend/src/services/api.js:
`import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});
`
4.4 Incorporar el componente en la aplicación
En frontend/src/App.js:
`import React from 'react';
import UploadFile from './components/UploadFile';

function App() {
  return (
    <div>
      <UploadFile />
    </div>
  );
}

export default App;
`



