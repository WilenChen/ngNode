
/**
 * Created by harry on 15/4/21.
 */
//var getComments = function (i) {
//	var commentsCount = Math.round(Math.random() * 5);
//	var reuslt = [];
//	for(var j=0;j<commentsCount;j++){
//		result.push({
//			body :
//		})
//	}
//};
var getData = function () {
	var result = [];
	for(var i=0;i<100;i++){
		result.push({
			title : "title" + i,
			author : "author" + i,
			body : "body body body body body body body body body body body body body body body body body body body body body body ",
			date : new Date(new Date().valueOf() + (i * 1000 * 3600 * 24)),
			category : ["Mongod", "Express", "Angularjs", "Node"][Math.floor(Math.random()*4)],
			recommend : false
		});
	}
	return result;
}
module.exports = function (mongoose) {
	var Schema = mongoose.Schema;
	var Blog = new Schema({
		title:  String,
		author: String,
		body:   String,
		date: { type: Date, default: Date.now },
		category:   String,
		recommend: Boolean
	});
	Blog.statics.initData = function (call) {
		var Blog = mongoose.model('Blog');
		Blog.find({}).count(function (err, count) {
			if(count == 0){
				Blog.create(getData(), function (err, records) {
					if(err) console.log(err);
				})
			}
		})
	}
	function getQuery(param){
		var key =  param.key;
		var sort = param.sort || "date";
		var desc = param.desc ||  1;
		var Blog = mongoose.model('Blog');
		var query = Blog.find({});
		if(key){
			query = query.or([{title:new RegExp(key, "gi")},{author:new RegExp(key, "gi")}]);
		}
		if(sort){
			var sortObj = {};
			sortObj[sort] = desc;
			query = query.sort(sortObj);
		}
		return query;
	}
	Blog.statics.getList = function (param, call) {
		var page = param.page || 0;
		var pagesize = param.pagesize || 20;
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
	Blog.statics.update = function (blog, call) {
		var Blog = mongoose.model('Blog');
		Blog.findOneAndUpdate({_id : blog._id}, blog, function (err) {
			call(err);
		})
	}
	Blog.statics.add = function (blog, call) {
		var Blog = mongoose.model('Blog');
		blog.save(function (result) {
			call();
		});
	}
	Blog.statics.remove = function (id, call) {
		var Blog = mongoose.model('Blog');
		Blog.findByIdAndRemove({_id : id}, function (err) {
			call(err);
		})
	}
	mongoose.model('Blog', Blog);
}
