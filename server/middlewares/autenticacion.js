/*=========================================
Este barchivo es el encargado de verificar el jwt cuando se realiza una peticion GET desde el archivo usuario_controller.js*/

const jwt = require('jsonwebtoken');
//=======================================
//VERIFICA TOKEN
//=======================================
let verificaToken = ( req, res, next) => {

    //Recuperamos aqui el token que envia el usuario en los headers de la peticion
    let token = req.get('Authorization');

    //Mediante la funcion "VERIFY" propia del jsonWebToken verificamos si el token que manda el usuario es correcto
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if( err ){
            return res.status(401).json({
                ok: false,
                err:{
                    message: 'Token no valido'
                }
            });
        }
        //Aqui extraemos la informacion del payload (Objeto del usuario)
        req.usuario = decoded.usuario;
        next();
    });
}

//=======================================
//VERIFICA ADMIN_ROLE
//=======================================
let verificaAdmin_Role = ( req, res, next) => {
    let usuario = req.usuario;
    if( usuario.role === 'ADMIN_ROLE'){
        next();        
    }else{
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
}



module.exports = {
    verificaToken,
    verificaAdmin_Role
}