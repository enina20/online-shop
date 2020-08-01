const mongoose = require('mongoose');

//Nos ayuda a validar el email, para que no se registren repetidos
const uniqueValidator = require('mongoose-unique-validator');

//Definimos que roles son validos en el Schema
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es obligatorio']        
    },
    password: {
        type: String,
        required: [true, 'El contrasena es obligatorio']
    },
    img: {
        type: String,        
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


//Modificamos el Schema para guardar informacion que no es necesaria ser mostrada
usuarioSchema.methods.toJSON = function() {
    let user = this; 
    let userObject = user.toObject();
    delete userObject.password; // eliminamos la contrasena del esquema

    return userObject; // Retornamos el onjeto del Schema
}

//Hacemos referencia al plugin del unique-validator que validara la informacion
usuarioSchema.plugin( uniqueValidator, {
    message: '{PATH} debe de ser unico'
});


module.exports = mongoose.model( 'Usuario', usuarioSchema);