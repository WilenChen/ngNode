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
router.get('/api/list', function(req, res, next) {
	var key = req.query.key;
	var sort = req.query.sort;
	var desc = req.query.desc || 1;
	var page = req.query.page || 0;
	var pagesize = req.query.pagesize || 20;
	var Blog = mongoose.model('Blog');
	Blog.getList({
		key : key,
		sort : sort,
		desc : desc,
		page : page,
		pagesize : pagesize
	},function (err, blogs) {
		getResult(res, err, blogs);
	});
});

router.post('/api/create', function(req, res, next) {
	var Blog = mongoose.model('Blog');
	var blog = new Blog(req.body);
	Blog.add(blog, function (err) {
		res.json({err : err});
	});
});

router.post('/api/update', function(req, res, next) {
	var Blog = mongoose.model('Blog');
	var blog = new Blog(req.body);
	Blog.update(blog, function (err) {
		res.json({err : err});
	})
});
router.get('/api/remove', function(req, res, next) {
	var Blog = mongoose.model('Blog');
	if(req.query.id) {
		Blog.remove(req.query.id, function (err) {
			res.json({err : err});
		})
	}

});

module.exports = router;
