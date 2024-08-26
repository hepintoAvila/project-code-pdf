const express = require('express');
const mongoose = require('mongoose');
const pdfRoutes = require('./routes/pdf');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');  // Importa el módulo child_process
const { auth } = require('express-oauth2-jwt-bearer');

const app = express();
const PORT = process.env.PORT || 5000;
 
function connectToMongoDB() {
  mongoose.connect('mongodb://localhost:27017/pdfdb')
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB', err);
      
      // Si la conexión falla, intenta iniciar el servicio de MongoDB
      if (err.name === 'MongooseServerSelectionError') {
        console.log('Attempting to start MongoDB service...');
        exec('net start MongoDB', (error, stdout, stderr) => {
          if (error) {
            console.error(`Error starting MongoDB service: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
          
          // Intenta reconectar a MongoDB después de iniciar el servicio
          connectToMongoDB();
        });
      }
    });
}
// Conecta a MongoDB
connectToMongoDB();

const jwtCheck = auth({
  audience: 'https://api.certificados.com',
  issuerBaseURL: 'https://dev-twjztmiqhzxp7q86.us.auth0.com/',
  tokenSigningAlg: 'RS256'
});


app.use(express.json());
app.use(cors());
// enforce on all endpoints
app.use(jwtCheck);
app.use((req, res, next) => {
  console.log('Authorization Header:', req.headers.authorization);
  next();
});
// Middleware
app.get('/authorized', function (req, res) {
  res.send('Secured Resource');
});
app.get('/api/permissions', (req, res) => {
  res.json({ permissions: ['read', 'write'] });
});
// Rutas api/pdf/upload
app.use('/api/pdf', pdfRoutes);
app.use('/api/pdf/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
