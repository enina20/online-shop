
/* En este archivo realizamos la programacion del login del usuario*/
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // libreria para la generacion de tokens

const app = express();

const Usuario = require('../models/usuario_model');

//Cuando el usuario intenta hacer login, manda una solicitud POST al servicio con su usuario y contrasena, las cuales seran verificadas de la siguiente manera. 
app.post('/login', (req, res) => {

    let body = req.body;

    //La funcion findOne busca dentro de nuestra bases de datos alguna coincidencia con el email que el usuario envia.
    Usuario.findOne({ email: body.email}, ( err, usuarioDB ) => {

        if(err){ // Se lanza este error si hay problemas en el interior de la DB
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!usuarioDB){ //Si no se encuentra alguna coincidencia dentro de la DB
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario(*) o contrasena incorrectos'
                }
            });
        }

        //Utilizamos la funcion compareSync del bcriptjs para evaluar si la contrasena que manda el usuario es igual que la contrasena en la DB
        if( !bcrypt.compareSync(body.password, usuarioDB.password) ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contrasena(*) incorrectos'
                }
            });
        }

        //Una vez que se verifico que la contrasena y usuario sean los correctos, generamos el token mediante la funcion sign de jwt, mandamos como parametros: [ payload = usuario, el seed, fecha de expiracion]
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });
});

module.exports = app;