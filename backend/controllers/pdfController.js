const crypto = require('crypto');
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
