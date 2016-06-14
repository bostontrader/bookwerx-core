var app = require("../app");

var supertest = require("supertest");

describe("brainwipe", function() {

    it("POST the brainwipe command", function(done) {
        supertest(app)
            .post("/brainwipe")
            //.set("Accept", "text/plain")
            //.expect("Content-Type", /text\/plain/)
            .expect(200)
            .end(done);
    });

    it("erased the db", function(done) {
        supertest(app)
            .get("/currencies")
            //.set("Accept", "text/plain")
            .expect("Content-Type", /application\/json/)
            .expect(200)
            .expect(hasZeroRecords)
            .end(done);
    });

    function hasZeroRecords(res) {
        cnt=JSON.parse(res.text).currencies.length;
        if (cnt != 0) throw new Error("There should not be any currency records.");
    }
});
