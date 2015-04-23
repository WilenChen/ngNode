var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var requirejs = require('requirejs');

requirejs.config({
	baseUrl: __dirname,
	nodeRequire: require
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'src/public')));
app.use('/assert_bower', express.static(path.join(__dirname,  'bower_components')));

//var blog = require('./src/routes/blog');
var modelConf = require("./src/public/model/conf");
var route = require('./src/routes/route');
var model = require('./src/models/model');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/blog');
for(var i=0;i<modelConf.length;i++) {
	var conf = requirejs("src/public/model/" + modelConf[i]);
	conf.server.name = conf.name;
	model(mongoose, conf.server, conf.name);
	//console.log(conf.name);
	conf.server.initData && conf.server.initData();
	app.use('/' + modelConf[i], route(conf.name));
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

// Mongod conf, blog model and blog controller
//require('./src/models/blog')(mongoose);
//var Blog = mongoose.model('Blog');
//Blog.initData();

console.log("open http://localhost:3000/html/datatable.html#blog");
module.exports = app;
