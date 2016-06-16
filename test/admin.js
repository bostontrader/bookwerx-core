var app = require("../app");

var supertest = require("supertest");

describe("brainwipe", function() {

    it("POSTs the brainwipe command", function(done) {
        supertest(app)
            .post("/brainwipe")
            .set("Accept", "application/json")
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect(JSONResponseOK)
            .end(done);
    });

    it("Verifies the erasure of the db", function(done) {
        supertest(app)
            .get("/categories")
            .set("Accept", "application/json")
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect(hasZeroRecords);

        supertest(app)
            .get("/currencies")
            .set("Accept", "application/json")
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect(hasZeroRecords)
            .end(done);
    });

    function hasZeroRecords(res) {
        cnt=JSON.parse(res.text).currencies.length;
        if (cnt != 0) throw new Error("There should not be any remaining records.");
    }

    function JSONResponseOK(res) {
        if(res.text != '{"result":"ok"}')
            throw new Error("JSON response = " + res.text);
    }
});
