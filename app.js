var express = require("express");
var http = require("http");
var logger = require("morgan");

var app = express();
module.exports = app;

app.use(logger("short")); // morgan logger

app.set("port", process.env.PORT || 3000);

app.get("/", function(req, res) {
    res.type("text");
    res.send(req.headers["user-agent"]);
});


app.listen(app.get("port"), function() {
    console.log("App started on port " + app.get("port"));
});