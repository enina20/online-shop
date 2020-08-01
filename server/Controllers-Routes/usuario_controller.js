


const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();

const Usuario = require('../models/usuario_model');

//PETICIONES URL
app.get('/usuario', function (req, res) {

    let desde = Number(req.query.desde) || 0;
    let limite =  Number( req.query.limite) || 5;
    
    //(filtrar) Podemos filtrar y mandar solamente informacion que nos interese
    Usuario.find({ status: true }, 'nombre email role estado google img ')//(filtar)
        .skip(desde)
        .limit(limite)
        .exec( (err, usuarios) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //Esta funcion cuenta el total de registros y devuelve el total
            Usuario.countDocuments( { status: true }, (err, conteo) => {
                
                res.json({
                    ok: true,
                    usuarios,
                    total: conteo
                });
            });


        })
});
  
app.post('/usuario', function (req, res) {

    let body = req.body;//variable con la data del usuario, obtenido mediante el bodyParser
    
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario : usuarioDB
        });
    });

});
  
  //Las peticiones put deben de recibir el id del usuario que se quiere actualizar mediante /:id
  app.put('/usuario/:id', function (req, res) {
    
      let id = req.params.id; // en esta variable recogemos el parametro que envia el usuario
      
      /*(underscore)La funcion pick del underscore crea una copia del objeto pero solo con las propiedades que el desarrollador necesita, de esta manera no se podra cambiar informacion que no este autorizada*/
      let body = _.pick(req.body, ['nombre','email','img','role']);//(undercore)

    /*Mediante esta funcion buscamos al usuario y actualizamos la inforamcion del mismo
     Recibe como parametros: id del usuario que se quiere actualizar
                           : body la nueva informacion que manda el usuario
                           :opciones { new: true(muestra la nueva informacion del usuario)
                             runValidators: true (realiza todas las validaciones)}*/
      Usuario.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, usuarioDB) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
      });
     
  });
  
  app.delete('/usuario/:id', function (req, res) {

    let id = req.params.id;
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
  
    let cambiaEstado = {
        status: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {       

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado || !usuarioBorrado.status ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });
    
  });



  module.exports = app;