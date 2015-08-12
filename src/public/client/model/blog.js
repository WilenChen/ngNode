(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by harry on 15/4/21.
 */
module.exports = function () {
	return {
		name: "blog",
		schema: {
			title: {
				type: String,
				sortable: true,
				text: "Title"
			},
			author: {
				type: String,
				sortable: true,
				text: "Author"
			},
			content: {
				type: String,
				editType: "textarea",
				render: function (data) {
					return data ? data.length > 40 ? data.substring(0, 40) + ".." : data : "";
				},
				text: "Content"
			},
			createAt: {
				type: Date,
				sortable: true,
				render: function (data) {
					return data && data.split("T")[0];
				},
				text: "createAt"
			},
			createBy: {
				type: String,
				editable: false,
				text: "createBy"
			},
			category: {
				text: "Category",
				type : String,
				editType: ["Mongod", "Express", "Angularjs", "Node"]
			},
			recommend: {
				text: "Recommend",
				type: Boolean,
				render: function (data) {
					return "";
				}
			}
		},
		defSortField: "title",
		queryFields: ["title", "author"],
		defaultPageSize: 15,
		on: {
			"beforeCreate": function (req, res, model, cb) {
				model.createAt = new Date();
				model.err = "xxx";
				cb(model);
			}
		},
		initData: function (mongoose) {
			var Blog = mongoose.model("blog");
			Blog.create({
				title : "what is ngNode?",
				author : "hcnode",
				content : "todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo todo" +
					" todo todo todo todo todo todo",
				category : "Node",
				recommend : true
			}, function (err, blog) {
				if(err){
					console.log("create blog fail when init model");
				}else {
					console.log("create blog success when init model");
				}
			});
		}
	};
}

},{}],2:[function(require,module,exports){
/**
 * Created by harry on 15/7/9.
 */
window.ModelConf = require("/Users/harry/node/angunode2/angunode-sample/models//blog");

},{"/Users/harry/node/angunode2/angunode-sample/models//blog":1}]},{},[2]);
