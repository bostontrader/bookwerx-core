module.exports = function(app, connection) {

    app.get("/categories", function (req, res) {

        var rows = connection.query("select id, symbol, title from categories", function (err, rows, fields) {
            if (err)
                res.json({"error":JSON.stringify(err)});
            else {
                var j = {"categories": []};
                for (let row of rows) {
                    var newRow = {
                        "id": row.id,
                        "symbol": row.symbol,
                        "title": row.title
                    };
                    j.categories.push(newRow);
                }
                res.json(j);
            }
        });
    });

    app.get("/categories/:id", function (req, res) {
        var id = parseInt(req.params.id);
        var query = "select id, symbol, title from categories where id=? limit 1";

        var rows = connection.query(query, [connection.escape(id)], function (err, rows, fields) {
            if (err) {
                res.json({"error":JSON.stringify(err)});
            } else {
                var newRow = {
                    "id": rows[0].id,
                    "symbol": rows[0].symbol,
                    "title": rows[0].title
                };
                res.json(newRow);
            }
        });
    });

    // By default, MySQL does not allow null values in fields so all of
    // the fields of this record are required.
    app.post("/categories", function(req, res) {

        var title = req.body.title;
        //if(title) title=connection.escape(title);

        var symbol = req.body.symbol;
        //if(symbol) symbol = connection.escape(symbol);

        var query = "INSERT INTO categories (title, symbol) VALUES (?, ?)";

        // This does the escaping for us
        var rows = connection.query(query, [title,symbol], function (err, rows, fields) {
            if (err)
                res.json({"error": JSON.stringify(err)});
            else
                res.json({"result": "ok"});
        });
    });

    // By default, MySQL does not allow null values in fields so all of
    // the fields of this record are required.
    app.put("/categories/:id", function(req, res) {
        var id = parseInt(req.params.id);
        escape=[];

        var sett = "";
        var symbol = req.body.symbol;
        var comma = "";
        if(symbol) {
            symbol=connection.escape(symbol);
            sett = "symbol=" + symbol + sett;
            escape.unshift(symbol);
            comma = ",";
        }

        var title = req.body.title;
        if(title) {
            title=connection.escape(title);
            sett = "title=" + title + comma + sett;
            escape.unshift(title);
        }

        // id is already essentially escaped by parseInt ???
        var query = "UPDATE categories SET " + sett + " where id="+id;

        // We have to do the escaping manually because otherwise we get
        // parse errors.
        //var rows = connection.query(query, [escape], function (err, rows,
        // fields) {
        var rows = connection.query(query, function (err, rows, fields) {
            if (err)
                res.json({"error": JSON.stringify(err)});
            else
                res.json({"result": "ok"});
        });
    });

}
