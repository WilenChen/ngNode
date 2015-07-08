var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');

/* GET blogs listing. */
function getResult(res, err, data) {
	if(err){
		res.json({err:err});
	}else{
		res.json({result:data});
	}
}

function getModelName(req) {
	var m = req.baseUrl.replace("/", "");
	return m; /*&& m.substr(0,1).toUpperCase() + m.substr(1);*/
}
function setRoutes(modelConf) {
	var modelName = modelConf.name.toLowerCase();
	router.get("/", function (req, res, next) {
		var realModelName = getModelName(req).toLowerCase();
		var modelViewPath = __dirname + "/../views/" + realModelName;
		var headerViewPath = modelViewPath + "/headers.html";
		var itemOperateViewPath = modelViewPath + "/item_operate.html";
		var itemViewPath = modelViewPath + "/item.html";
		res.render("datatable.ejs", {
			model : realModelName.toLowerCase(),
			headers : fs.existsSync(headerViewPath) ? fs.readFileSync(headerViewPath) : "",
			item_operate : fs.existsSync(itemOperateViewPath) ? fs.readFileSync(itemOperateViewPath) : "",
			item : fs.existsSync(itemViewPath) ? fs.readFileSync(itemViewPath) : ""
		});
	});
	router.get('/api/list', function(req, res, next) {
		var key = req.query.key;
		var sort = req.query.sort || modelConf.defSortField;
		var desc = req.query.desc || -1;
		var page = req.query.page || 0;
		var pagesize = req.query.pagesize || 20;
		var realModelName = getModelName(req);
		var Model = mongoose.model(realModelName);

		Model.getList({
			key : key,
			sort : sort,
			desc : desc,
			page : page,
			pagesize : pagesize
		},function (err, records) {
			getResult(res, err, records);
		});
	});
	if(!modelConf.crud || modelConf.crud.indexOf("c") > -1) {
		router.post('/api/create', function (req, res, next) {
			var realModelName = getModelName(req);
			var Model = mongoose.model(realModelName);
			var model = new Model(req.body);
			Model.add(model, function (err) {
				res.json({err: err});
			});
		});
	}
	if(!modelConf.crud || modelConf.crud.indexOf("u") > -1) {
		router.post('/api/update', function (req, res, next) {
			var realModelName = getModelName(req);
			var Model = mongoose.model(realModelName);
			var model = new Model(req.body);
			//res.json(model);return;

			Model.update(model, function (err) {
				res.json({err: err});
			})
		});
	}
	if(!modelConf.crud || modelConf.crud.indexOf("d") > -1) {
		router.get('/api/remove', function (req, res, next) {
			var realModelName = getModelName(req);
			var Model = mongoose.model(realModelName);
			if (req.query.id) {
				Model.remove(req.query.id, function (err) {
					res.json({err: err});
				})
			}

		});
	}
	try {
		var modelRoute = require("./" + modelName);
		if (modelRoute) {
			modelRoute(router);
		}
	}catch(e){}
}
module.exports = function (modelName) {
	setRoutes(modelName);
	return router;
};
