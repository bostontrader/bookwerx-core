module.exports = function(app, connection) {

    app.get("/accounts", function (req, res) {

        var rows = connection.query("select id, title from accounts", function (err, rows, fields) {
            if (err)
                res.json({"error":JSON.stringify(err)});
            else {
                var j = {"accounts": []};
                for (let row of rows) {
                    var newRow = {
                        "id": row.id,
                        "title": row.title
                    };
                    j.accounts.push(newRow);
                }
                res.json(j);
            }
        });
    });

    app.get("/accounts/:id", function (req, res) {
        var id = parseInt(req.params.id);
        var query = "select id, title from accounts where id=? limit 1";

        var rows = connection.query(query, [connection.escape(id)], function (err, rows, fields) {
            if (err) {
                res.json({"error":JSON.stringify(err)});
            } else {
                var newRow = {
                    "id": rows[0].id,
                    "title": rows[0].title
                };
                res.json(newRow);
            }
        });
    });

    // By default, MySQL does not allow null values in fields so all of
    // the fields of this record are required.
    app.post("/accounts", function(req, res) {

        var title = req.body.title;
        //if(title) title=connection.escape(title);

        var query = "INSERT INTO accounts (title) VALUES (?, ?)";

        // This does the escaping for us
        var rows = connection.query(query, [title], function (err, rows, fields) {
            if (err)
                res.json({"error": JSON.stringify(err)});
            else
                res.json({"result": "ok"});
        });
    });

    // By default, MySQL does not allow null values in fields so all of
    // the fields of this record are required.
    app.put("/accounts/:id", function(req, res) {
        var id = parseInt(req.params.id);
        escape=[];

        var sett = "";
        //var symbol = req.body.symbol;
        var comma = "";
        //if(symbol) {
            //symbol=connection.escape(symbol);
            //sett = "symbol=" + symbol + sett;
            //escape.unshift(symbol);
            //comma = ",";
        //}

        var title = req.body.title;
        if(title) {
            title=connection.escape(title);
            sett = "title=" + title + comma + sett;
            escape.unshift(title);
        }

        // id is already essentially escaped by parseInt ???
        var query = "UPDATE accounts SET " + sett + " where id="+id;

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
