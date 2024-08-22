import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Importa todo el módulo `xlsx`
import deleteIcon from '../assets/images/delete-icon.png';
import search from '../assets/images/search.png';
import './PdfViewer.css';
import PdfViewer from './PdfViewer';
import Modal from 'react-modal';

// Establecer el elemento raíz para el modal
Modal.setAppElement('#root');
const DataGrid = () => {
    const [data, setData] = useState([]);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    //const [loading, setLoading] = useState(false);
   // const [error, setError] = useState(null);
   // const [successMessage, setSuccessMessage] = useState(null);
 
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPdf(null); // Limpiar el PDF seleccionado al cerrar el modal
    };
    const handleViewPdf = (filename) => {
        setSelectedPdf(`http://localhost:5000/api/pdf/uploads/${filename}`);
        setIsModalOpen(true); // Abrir el modal al seleccionar un PDF
    };

    useEffect(() => {
        // Obtener todos los datos al cargar el componente
        axios.get('http://localhost:5000/api/pdf/data')
            .then(response => setData(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/pdf/data/${id}`);
            setData(data.filter(item => item._id !== id));
        } catch (error) {
            console.error('Error deleting PDF:', error);
        }
    };
    const removePdfExtension = (filename) => {
        return filename.replace(/\.pdf$/, '');
    };

     // Función para exportar datos a Excel
     const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data?.map(item => ({
            MD5_Hash: item.md5Hash,
            Filename: removePdfExtension(item.filename),
            Tipo_Documento: item.tipoDocumento,
            Identificacion: item.numeroidentificacion,
            Programa: item.programa
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'PDF Data');
        XLSX.writeFile(workbook, 'pdf_data.xlsx');
    };
    return (
        <div style={{ display: 'flex', height: '80vh', overflow: 'hidden' }}>
            <div style={{ flex: 1, borderRight: '1px solid #ddd', padding: '10px', overflowY: 'auto' }}>
                 { /*
               {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                */}
                <button onClick={exportToExcel} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px',marginLeft: '91em'}}>
                    Export to Excel
                </button>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>MD5 Hash</th>
                            <th>Nombre Apellidos</th>
                            <th>TD</th>
                            <th>Identificación</th>
                            <th>Programa</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(item => (
                            <tr key={item._id}>
                                <td>{item.md5Hash}</td>
                                <td>{removePdfExtension(item.filename)}</td> {/* Usar la función aquí */}
                                <td>{item.tipoDocumento}</td>
                                <td>{item.numeroidentificacion}</td>
                                <td>{item.programa}</td>
                                <td>
                                    <button
                                        className="img-btn"
                                        onClick={() => handleViewPdf(item.filename)}
                                        title="View PDF"
                                    >
                                        <img src={search} alt="View PDF" />
                                    </button>
                                    <button
                                        className="img-btn"
                                        onClick={() => handleDelete(item._id)}
                                        title="Delete"
                                    >
                                        <img src={deleteIcon} alt="Delete" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para la vista previa del PDF */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="PDF Viewer"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    },
                    content: {
                        top: '10%',
                        left: '10%',
                        right: '10%',
                        bottom: '10%',
                        padding: '20px',
                        overflow: 'hidden',
                    },
                }}
            >
                {selectedPdf && <PdfViewer fileUrl={selectedPdf} />}
                <button onClick={closeModal} style={{ marginTop: '10px' }}>
                    Close
                </button>
            </Modal>
        </div>
    );
};

export default DataGrid;
