'use strict'

let assert = require('assert')
let bodyParser = require('body-parser')
let express = require("express")
let http = require("http")
let logger = require("morgan")

let app = express()

let MongoClient = require('mongodb').MongoClient
let mongoURL = 'mongodb://localhost:27017/bookwerx-test'

//app.use(logger("short"))

app.use(bodyParser.urlencoded())

app.set("port", process.env.PORT || 3006)

// Connect to the mongo server...
MongoClient.connect(mongoURL).then(function resolve(mongoDb){
    // And then setup the routes, because the routes need access to the mongodb
    require("./accounts")(app, mongoDb)

    app.post("/brainwipe", function (req, res) {
        mongoDb.dropDatabase().then(function(result) {
            res.json({"result":"ok"});
        }).catch(function(error){
            res.json({"error":JSON.stringify(err)});
        })
    })

    // And we don't want to start listening before the routes are setup
    app.listen(app.get("port"), function() {
        console.log("App started on port " + app.get("port"))
    })

}).catch(function reject(error){
    console.log(error)
})
