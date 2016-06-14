var express = require("express");
var http = require("http");
var logger = require("morgan");
var mysql=require('mysql');

var app = express();
module.exports = app; // export this for testing

var dbCredentials = require("./database").dbCredentials;
var dbConnection  = mysql.createConnection(dbCredentials);
dbConnection.connect();

app.use(logger("short")); // morgan logger

app.set("port", process.env.PORT || 3000);

app.get("/", function(req, res) {
    res.type("text");
    res.send(req.headers["user-agent"]);
});

app.post("/brainwipe", function(req, res) {
    res.type("text");
    res.send("wiped");
});

var currencies_routes = require("./currencies");
currencies_routes(app, dbConnection);

app.listen(app.get("port"), function() {
    console.log("App started on port " + app.get("port"));
});