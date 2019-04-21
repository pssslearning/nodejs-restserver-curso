// Configuración global
require('./config/config');

// Express
const express = require('express');
const app = express();

// Body-Parser
const bodyParser = require('body-parser');

// --------------------------------------------------------
// Middleware Body-Parsers
// --------------------------------------------------------
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
    // --------------------------------------------------------

// Configuración Handlers
app.get('/', function(req, res) {
    let saludo = {
        saludo: 'Hello World'
    }
    res.json(saludo);
});

app.get('/usuarios', function(req, res) {
    let respuesta = {
        funcion: 'Get Usuarios',
        url: req.url,
        method: req.method,
        id: req.params.id
    }
    res.json(respuesta);
});

app.get('/usuarios/:id', function(req, res) {
    let respuesta = {
        funcion: 'Get Usuario by id',
        url: req.url,
        method: req.method,
        id: req.params.id
    }
    res.json(respuesta);
});

app.post('/usuarios', function(req, res) {

    let body = req.body;

    console.log(body);
    // Nota: en caso de no enviar nada Body-Parser genera un objeto vacío.
    // Nunca se produce un body === null

    if (body.nombre === undefined) {
        let respuesta = {
            funcion: 'POST New Usuario',
            url: req.url,
            method: req.method,
            error: {
                code: '34BodyNoName',
                msg: "El cuerpo de la peticón no contiene un campo 'nombre' " +
                    "o no ha podido ser correctamente interpretado"
            }
        }
        res.status(400);
        res.json(respuesta);

    } else {
        let respuesta = {
            funcion: 'POST New Usuario',
            url: req.url,
            method: req.method,
            body: req.body
        }
        res.status(200);
        res.json(respuesta);
    }


});

app.put('/usuarios/:id', function(req, res) {

    let respuesta = {
        funcion: 'PUT Usuario by id',
        url: req.url,
        method: req.method,
        id: req.params.id,
        body: req.body
    }
    res.json(respuesta);
});

app.delete('/usuarios/:id', function(req, res) {
    let respuesta = {
        funcion: 'DELETE Usuario by id',
        url: req.url,
        method: req.method,
        id: req.params.id
    }
    res.json(respuesta);
});

app.listen(process.env.PORT, () => {
    console.log(`Servidor REST arrancado. Escuchando en el puerto ${process.env.PORT}`);
});