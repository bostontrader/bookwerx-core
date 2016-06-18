var app = require("../app");

var supertest = require("supertest");

// In order to determine the quantity of records in a response, in an
// assertion function, we need to use a table name.  I don't know how to
// pass this name directly to the assertion function, so make this variable
// mutually visible to the caller and assertion function.
var tableName;

describe.only("brainwipe", function() {

    it("POST brainwipe", function(done) {
        supertest(app)
            .post("/brainwipe")
            .set("Accept", "application/json")
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect(JSONResponseOK)
            .end(done);
    });

    it("Verifies the erasure of the db", function(done) {

        function examineOneTable(st, tn) {

            tableName = tn;

            return st
                .get("/" + tableName)
                .set("Accept", "application/json")
                .expect(200)
                .expect("Content-Type", /application\/json/)
                .expect(hasZeroRecords);
        }

        examineOneTable(supertest(app), "accountss");
        // accounts_categories is not publicly visible
        examineOneTable(supertest(app), "categories");
        examineOneTable(supertest(app), "currencies");
        examineOneTable(supertest(app), "distributions");
        examineOneTable(supertest(app), "transactions").end(done);
    });


    function hasZeroRecords(res) {
        var j = JSON.parse(res.text);
        var cnt = j[tableName].length;
        if (cnt != 0) throw new Error("There should not be any remaining " + tableName + " records.");
    }

    function JSONResponseOK(res) {
        if(res.text != '{"result":"ok"}')
            throw new Error("JSON response = " + res.text);
    }
});
