var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoStore = require('connect-mongo')((session));
var www = require("./www");
var fs = require('fs');

module.exports = function (config) {
	var mongodConnection = config.mongodConnection;
	if(!mongodConnection){
		throw "mongodConnection not found";
	}
	var app = express();
	app.set('views', path.join(__dirname + "/src", 'views'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'src/public')));
	app.use('/bower_components', express.static(path.join(__dirname,  'bower_components')));
	app.use(session({
		secret: 'hcnode',
		saveUninitialized : false,
		resave : false,
		store: new mongoStore({
			url: mongodConnection
		}),
		cookie: { maxAge: 1000*60*60*24*7}
	}));

	app.use(require("./src/polices/auth"));
	var route = require('./src/routes/route');
	var model = require('./src/models/model');
	var mongoose = require('mongoose');
	mongoose.connect(mongodConnection);

	var bcrypt = require('bcrypt');
	var userModel = require("./src/models/user")(bcrypt, mongoose);

	model(mongoose, userModel, userModel);
	userModel.initData && userModel.initData(mongoose);
	app.use('/' + userModel.name, route(userModel));

	require("./src/models/util").init("user", "./");
	require("./src/models/util").createCustom(app, config, __dirname);

	app.use(function(req, res, next) {
	  var err = new Error('Not Found');
	  err.status = 404;
	  next(err); // test
	});

	// error handlers

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
	  app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.json({
		  message: err.message,
		  err: err
		});
	  });
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function(err, req, res, next) {
	  res.status(err.status || 500);
		res.json({
			message: err.message,
			err: err
		});
	});
	console.log("open http://localhost:9527/user");
	www(app);
}
