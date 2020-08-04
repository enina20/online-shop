

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre_cat: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la categoria es obligatorio']
    },
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripcion es necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});


module.exports = mongoose.model('Categoria', categoriaSchema);