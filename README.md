## ngNode
Simply and quickly make your MEAN application.
##Features
* Real time MEAN application.
* Simply and quickly make your own application with simple configuration.
* Auto generating CRUD routes both in server and client, and CRUD action in Mongodb Model.
* An User model within it, and with [passport.js](https://github.com/jaredhanson/passport) authenticate native

##Before You Begin
This demo runs under MEAN, you can find some infomation about MEAN below.
* MongoDB - Go through [MongoDB Official Website](http://mongodb.org/) and proceed to their [Official Manual](http://docs.mongodb.org/manual/), which should help you understand NoSQL and MongoDB better.
* Express - The best way to understand express is through its [Official Website](http://expressjs.com/), which has a [Getting Started](http://expressjs.com/starter/installing.html) guide, as well as an [ExpressJS Guide](http://expressjs.com/guide/error-handling.html) guide for general express topics. You can also go through this [StackOverflow Thread](http://stackoverflow.com/questions/8144214/learning-express-for-node-js) for more resources.
* AngularJS - Angular's [Official Website](http://angularjs.org/) is a great starting point. You can also use [Thinkster Popular Guide](http://www.thinkster.io/), and the [Egghead Videos](https://egghead.io/).
* Node.js - Start by going through [Node.js Official Website](http://nodejs.org/) and this [StackOverflow Thread](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js), which should get you going with the Node.js platform in no time.

##Usages
dependencies:
```javascript
"ngnode": "2.0.4"
```
make a config object and call lib as function directly
```javascript
var config = {
	appName : "testapp",
	mongodConnection : "mongodb://localhost:27017/ngnode"
};
require("ngNode")(config);
```
visit in chrome: http://localhost:9527/user



