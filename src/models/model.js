
/**
 * Created by harry on 15/4/21.
 */
module.exports = function (mongoose, modelConf, name) {
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
			//query = query.or([{title:new RegExp(key, "gi")},{author:new RegExp(key, "gi")}]);
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
	Model.statics.update = function (model, call) {
		var Model = mongoose.model(modelConf.name);
		Model.findOneAndUpdate({_id : model._id}, model, function (err) {
			call(err);
		})
	}
	Model.statics.add = function (model, call) {
		var Model = mongoose.model(modelConf.name);
		model.save(function (result) {
			call();
		});
	}
	Model.statics.remove = function (id, call) {
		var Model = mongoose.model(modelConf.name);
		Model.findByIdAndRemove({_id : id}, function (err) {
			call(err);
		})
	}
	mongoose.model(modelConf.name, Model);
}
