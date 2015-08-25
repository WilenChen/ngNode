[中文版README](http://hcnode.github.io/2015/08/17/ngnode/)
## ngNode
Simply and Quickly build your MEAN application.
##Features
* Real time MEAN application.
* Simply and quickly build web application with simple model config object, anything else need to do? no! nothing else!
* Auto generate all things including mongodb collection, CRUD api, datatable, sorting, paging, searching, editing data, etc.
* An User model within it, and with [passport.js](https://github.com/jaredhanson/passport) authentication

##Before You Begin, you may want to know:
This library runs under MEAN, you can find some infomation about MEAN below.
* MongoDB - Go through [MongoDB Official Website](http://mongodb.org/) and proceed to their [Official Manual](http://docs.mongodb.org/manual/), which should help you understand NoSQL and MongoDB better.
* Express - The best way to understand express is through its [Official Website](http://expressjs.com/), which has a [Getting Started](http://expressjs.com/starter/installing.html) guide, as well as an [ExpressJS Guide](http://expressjs.com/guide/error-handling.html) guide for general express topics. You can also go through this [StackOverflow Thread](http://stackoverflow.com/questions/8144214/learning-express-for-node-js) for more resources.
* AngularJS - Angular's [Official Website](http://angularjs.org/) is a great starting point. You can also use [Thinkster Popular Guide](http://www.thinkster.io/), and the [Egghead Videos](https://egghead.io/).
* Node.js - Start by going through [Node.js Official Website](http://nodejs.org/) and this [StackOverflow Thread](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js), which should get you going with the Node.js platform in no time.

##Usages
dependency:
```javascript
"ngnode": "2.0.5"
```
install dependency
```bash
npm install
```
make a config object and call ngNode as function
```javascript
var config = {
	appName : "testapp",
	mongodConnection : "mongodb://localhost:27017/ngnode",
	on : {
		"someaction" : function (req, res, model, cb) {
			// hook all models here you want when "someaction" execute.
			// and can define in the model config as well
			// see the model config below for detail
		}
	}
};
require("ngNode")(config);
```

and save as app.js and run
```bash
node app.js
```
guess what? a MEAN application you have built! it is really simple, is it?

##How simply ngNode be?
with simple config object above, we can quickly build a MEAN application, and a default model "user" in it.

and you can make your own model as well, once a custom model is created and app start,  what ngNode will do with the custom model?

**In server side**
 1. mongodb model collection is created with the schema which define in model config
 2. auto create service with crud actions
 3. auto create crud routers
 4. initialize data from initData config when the app start
 5. custom hooks inject in crud actions

**In client side**
 1. custom fields of collection with title, sortable, queryable, edit type.
 2. auto generate data table with custom page size and pagination
 3. auto generate "create", "edit" and "remove" link, client side routers and ajax request as well
 4. display field value in either default value or return form custom "render" function
 5. multi edit types are support, including simple text, textarea, datepicker, checkbox, date list.

## How to define custom model
ngNode will try to find models in your app's "/models" folder

the follow model module is what the custom model config look like:
 
```javascript
module.exports = function () {
	return {
        name: "blog", // model name, would be used as the name in mongodb collection
        schema: { // collection's fields schema defined
            title: { // field name in mongodb
                text: "Title", // display in header of datatable
                type: String, // define type in mongoose
                editType : "textarea" // [optional] edit type, default is simple text
                editable : true, // [optional] can edit? default is true
                sortable: true, // [optional] can sort? default is false
                render : function(data){ // [optional] custom field's content to display
                                // data : field's content
                    // return something you want, or return data with do nothing as default do
                }
            },
            ... other fields
        }
        defSortField: "title", // default sort field
        queryFields: ["title"], // fields you want to query when searching
        defaultPageSize: 15, // default page size
        on: { // hook only in this model, if you want to hook all model, this should define this in application config's "on"
            "beforeCreate": function (req, res, model, cb) {
                // do something you want before create
                cb(model); // callback and continue to create the "model"
                cb({err : "something wrong and i don't want to continue to create this 'model'"});
                // so avoid the model object has the key "err" when you want to continue the action
            }
        },
        initData : function(mongoose){
            // this function will be called when the app is started
        }
    }
};
```

## A model config which define in node.js module style can use in browser? how?
When the app start, ngNode will pack the custom model module into browser's object by use [browserify](http://browserify.org/), it is awesome, is it?

## dependencies in ngNode
 - [express](http://expressjs.com) : ngNode is a framework of MEAN, so express is included
 - [mongoose](http://mongoosejs.com) : my first choice mongodb ORM
 - [passport](http://passportjs.org): I use passport as authentication
 - [express-session](https://github.com/expressjs/session) : use express-session to maintain user authentication
 - [connect-mongo](https://github.com/kcbanner/connect-mongo) : and use mongodb as session store in express-session
 - [browserify](http://browserify.org) : model module used in server side and browser side, browserify definitely
 - [bcrypt](https://github.com/ncb000gt/node.bcrypt.js) : user model use bcrypt to encode password when create user, and compare password when user login


## Sample
An ngNode's sample can be found in [ngNode-sample](https://github.com/hcnode/ngNode-sample)
 - git clone and run `npm install` and run `npm start`
 - visit in chrome: `http://localhost:9527/user` or `http://localhost:9527/blog` or `http://localhost:9527/yourownmodel` when you add "yourownmodel"
 - login with test@163.com/test
 


