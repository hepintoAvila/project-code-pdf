const pdf2json = require('pdf2json');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const PdfFile = require('../models/PdfFile');

exports.uploadPdf = async (req, res) => {
    try {
        const file = req.file;

        // Leer el archivo PDF
        const pdfDoc = await PDFDocument.load(fs.readFileSync(file.path));

        // Generar el código MD5
        const md5Hash = crypto.createHash('md5').update(file.originalname).digest('hex');

        // Obtener la primera página del PDF
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // Obtener dimensiones de la página
        const { width, height } = firstPage.getSize();

        // Configurar el margen desde el borde inferior
        const margin = 50;
        const textSize = 12;
        const rightOffset = 80; // Ajuste para mover el texto a la derecha

        // Calcular la posición Y para colocar el texto en la parte inferior
        const textY = margin; // Posición desde el borde inferior

        // Calcular la posición X para centrar el texto horizontalmente y ajustarlo a la derecha
        const text = `${md5Hash}`;
        const textWidth = textSize * text.length; // Aproximación del ancho del texto
        const x = (width - textWidth) / 2 + rightOffset;

        // Dibujar el texto en la parte inferior, centrado horizontalmente y ajustado a la derecha
        firstPage.drawText(text, {
            x: x,
            y: textY,
            size: textSize,
            color: rgb(0, 0, 0), // Color negro
        });

        // Guardar el PDF modificado
        const modifiedPdfBytes = await pdfDoc.save();
        const modifiedPdfPath = path.join('uploads', `${file.originalname}`);
        fs.writeFileSync(modifiedPdfPath, modifiedPdfBytes);

        // Extraer texto de la primera página usando pdf2json
        const pdfParser = new pdf2json();
        pdfParser.on("pdfParser_dataError", err => console.error(err));
        pdfParser.on("pdfParser_dataReady", async pdfData => {
            let tipoDocumento = '';
            let numeroidentificacion = '';
            let programa = '';

            if (pdfData && pdfData.Pages) {
                const pages = pdfData.Pages;
                if (pages.length > 0) {
                    // Recorrer todos los textos en la primera página
                    pages[0].Texts.forEach(textItem => {
                        const rawText = textItem.R[0].T;
                        const decodedText = decodeURIComponent(rawText);

                        // Buscar el número de documento antes de "expe-" en el texto decodificado
                        const docRegex = /(\w{2})\s*(\d+)[,\s]*expe/gi;
                        const docMatch = docRegex.exec(decodedText);
                        if (docMatch) {
                            tipoDocumento = docMatch[1];
                            numeroidentificacion = docMatch[2];
                        }

                        // Buscar el texto que sigue a "programa de" hasta una coma
                        const programRegex = /programa(?: de)?\s([^,]+)/i;
                        const programMatch = programRegex.exec(decodedText);
                        if (programMatch) {
                            programa = programMatch[1].trim();
                        }
                    });

                    // Guardar la información en MongoDB
                    const newPdf = new PdfFile({
                        filename: file.originalname,
                        md5Hash: md5Hash,
                        tipoDocumento: tipoDocumento,
                        numeroidentificacion: numeroidentificacion,
                        programa: programa,
                    });
                    await newPdf.save();

                    // Responder al cliente
                    res.json({ md5Hash, tipoDocumento, numeroidentificacion, programa });
                } else {
                    console.error('No se pudo encontrar la primera página en los datos del PDF.');
                    res.status(500).json({ error: 'No se pudo encontrar la primera página en los datos del PDF.' });
                }
            } else {
                console.error('Estructura de datos PDF inesperada o "Pages" no se encontró:', pdfData);
                res.status(500).json({ error: 'Estructura de datos PDF inesperada o "Pages" no se encontró.' });
            }
        });

        pdfParser.loadPDF(file.path);

    } catch (error) {
        console.error('Error uploading PDF:', error);
        res.status(500).json({ error: 'Failed to upload PDF' });
    }
};
