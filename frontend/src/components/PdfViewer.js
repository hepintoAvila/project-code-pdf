/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'; // Estilo de las anotaciones de PDF

// Configura el worker localmente

const PdfViewer = ({ fileUrl }) => {
 
  return (
    <div className="pdf-viewer">
 
    <object
      data={`${fileUrl}`}
      type="application/pdf"
      width='100%'
      height='100%'
    ></object>

    </div>
  );
};

export default PdfViewer;
