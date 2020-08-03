
/* En este archivo realizamos la programacion del login del usuario*/
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // libreria para la generacion de tokens

//Importaciones necesarios para la autenticacion con google
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

//Configuraciones para la autenticacion de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
    
}

  
app.post('/google', async (req, res) => {

    let token = req.body.idtoken;

    //Verifica que el token obtenido sea de un usuario real de google
    let googleUser = await verify(token)
        .catch( e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });
    //Una vez que se ha confirmado la existencia del usuario, debemos revisar si ese usuario ya esta registrado en la base de datos o no
    Usuario.findOne({ email: googleUser.email}, (err, usuarioDB) => {
        
        if( err ){ // Se lanza este error si hay problemas en el interior de la DB
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(usuarioDB){
            if(usuarioDB.google === false ){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe utilizar su autenticacion normal'
                    }
                });
            }else{
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        
                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        }else{
            //Si el usuario no esta en la base de datos creamos un nuevo usuario
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
        
                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });
})

module.exports = app;