//? CONFIGURACIÓN SERTVIDOR EXPRESS BÁSICA
// server.js

const express = require('express');
const authRoutes = require('./routes/authRoutes'); // Asegúrate de que la ruta sea correcta

const app = express();

app.use(express.json());

// Monta las rutas de autenticación en '/api/auth'
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));