// Express
const express = require('express');
const app = express();

// Bcrypt
const bcrypt = require('bcrypt');

// Modelos
const Usuario = require('../models/usuario');
// const ObjectId = require('mongoose').Types.ObjectId;

// Underscore.js
const _ = require('underscore');

// Configuración Handlers
app.get('/', function(req, res) {
    let saludo = {
        saludo: 'Hello World'
    }
    res.json(saludo);
});

// ====================================
// Lista de usuarios Paginadas
// ====================================
app.get('/usuarios', function(req, res) {

    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 5;

    if (desde < 0 || limite <= 0) {
        return res.status(400).json({
            funcion: 'GET Lista de Usuarios  Paginada',
            url: req.url,
            desde,
            limite,
            method: req.method,
            error: {
                code: '456DBLIST',
                msg: `Los valores de los parámetros 'desde=${desde}' y 'limite=${limite}' NO SON ACEPTABLES`
            }
        });
    }

    Usuario.find({ activo: true }, 'nombre email role activo google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(404).json({
                    funcion: 'GET Lista de Usuarios Paginada',
                    url: req.url,
                    desde,
                    limite,
                    method: req.method,
                    error: {
                        code: '456DBLIST',
                        msg: err
                    }
                });
            }

            let respuesta = {
                funcion: 'GET Lista de Usuarios Paginada',
                url: req.url,
                desde,
                limite,
                url_next: `/usuarios?desde=${desde+limite}&limite=${limite}`,
                method: req.method,
                longitudLista: usuarios.length,
                usuarios
            };
            res.status(200);
            res.json(respuesta);

        });
});

// ====================================
// Get usuario por id
// ====================================
app.get('/usuarios/:id', function(req, res) {

    const id = req.params.id;
    Usuario.findById(id,
        (err, usuarioDB) => {

            if (err) {
                return res.status(500).json({
                    funcion: 'GET Usuario by ID',
                    url: req.url,
                    method: req.method,
                    id,
                    error: {
                        code: '789DBFIND&UPDATE',
                        msg: err
                    }
                });
            } else if (usuarioDB === null || !usuarioDB.activo) {
                return res.status(404).json({
                    funcion: 'GET Usuario by ID',
                    url: req.url,
                    method: req.method,
                    id,
                    error: {
                        code: '890NOTFOUNDFINDUSERBYID',
                        msg: `No se encuentra ningun usuario activo con el id: ${ id }.`
                    }
                });

            }

            let respuesta = {
                funcion: 'GET Usuario by ID',
                url: req.url,
                method: req.method,
                id,
                usuariodb: usuarioDB
            };
            res.status(200);
            res.json(respuesta);
        });

});



// ====================================
// Crear un nuevo usuario
// ====================================
app.post('/usuarios', function(req, res) {

    const body = req.body;

    // console.log(body);

    // Nota: en caso de no enviar nada Body-Parser genera un objeto vacío.
    // Nunca se produce un body === null

    // Nota: recuerdese que en el alta de un nuevo usuarios
    // los valores 'activo' y 'google' no se aceptan de los
    // valores enviados sino que deben adoptar los valores 
    // por defecto.
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        // Nota: para quitar de la respuesta la password
        delete body.password;

        if (err) {
            return res.status(400).json({
                funcion: 'POST New Usuario',
                url: req.url,
                method: req.method,
                body,
                error: {
                    code: '456DBSAVE',
                    msg: err
                }
            });
        }

        let respuesta = {
            funcion: 'POST New Usuario',
            url: req.url,
            baseUrl: req.baseUrl,
            method: req.method,
            body,
            usuariodb: usuarioDB
        };
        res.status(201);
        res.setHeader('Location', `${ req.url }/${usuarioDB.id}`);
        res.json(respuesta);
    });

});

// ====================================
// Modificar usuario por id
// ====================================
app.put('/usuarios/:id', function(req, res) {

    const id = req.params.id;
    const body = _.pick(req.body, ['nombre', 'email', 'role', 'activo']);

    Usuario.findByIdAndUpdate(
        id, body, {
            new: true,
            runValidators: true
        },
        (err, usuarioDB) => {

            if (err) {
                return res.status(400).json({
                    funcion: 'PUT - Update - Usuario',
                    url: req.url,
                    method: req.method,
                    id,
                    body,
                    error: {
                        code: '789DBFIND&UPDATE',
                        msg: err
                    }
                });
            } else if (usuarioDB === null) {
                return res.status(404).json({
                    funcion: 'PUT - Update - Usuario',
                    url: req.url,
                    method: req.method,
                    id,
                    body,
                    error: {
                        code: '890NEXFIND&UPDATE',
                        msg: `No se encuentra ningun usuario activo con el id:${id}.`
                    }
                });

            }

            let respuesta = {
                funcion: 'PUT Usuario by id',
                url: req.url,
                method: req.method,
                id,
                body,
                usuariodb: usuarioDB
            };
            res.status(202);
            res.json(respuesta);
        });


});

// ====================================
// Eliminación física usuario por id
// ====================================
// app.delete('/usuarios/:id', function(req, res) {

//     const id = req.params.id;

//     Usuario.findByIdAndRemove(id,
//         (err, usuarioDB) => {

//             if (err) {
//                 return res.status(500).json({
//                     funcion: 'DELETE usuario by Id',
//                     url: req.url,
//                     method: req.method,
//                     id,
//                     error: {
//                         code: '789NOTFOUNDDELETEUSERBYID',
//                         msg: err
//                     }
//                 });
//             } else if (usuarioDB === null) {
//                 return res.status(404).json({
//                     funcion: 'DELETE usuario by Id',
//                     url: req.url,
//                     method: req.method,
//                     id,
//                     error: {
//                         code: '890NOTFOUNDDELETEUSERBYID',
//                         msg: `No se encuentra ningun usuario activo con el id: ${ id }.`
//                     }
//                 });

//             }

//             let respuesta = {
//                 funcion: 'DELETE usuario by Id',
//                 url: req.url,
//                 method: req.method,
//                 id,
//                 usuarioEliminado: usuarioDB
//             };
//             res.status(202);
//             res.json(respuesta);
//         });

// });

// ====================================
// Eliminación lógica usuario por id
// ====================================
app.delete('/usuarios/:id', function(req, res) {

    const id = req.params.id;
    const cambiaEstado = {
        activo: false
    };

    Usuario.findByIdAndUpdate(
        id, cambiaEstado, {
            new: true
        },
        (err, usuarioInactivo) => {

            if (err) {
                return res.status(500).json({
                    funcion: 'DELETE usuario by Id',
                    url: req.url,
                    method: req.method,
                    id,
                    error: {
                        code: '789NOTFOUNDDELETEUSERBYID',
                        msg: err
                    }
                });
            } else if (usuarioInactivo === null) {
                return res.status(404).json({
                    funcion: 'DELETE usuario by Id',
                    url: req.url,
                    method: req.method,
                    id,
                    error: {
                        code: '890NOTFOUNDDELETEUSERBYID',
                        msg: `No se encuentra ningun usuario activo con el id: ${ id }.`
                    }
                });

            }

            let respuesta = {
                funcion: 'DELETE usuario by Id',
                url: req.url,
                method: req.method,
                id,
                usuarioMarcadoComoInactivo: usuarioInactivo
            };
            res.status(202);
            res.json(respuesta);
        });

});

module.exports = app;