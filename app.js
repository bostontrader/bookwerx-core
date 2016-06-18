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

// This is good for testing, but why would we ever want to use this in real
// life? If we want to empty all the tables, better to use some other admin
// tool.
//
// TRUNCATE will fail if we have foreign key constraints.  We _might_ be able
// to turn off the constraints, TRUNCATE, and then turn the constraints back on,
// but I haven't explored that route.
//
// DELETE works just fine, but we have to be careful to delete the rows from
// the tables in the correct order, in order to keep the constraints happy.
app.post("/brainwipe", function(req, res) {

    // Be careful to list these in the order of deletion, in order to keep
    // the constraints happy
    dbConnection.query("delete from distributions", function (err, rows, fields) {
        if (err) res.json({"error":JSON.stringify(err)})});

    dbConnection.query("delete from transactions", function (err, rows, fields) {
        if (err) res.json({"error":JSON.stringify(err)})});

    dbConnection.query("delete from currencies", function (err, rows, fields) {
        if (err) res.json({"error":JSON.stringify(err)})});

    dbConnection.query("delete from accounts_categories", function (err, rows, fields) {
        if (err) res.json({"error":JSON.stringify(err)})});

    dbConnection.query("delete from accounts", function (err, rows, fields) {
        if (err) res.json({"error":JSON.stringify(err)})});

    dbConnection.query("delete from categories", function (err, rows, fields) {
        if (err) res.json({"error":JSON.stringify(err)})});

    res.json({"result":"ok"});
});

var accounts_routes = require("./accounts");
accounts_routes(app, dbConnection);

var categories_routes = require("./categories");
categories_routes(app, dbConnection);

var currencies_routes = require("./currencies");
currencies_routes(app, dbConnection);

//var distributions_routes = require("./distributions");
//distributions_routes(app, dbConnection);

var transactions_routes = require("./transactions");
transactions_routes(app, dbConnection);

app.listen(app.get("port"), function() {
    console.log("App started on port " + app.get("port"));
});