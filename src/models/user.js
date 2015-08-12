/**
 * Created by harry on 15/4/21.
 */
var bcrypt;
var mongoose;
function beforeCreate(User, password, email, cb){
	User.findOne({email : email}, function (err, user) {
		if(user){
			cb();
			console.log("user exist");
		}else{
			encode(password, function (encodePassword) {
				if(encodePassword){
					cb(encodePassword);
				}else{
					cb();
					console.log("encode error");
				}
			});
		}
	});
}
function encode(str, cb){
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(str, salt, function(err, hash) {
			if (err) {
				cb();
			}else{
				cb(hash);
			}
		});
	});
}
module.exports = function (_bcrypt, _mongoose) {
	bcrypt = _bcrypt;
	mongoose = _mongoose;
	return {
		name: "user",
		schema: {
			email: {
				type: String,
				sortable: true,
				text: "email"
			},
			password: {
				text: "password",
				listable: false,
				type: String
			},
			registerDate: {
				type: Date,
				text: "registerDate",
				editable: false
			},
			loginDate: {
				type: Date,
				text: "loginDate",
				editable: false
			},
			role: {
				type: String,
				text: "role",
				editType: ["admin", "member"]
			}
		},
		defSortField: "email",
		queryFields: ["email"],
		defaultPageSize: 10,
		on: {
			"beforeCreate": function (req, res, model, cb) {
				var User = mongoose.model("user");
				beforeCreate(User, model.password, model.email, function (hash) {
					if (!hash) {
						cb({err: "error"});
					} else {
						model.password = hash;
						cb(model);
					}
				});
			}
		},
		initData: function (mongoose) {
			this.createUser(mongoose, function (msg) {
				//console.log(msg ? msg : "user created");
			});
		},
		createUser: function (mongoose, cb, email, password) {
			var User = mongoose.model("user");
			password = password || "test";
			email = email || "test@163.com";
			beforeCreate(User, password, email, function (hash) {
				if (!hash) {
					cb("error");
				} else {
					User.create({email: email, password: hash, role: "admin"}, function (err, user) {
						if (user) {
							cb();
						} else {
							cb("user create fail");
						}
					})
				}
			});
		}
	}
}
