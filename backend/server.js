const express = require('express');
const mongoose = require('mongoose');
const pdfRoutes = require('./routes/pdf');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/pdfdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

// Middleware
app.use(cors());
app.use(express.json());
// Rutas
app.use('/api/pdf', pdfRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));