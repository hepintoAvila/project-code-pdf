const mongoose = require('mongoose');

const pdfFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  md5Hash: { type: String, required: true },
});

module.exports = mongoose.model('PdfFile', pdfFileSchema);
