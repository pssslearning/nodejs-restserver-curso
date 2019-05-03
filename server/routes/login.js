// Express
const express = require('express');
const app = express();

// Bcrypt
const bcrypt = require('bcrypt');

// JsonWebToken
const jwt = require('jsonwebtoken');

// Modelos
const Usuario = require('../models/usuario');


// POST Login
app.post('/login', (req, res) => {

    const body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                funcion: 'USER Login',
                url: req.url,
                method: req.method,
                email: body.email,
                error: {
                    code: '789ERRDB',
                    msg: err
                }
            });
        } else if (usuarioDB === null || !usuarioDB.activo) {
            return res.status(404).json({
                funcion: 'USER Login',
                url: req.url,
                method: req.method,
                email: body.email,
                error: {
                    code: '890NOTFOUNDBYEMAIL',
                    msg: `No existe ningun usuario activo con email: ${ body.email}.`
                }
            });

        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(404).json({
                funcion: 'USER Login',
                url: req.url,
                method: req.method,
                email: body.email,
                error: {
                    code: '890NOTFOUNDBYEMAIL',
                    msg: `Credenciales incorrectas.`
                }
            });
        }

        const token = jwt.sign({
            usuario: usuarioDB
        }, process.env.JWT_SEED, { expiresIn: process.env.JWT_EXPIRY });

        let respuesta = {
            funcion: 'USER login',
            url: req.url,
            method: req.method,
            usuario: usuarioDB,
            token
        };
        res.header('X-Token', token).status(200).json(respuesta);


    });


})















module.exports = app;