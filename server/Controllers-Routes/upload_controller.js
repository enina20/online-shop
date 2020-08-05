

const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario_model');
const Producto = require('../models/producto_model');
const fs = require('fs');
const path = require('path');

//Middleware de fileUpload
app.use( fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;



    if(!req.files){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se seleciona ningun archivo'
            }
        });
    }

    let archivo = req.files.archivo;
    let extension = archivo.name.split('.')[1];

    //Extensiones permitidas de los archivo que se suben
    let tiposPermitidos = ['usuarios', 'productos'];

    if( tiposPermitidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                err: 'El tipo de tu archivo no esta permitido',
                message: 'Los tipos permitidos son ' + tiposPermitidos.join(', ')
            }
        });

    }
    
    //Extensiones permitidas de los archivo que se suben
    let extensionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];    

    if( extensionesPermitidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                err: 'La extendion de tu archivo no esta permitido',
                message: 'Las extendiones permitidas son ' + extensionesPermitidas.join(', ')
            }
        });

    }



    //Cambiar nombre del archivo
    let nombreArchivo = `${ id } - ${ new Date().getMilliseconds() }.${ extension }`
    archivo.mv( `uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err:{
                    err,
                    message: 'No se pudo mover el archivo'
                }
            });
        }

        //Aqui la imagen ya esta cargada en la carpeta correspondiente
        //Lo que ahora debemos hacer es actualizar la infromacion del usuario o producto
        if(tipo === 'usuario'){
            imagenUsuario(id, res, nombreArchivo);
        }else{
            imagenProducto(id, res, nombreArchivo);
        }
    });
});

function imagenUsuario( id, res, nombreArchivo){

    Usuario.findById(id, (err, usuarioDB) => {

        if(err){
            borraArchivo( nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB){
            borraArchivo( nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        
        usuarioDB.img = nombreArchivo;
        usuarioDB.save( ( err, usuarioSave ) => {

            res.json({
                ok: true,
                usuario: usuarioSave,
                img: nombreArchivo
            });

        });
    });
    
}
function imagenProducto( id, res, nombreArchivo ){
    Producto.findById(id, (err, productoDB) => {

        if(err){
            borraArchivo( nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            borraArchivo( nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos');

        
        productoDB.img = nombreArchivo;
        productoDB.save( ( err, productoSave ) => {

            res.json({
                ok: true,
                producto: productoSave,
                img: nombreArchivo
            });

        });
    });

}

function borraArchivo(nombreArchivo, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreArchivo }`);

    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;