
/**
 * Created by harry on 15/4/21.
 */
module.exports = function (mongoose, modelConf, config) {
	var Schema = mongoose.Schema;
	var Model = new Schema(modelConf.schema);

	function getQuery(param){
		var key =  param.key;
		var sort = param.sort || modelConf.defSortField;
		var desc = param.desc ||  1;
		var Model = mongoose.model(modelConf.name);
		var query = Model.find({});
		if(key && modelConf.queryFields){
			var orQuery = [];
			for(var i=0;i<modelConf.queryFields.length;i++){
				var tmp = {};
				tmp[modelConf.queryFields[i]] = new RegExp(key, "gi");
				orQuery.push(tmp);
			}
			query = query.or(orQuery);
		}
		if(sort){
			var sortObj = {};
			sortObj[sort] = desc;
			query = query.sort(sortObj);
		}
		return query;
	}
	Model.statics.getList = function (param, call) {
		//call(name);return;
		var page = param.page || 0;
		var pagesize = param.pagesize || modelConf.defaultPageSize || 20;
		var query = getQuery(param);
		if(page){
			query = query.skip(page * pagesize);
		}
		query = query.limit(pagesize);
		query.exec(function (err, records) {
			if(err) {
				call(err, records);
			}else{
				getQuery(param).count(function (err, count) {
					call(err, {list : records, count : count});
				});
			}
		})
	}
	function hook(req, res, model, action, cb) {
		var tCall = function (req, res, model, cb) {
			cb(model);
		};
		var configHook = (config.on && config.on[action]) || tCall;
		var modelHook = (modelConf.on && modelConf.on[action]) || tCall;
		configHook(req, res, model, function (newModel) {
			if(newModel.err){
				cb(newModel);
			}else {
				modelHook(req, res, model, function (newModel) {
					cb(newModel);
				});
			}
		});
	}

	function getErrorResult(err, code, msg) {
		return {
			code : code || 500,
			msg : msg || "",
			err : err
		}
	}

	Model.statics.update = function (req, res, model, call) {
		hook(req, res, model, "beforeUpdate",  function (newModel) {
			if(newModel.err){
				call(getErrorResult(newModel.err, 500, "beforeUpdate"));
			}else {
				var Model = mongoose.model(modelConf.name);
				Model.findOneAndUpdate({_id: model._id}, newModel, function (err) {
					if (err) {
						call(getErrorResult(err));
					} else {
						hook(req, res, model, "afterUpdate", function (result) {
							var err = result.err;
							if (err) {
								call(getErrorResult(err, 500, "afterUpdate"));
							} else {
								call(result);
							}
						});
					}
				})
			}
		});

	}
	Model.statics.add = function (req, res, model, call) {
		hook(req, res, model, "beforeCreate",  function (newModel) {
			if(newModel.err){
				call(getErrorResult(newModel.err, 500, "beforeCreate"));
			}else {
				var Model = mongoose.model(modelConf.name);
				newModel.save(function (err, result) {
					if (err) {
						call(getErrorResult(err));
					} else {
						hook(req, res, model, "afterCreate", function (result) {
							var err = result.err;
							if (err) {
								call(getErrorResult(err, 500, "afterCreate"));
							} else {
								call(result);
							}
						});
					}
				});
			}
		});
	}
	Model.statics.remove = function (req, res, id, call) {
		hook(req, res, id, "beforeRemove",  function (newModel) {
			if(newModel.err){
				call(getErrorResult(newModel.err, 500, "beforeRemove"));
			}else {
				var Model = mongoose.model(modelConf.name);
				Model.findByIdAndRemove({_id : id}, function (err) {
					if (err) {
						call(getErrorResult(err));
					} else {
						hook(req, res, id, "afterRemove", function (result) {
							var err = result.err;
							if (err) {
								call(getErrorResult(err, 500, "afterRemove"));
							} else {
								call(result);
							}
						});
					}
				})
			}
		});

	}
	mongoose.model(modelConf.name, Model);
}
