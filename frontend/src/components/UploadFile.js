import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const onFileChange = event => {
        setFile(event.target.files[0]);
    };

    const onFileUpload = async () => {
        const formData = new FormData();
        formData.append('pdf', file);

        try {
            const response = await axios.post('http://localhost:5000/api/pdf/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            setMessage(`Generado y guardada la información con exito! MD5: ${response.data.md5Hash}`);
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Failed to upload file');
        }
    };

    return (
        <div className="file">
            <input type="file" onChange={onFileChange} style={{ marginBottom: '10px', padding: '5px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '1px' }} />
            <button onClick={onFileUpload} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#ddd', color: 'black', border: 'none', borderRadius: '5px' }}>Upload</button>
            <p>{message}</p>
        </div>
    );
};

export default FileUpload;
