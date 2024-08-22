// models/PdfFile.js
const mongoose = require('mongoose');

const PdfFileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    md5Hash: { type: String, required: true },
    tipoDocumento: { type: String, required: false },
    numeroidentificacion: { type: String, required: false },
    programa: { type: String, required: false },
});

module.exports = mongoose.model('PdfFile', PdfFileSchema);

