'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3978;

// Eliminar aviso de Mongoose Promise de consola
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/curso_mean', (err, res) => {
	if(err){
		throw err;
	} else{
		console.log("La conexión a la base de datos está funcionando correctamente...");
		
		app.listen(port,function(){
			console.log("Se ha conectado al servidor web");
		});
	}
});