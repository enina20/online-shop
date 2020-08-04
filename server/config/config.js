
//===================================
// PUERTO
//===================================
process.env.PORT = process.env.PORT || 3000;

//===================================
// ENTORNO
//===================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================================
// VENCIMIENTO DEL TOKEN
//===================================
process.env.CADUCIDAD_TOKEN = '48h';

//===================================
// SEED DE AUTENTICACION
//===================================
process.env.SEED = process.env.SEED || 'seed-desarrollo';

//===================================
// BASE DE DATOS
//===================================
//MONGO_URI es una configuracion de heroku
let urlDB;
if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = process.env.MONGO_URI;    
}

process.env.URLDB = urlDB;

//===================================
// GOOGLE CLIENT ID
//===================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '643978838367-b2qmivcgj312cckh285vikf5ff1truat.apps.googleusercontent.com'; 