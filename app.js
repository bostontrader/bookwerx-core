var express = require("express");
var http = require("http");
var logger = require("morgan");
var mysql = require('mysql');
var bodyParser = require('body-parser')

var app = express();
module.exports = app; // export this for testing

var dbCredentials = require("./database").dbCredentials;
var dbConnection  = mysql.createConnection(dbCredentials);
dbConnection.connect();

//app.use(logger("short")); // morgan logger

app.use(bodyParser.urlencoded());

app.set("port", process.env.PORT || 3001);

app.get("/", function(req, res) {
    res.type("text");
    res.send(req.headers["user-agent"]);
});

app.post("/brainwipe", function(req, res) {

    // turn off referential integrity constraints

    // truncate the tables
    var query = "truncate currencies";

    // Only care about the err, if any
    dbConnection.query(query, function (err, rows, fields) {
        if (err)
            res.json({"err":JSON.stringify(err)});
        else
            res.json({"result":"ok"});
    });

    // turn on the constraints

});

var currencies_routes = require("./currencies");
currencies_routes(app, dbConnection);

var categories_routes = require("./categories");
categories_routes(app, dbConnection);

app.listen(app.get("port"), function() {
    console.log("App started on port " + app.get("port"));
});