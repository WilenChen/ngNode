/**
 * Created by harry on 15/4/21.
 */
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}

define(function () {
	return {
		name: "user",
		schema: {
			email:{
				type:String,
				sortable: true,
				text : "email"
			},
			password:{
				type:String
			},
			registerDate:{
				type:Date,
				sortable: true,
				text: "registerDate"
			},
			loginDate:{
				type:Date,
				text : "loginDate"
			},
			role:{
				type:String,
				text : "role",
				editType : ["admin", "member"]
			}
		},
		defSortField: "email",
		queryFields: ["email"],
		defaultPageSize: 10,
		initData : function (mongoose) {
			this.createUser(mongoose, function (msg) {
				console.log(msg ? msg : "user created");
			});
		},
		createUser : function(mongoose, cb, email, password){
			var User = mongoose.model("user");
			password = password || "test";
			email = email || "test@163.com";
			User.findOne({email : email}, function (err, user) {
				if(user){
					cb("user exist");
				}else{
					var bcrypt = require('bcrypt');
					bcrypt.genSalt(10, function(err, salt) {
						bcrypt.hash(password, salt, function(err, hash) {
							if (err) {
								cb("user create fail");
							}else{
								User.create({email : email, password : hash, role : "admin"}, function (err, user) {
									if(user) {
										cb();
									}else{
										cb("user create fail");
									}
								})
							}
						});
					});
				}
			});

		}
	}
});
