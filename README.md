## Angunode
Data table demo and configurable model in angularjs, and also a MEAN demo

##Before You Begin
This demo runs under MEAN, you can find some infomation about MEAN below.
* MongoDB - Go through [MongoDB Official Website](http://mongodb.org/) and proceed to their [Official Manual](http://docs.mongodb.org/manual/), which should help you understand NoSQL and MongoDB better.
* Express - The best way to understand express is through its [Official Website](http://expressjs.com/), which has a [Getting Started](http://expressjs.com/starter/installing.html) guide, as well as an [ExpressJS Guide](http://expressjs.com/guide/error-handling.html) guide for general express topics. You can also go through this [StackOverflow Thread](http://stackoverflow.com/questions/8144214/learning-express-for-node-js) for more resources.
* AngularJS - Angular's [Official Website](http://angularjs.org/) is a great starting point. You can also use [Thinkster Popular Guide](http://www.thinkster.io/), and the [Egghead Videos](https://egghead.io/).
* Node.js - Start by going through [Node.js Official Website](http://nodejs.org/) and this [StackOverflow Thread](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js), which should get you going with the Node.js platform in no time.

##install dependences
```bash
$ npm install
```
##Run application
```bash
$ npm start
```
##Open demo
Open http://localhost:3000/html/datatable.html#blog

##Data init
When first time run the application, there will auto generate 100 records of model "blog"

##Make your own model
You can make your own model like the "blog" model demo fowllow the below steps.
* make express routes with CRUD actions under /src/routes/
* make Mongod model with Schema and CRUD actions under /src/models/
* make angularjs modelunder /src/public/javascript/model/, and implement schema configuration, and list, add, remove method
