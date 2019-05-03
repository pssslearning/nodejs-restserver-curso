// ---------------------------------------------------------
// Configuración global
// ---------------------------------------------------------
require('./config/config');

// ---------------------------------------------------------
// Express
// ---------------------------------------------------------
const express = require('express');
const app = express();

// ---------------------------------------------------------
// Mongoose
// ---------------------------------------------------------
const mongoose = require('mongoose');

// ---------------------------------------------------------
// Body-Parser
// ---------------------------------------------------------
const bodyParser = require('body-parser');

// --------------------------------------------------------
// Middleware Body-Parsers
// --------------------------------------------------------
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// ---------------------------------------------------------
// parse application/json
// ---------------------------------------------------------
app.use(bodyParser.json())

// ---------------------------------------------------------
// Configuración global de rutas
// ---------------------------------------------------------
app.use(require('./routes/index'));

mongoose.connect(
    process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {

        if (err) throw err;

        console.log('Base de datos MongoDB conectada');
        app.listen(process.env.PORT, () => {
            console.log(`Servidor REST arrancado. Escuchando en el puerto ${process.env.PORT}`);
            console.log(`Entorno de trabajo establecido a ${process.env.NODE_ENV}`);
        });
    });