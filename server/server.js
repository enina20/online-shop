require('./config/config');

const express = require('express');
const app = express();

//El bodyParser nos ayuda a obtener la data que manda el usuario en una peticion  post y put
const bodyParser = require('body-parser');

/*********************** BODY PARSER **************************/
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })); 
// parse application/json
app.use(bodyParser.json());
/*************************************************************/

 
//PETICIONES URL
app.get('/usuario', function (req, res) {
  res.json('Get usuario')
});

app.post('/usuario', function (req, res) {

    let body = req.body;//variable con la data del usuario, obtenido mediante el bodyParser
    res.json({
        persona: body
    });
});

//Las peticiones put deben de recibir el id del usuario que se quiere actualizar mediante /:id
app.put('/usuario/:id', function (req, res) {

    let id = req.params.id; // en esta variable recogemos el parametro que envia el usuario
    res.json({
        id
    });
});

app.delete('/usuario', function (req, res) {
    res.json('Delete usuario')
});
 
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});