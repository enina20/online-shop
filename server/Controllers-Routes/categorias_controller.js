

const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();
let Categoria = require('../models/categoria_model');

//========================================
//Mostrar todas las categorias
//========================================
app.get('/categoria',verificaToken, (req,res) => {

    Categoria.find({},)
        .sort('nombre_cat')
        .populate('usuario', 'nombre email')        
        .exec( (err, categorias) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            });
        });
   

});
//========================================
//Mostrar una categoria por ID
//========================================
app.get('/categoria/:id',verificaToken, (req,res) => {
    //Categorias.findByID(.....);
    let id = req.params.id; 
    Categoria.findById(id)
        .populate('usuario', 'nombre email')
        .exec( (err, categoriaDB) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoria: categoriaDB
            });
        });
});

//========================================
//Crear una categoria categoria
//========================================
app.post('/categoria', [verificaToken, verificaAdmin_Role], (req,res) => {
    //regresa la nueva categoria
    //req.usuario._id
    let body = req.body;
    let categoria = new Categoria({
        nombre_cat: body.nombre_cat,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria : categoriaDB
        });
    });


});
//========================================
//Editar una categoria
//========================================
app.put('/categoria/:id',[verificaToken, verificaAdmin_Role], (req,res) => {
    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, categoriaDB) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
      }); 
});
//========================================
//Elimina una categoria
//========================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role],(req,res) => {
    //solo un administrador puede borrar una categoria
    //Categoria.findByIdAndRemove
    let id = req.params.id;
    Categoria.findByIdAndRemove( id, (err, categoriaDEL) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err:{
                    message: 'Error en la base de datos'
                }
            });
        };

        if (!categoriaDEL ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria eliminada'
        });
    });
});



module.exports = app;
