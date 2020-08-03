require('./config/config');

const mongoose = require('mongoose');
const express = require('express');
const app = express();

//Importamos el archivo path que nos ayudara a mostrar la carpeta publica
const path = require('path');

//El bodyParser nos ayuda a obtener la data que manda el usuario en una peticion  post y put
const bodyParser = require('body-parser');

/*********************** BODY PARSER **************************/
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); 
// parse application/json
app.use(bodyParser.json());
/*************************************************************/

//Importamos el archivo de las rutas del usuario (index.routes.js)
app.use( require( './Controllers-Routes/index.routes'));

//habilitamos la carpeta public para que pueda se accedida 
app.use( express.static(path.resolve(__dirname , '../public')));

 


//Conexion a la base de datos mediante mongoose
mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}).then( resp => {
    console.log( `Connecion to MongoDB is OK!` );
}).catch( err => {
    console.log( `Error connecion: `, err );
});
 
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});