var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var requirejs = require('requirejs');
var session = require('express-session');
var mongoStore = require('connect-mongo')((session));
var www = require("./www");


module.exports = function (config) {
	var mongodConnection = config.mongodConnection;
	if(!mongodConnection){
		throw "mongodConnection not found";
	}
	var modelConf = config.modelConfig;
	if(!modelConf){
		throw "modelConf not found";
	}
	requirejs.config({
		baseUrl: __dirname,
		nodeRequire: require
	});
	var app = express();
	app.set('views', path.join(__dirname + "/src", 'views'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'src/public')));
	app.use('/assert_bower', express.static(path.join(__dirname,  'bower_components')));
	app.use(session({
		secret: 'hcnode',
		saveUninitialized : false,
		resave : false,
		store: new mongoStore({
			url: mongodConnection
		}),
		cookie: { maxAge: 1000*60*24}
	}));

	app.use(require("./src/polices/auth"));
	var route = require('./src/routes/route');
	var model = require('./src/models/model');
	var mongoose = require('mongoose');
	mongoose.connect(mongodConnection);
	var userModel = requirejs("src/public/model/user");
	modelConf.splice(0, 0, userModel);
	for(var i=0;i<modelConf.length;i++) {
		model(mongoose, modelConf[i]);
		modelConf[i].initData && modelConf[i].initData(mongoose);
		app.use('/' + modelConf[i].name, route(modelConf[i]));
	}

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
	console.log("open http://localhost:9527/movie");
	www(app);
}
