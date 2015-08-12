/**
 * Created by harry on 15/7/9.
 */
var ejs = require("ejs");
var fs = require("fs");
var browserify = require('browserify');
var mongoose = require('mongoose');
var route = require('../routes/route');

module.exports = {
	init : function(model, path){
		ejs.renderFile(__dirname + '/wrapper.ejs', {model:model, path : path}, function(err, html){
			var fd = fs.openSync(__dirname + "/wrapper_"+ model +".js", "w");
			fs.writeSync(fd, html);
			fs.closeSync(fd);
			var b = browserify(__dirname + '/wrapper_'+ model +'.js');
			b.bundle().pipe(fs.createWriteStream(__dirname + '/../public/client/model/'+ model +'.js'));
		});
	},
	createCustom : function(app, config, appDir){
		var path =  "../../../../models/";
		var that = this;
		var files = fs.readdirSync(__dirname + "/" + path);
		for(var i=0;i<files.length;i++){
			var model = files[i].replace(".js", "");
			that.init(model, path);
			var Model = require(path + model);
			var customModel = Model.apply(Model);
			require('./model')(mongoose, customModel, config);
			customModel.initData && customModel.initData(mongoose);
			app.use('/' + customModel.name, route(customModel));
		}
	}
}