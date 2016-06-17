module.exports = function(app, connection) {

    app.get("/transactions", function (req, res) {

        var query = "select id, tran_datetime, note from transactions";

        var rows = connection.query(query, function (err, rows, fields) {
            if (err)
                res.json({"error":JSON.stringify(err)});
            else {
                var j = {"transactions": []};
                for (let row of rows) {
                    var newRow = {
                        "id": row.id,
                        "tran_datetime": row.symbol,
                        "note": row.title
                    };
                    j.transactions.push(newRow);
                }
                res.json(j);
            }
        });
    });

    /*app.get("/transactions/:id", function (req, res) {
        var id = parseInt(req.params.id);
        var query = "select id, symbol, title from transactions where id=? limit 1";

        var rows = connection.query(query, [connection.escape(id)], function (err, rows, fields) {
            if (err) {
                res.json({"err":JSON.stringify(err)});
            } else {
                //var j={"transactions":[]};
                //for (let row of rows) {
                var newRow = {
                    "id": rows[0].id,
                    "symbol": rows[0].symbol,
                    "title": rows[0].title
                };
                //j.transactions.push(newRow);
                //}
                res.json(newRow);
            }
        });
    });*/

    // By default, MySQL does not allow null values in fields so all of
    // the fields of this record are required.
    app.post("/transactions", function(req, res) {

        var tran_datetime = req.body.tran_datetime;
        var note = req.body.note;

        var query = "INSERT INTO transactions (tran_datetime, note) VALUES" +
            " (?, ?)";

        // This does the escaping for us
        var rows = connection.query(query, [tran_datetime, note], function (err, rows, fields) {
            if (err)
                res.json({"error": JSON.stringify(err)});
            else
                res.json({"result": "ok"});
        });
    });

    // By default, MySQL does not allow null values in fields so all of
    // the fields of this record are required.
    app.put("/currencies/:id", function(req, res) {
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
        var query = "UPDATE currencies SET " + sett + " where id="+id;

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
