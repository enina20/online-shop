

const express = require('express');
const app = express();

app.use( require( './usuario_controller'));
app.use( require( './login_controller'));
app.use( require( './categorias_controller'));
app.use( require( './producto_controller'));





module.exports = app;