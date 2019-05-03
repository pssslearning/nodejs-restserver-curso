// Express
const express = require('express');
const app = express();

// --------------------------------------------------------
// Rutas Configuradas
// --------------------------------------------------------
app.use(require('./usuario'));
app.use(require('./login'));


// --------------------------------------------------------
// Exportar para acceso desde otros módulos
// --------------------------------------------------------
module.exports = app;