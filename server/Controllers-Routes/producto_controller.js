
const express = require('express');

const app = express();

const Producto = require('../models/producto_model');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

//================================
//Obtener todos los productos
//================================
app.get('/producto', verificaToken, (req, res) => {
    //Todos los productos paginados
    //populate: usuario y categoria
    let desde = Number(req.query.desde) || 0;
    let limite =  Number( req.query.limite) || 5;

    Producto.find( { disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre_cat')
        .skip(desde)
        .limit(limite)
        .exec( (err, productos) => {

            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.countDocuments( { disponible: true }, (err, conteo) => {                
                res.json({
                    ok: true,
                    productos,
                    total: conteo
                });
            });

        });
});

//================================
//Obtener un producto por id
//================================
app.get('/producto/:id', verificaToken, (req, res) => {
    //populate: usuario y categoria
    let id = req.params.id; 
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre_cat')
        .exec( (err, productoDB) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if(!productoDB){
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

//================================
//Buscar un producto
//================================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    //Expresion regular que permitira realizar una busqueda flexible e insensible a min y may
    let regex = new RegExp(termino, 'i');
    Producto.find( {nombre: regex, disponible: true})
        .populate('categoria', 'nombre_cat')
        .exec( (err, productos) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Producto.countDocuments( { disponible: true }, (err, conteo) => {                
                res.json({
                    ok: true,
                    productos,
                    total: conteo
                });
            });
            

        });
});

//================================
//Crear un producto
//================================
app.post('/producto', [ verificaToken, verificaAdmin_Role ], (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,        
        usuario: req.usuario._id,
        categoria: body.categoria
    });
    producto.save((err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto : productoDB
        });

    });
    //Todos los productos paginados
    //populate: usuario y categoria
});

//================================
//Actualizar un producto
//================================
app.put('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, productoDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
    //Todos los productos paginados
    //populate: usuario y categoria
});

//================================
//Eliminar un producto
//================================
app.delete('/producto/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //Todos los productos paginados
    //populate: usuario y categoria
    // actualizar disponible

    let id = req.params.id;

    let cambioDeDisponibilidad = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambioDeDisponibilidad, {new: true}, (err, productoDEL) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!productoDEL ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDEL
        });

    });
});


module.exports = app;