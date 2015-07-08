/**
 * Created by harry on 15/6/13.
 */
var express = require('express');
var mongoose = require("mongoose");
var bcrypt = require('bcrypt');
function login(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	if(!email || !password){
		res.redirect("/login");
		return;
	}
	var User = mongoose.model("user");
	User.find({email: email}, function(err, userInfos) {
		if (err) {
			res.status(500).render({
				err: err,
				url: req.url
			});
		} else {
			var userInfo = userInfos[0]._doc;
			if (userInfo) {
				for(var k in userInfo){
					console.log(k, ":", userInfo[k]);
				}
				bcrypt.compare(password, userInfo.password, function (err, result) {
					if(result){
						req.session.user = userInfo;
						req.session.isLogin = true;
						req.session.save(function(err) {
							if(err){
								res.status(500).render({
									err: err,
									url: req.url
								});
							}else {
								res.redirect("/user");
							}
						})
					}else{
						res.json({
							error: 'Login failed'
						});
					}
				});

			} else {
				res.status(403).json({
					title: 'Login failed',
					error: 'Incorrect username'
				});
			}
		}
	});
}
module.exports = function (req, res, next) {
	if (req.path == "/login") {
		if (req.method == "GET") {
			res.render("login.ejs");
		} else if (req.method == "POST") {
			login(req, res);
		}else{
			res.status(403).json({
				code : 403,
				err: "forbidden",
				url: req.path
			})
		}
	} else if(req.path == "/logout"){
		if(req.session){
			req.session.destroy(function () {
				res.redirect("/login")
			});
		}else{
			res.redirect("/login")
		}
	}else if (req.session && req.session.isLogin) {
		if(req.session.user.role == "admin") {
			next();
		}else{
			res.redirect("/logout");
		}
	} else {
		//res.status(403).json({
		//	code : 403,
		//	err: "forbidden",
		//	url: req.path
		//})
		res.redirect("/login");
	}
}
