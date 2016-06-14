module.exports = function(app, connection) {

    app.get("/currencies", function (req, res) {

        var query = "select id, symbol, title from currencies";

        var rows = connection.query(query, function (err, rows, fields) {
            //if (err)  //throw err;
            //else {
            var j={"currencies":[]};
            for (let row of rows) {
                var newRow={
                    "id":row.id,
                    "symbol":row.symbol,
                    "title":row.title
                };
                j.currencies.push(newRow);
            }
            res.json(j);
        });
    });

    app.get("/currencies/:id", function (req, res) {
        var id = parseInt(req.params.id);
        var query = "select id, symbol, title from currencies where id=? limit 1";

        var rows = connection.query(query, [connection.escape(id)], function (err, rows, fields) {
            if (err) {

                i = 0; //throw err;
            } else {
                //var j={"currencies":[]};
                //for (let row of rows) {
                var newRow = {
                    "id": rows[0].id,
                    "symbol": rows[0].symbol,
                    "title": rows[0].title
                };
                //j.currencies.push(newRow);
                //}
                res.json(newRow);
            }
        });
    });
}
