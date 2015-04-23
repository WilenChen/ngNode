var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET blogs listing. */
function getResult(res, err, data) {
	if(err){
		res.json({err:err});
	}else{
		res.json({result:data});
	}
}

function setRoutes(modelName) {
	router.get('/api/list', function(req, res, next) {
		var key = req.query.key;
		var sort = req.query.sort;
		var desc = req.query.desc || 1;
		var page = req.query.page || 0;
		var pagesize = req.query.pagesize || 20;
		var Model = mongoose.model(modelName);

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

	router.post('/api/create', function(req, res, next) {
		var Model = mongoose.model(modelName);
		var model = new Model(req.body);
		Model.add(model, function (err) {
			res.json({err : err});
		});
	});

	router.post('/api/update', function(req, res, next) {
		var Model = mongoose.model(modelName);
		var model = new Model(req.body);
		//res.json(model);return;

		Model.update(model, function (err) {
			res.json({err : err});
		})
	});

	router.get('/api/remove', function(req, res, next) {
		var Model = mongoose.model(modelName);
		if(req.query.id) {
			Model.remove(req.query.id, function (err) {
				res.json({err : err});
			})
		}

	});
}
module.exports = function (modelName) {
	setRoutes(modelName);
	return router;
};
