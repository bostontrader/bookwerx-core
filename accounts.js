module.exports = function(app, connection) {

    app.get("/accounts", function (req, res) {

        var query = "select id, symbol, title from accounts";

        var rows = connection.query(query, function (err, rows, fields) {
            //if (err)  //throw err;
            //else {
            var j={"accounts":[]};
            for (let row of rows) {
                var newRow={
                    "id":row.id,
                    "symbol":row.symbol,
                    "title":row.title
                };
                j.accounts.push(newRow);
            }
            res.json(j);
        });
    });

    app.get("/accounts/:id", function (req, res) {
        var id = parseInt(req.params.id);
        var query = "select id, symbol, title from accounts where id=? limit 1";

        var rows = connection.query(query, [connection.escape(id)], function (err, rows, fields) {
            if (err) {
                res.json({"err":JSON.stringify(err)});
            } else {
                //var j={"accounts":[]};
                //for (let row of rows) {
                var newRow = {
                    "id": rows[0].id,
                    "symbol": rows[0].symbol,
                    "title": rows[0].title
                };
                //j.accounts.push(newRow);
                //}
                res.json(newRow);
            }
        });
    });

    app.post("/accounts", function(req, res) {

        //var id = parseInt(req.params.id);
        var query = "select id, symbol, title from accounts where id=? limit 1";

        var rows = connection.query(query, [connection.escape(id)], function (err, rows, fields) {
            if (err) {
                res.json({"err":JSON.stringify(err)});
            } else {
                //var j={"accounts":[]};
                //for (let row of rows) {
                var newRow = {
                    "id": rows[0].id,
                    "symbol": rows[0].symbol,
                    "title": rows[0].title
                };
                //j.accounts.push(newRow);
                //}
                res.json(newRow);
            }
        });

        //var query = "truncate accounts";

        // Only care about the err, if any
        //dbConnection.query(query, function (err, rows, fields) {
            //if (err)
                //res.json({"err":JSON.stringify(err)});
            //else
        // req.body.symbol
                res.json({"result":"ok"});
        //});
    });

}
