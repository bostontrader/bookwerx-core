var app = require("../app");

var supertest = require("supertest");

var currencies;

describe("tests basic CRUD for Currencies", function() {

    describe("tests delete all currencies",function() {
        it("gets the collection of all currencies", function(done) {
            supertest(app)
                .get("/currencies")
                .set("Accept", "application/json")
                .expect(200)
                .expect("Content-Type", /application\/json/)
                .expect(hasZeroOrMoreRecords)
                .end(done);
        });

        it("deletes all currencies, if any", function(done) {

            for (let currency of currencies) {
                // delete currencyrequest(app)
                //.get('/')
            }

            done();

        });

        it("ensures zero currencies remaining", function(done) {
            supertest(app)
                .get("/currencies")
                .set("Accept", "application/json")
                .expect(200)
                .expect("Content-Type", /application\/json/)
                .expect(hasZeroRecords)
                .end(done);
        });
    });

    describe("try to POST a new record",function() {

        // This should just fail.  Don't worry about the exact error message.
        it("POSTs a record with missing title and fails", function(done) {
            supertest(app)
                .post("/currencies") // by default, application/x-www-form-urlencoded
                .send("symbol=sym")
                .set("Accept", "application/json")
                .expect(200)
                .expect("Content-Type", /application\/json/)
                .expect(JSONError)
                .end(done);
        });

        // This should just fail.  Don't worry about the exact error message.
        it("POSTs a record with missing symbol and fails", function(done) {
            supertest(app)
                .post("/currencies") // by default, application/x-www-form-urlencoded
                .send("title=example title")
                .set("Accept", "application/json")
                .expect(200)
                .expect("Content-Type", /application\/json/)
                .expect(JSONError)
                .end(done);
        });

        it("POSTs a good record and succeeds", function(done) {
            supertest(app)
                .post("/currencies") // by default, application/x-www-form-urlencoded
                .send("symbol=sym")
                .send("title=example title")
                .set("Accept", "application/json")
                .expect(200)
                .expect("Content-Type", /application\/json/)
                .expect(JSONResponseOK)
                .end(done);
        });

        // This should just fail.  Don't worry about the exact error message.
        it("POSTs a record with duplicate symbol and fails", function(done) {
            supertest(app)
                .post("/currencies") // by default, application/x-www-form-urlencoded
                .send("symbol=sym")
                .send("title=example title")
                .set("Accept", "application/json")
                .expect(200)
                .expect("Content-Type", /application\/json/)
                .expect(JSONError)
                .end(done);
        });

    });

    describe("try to PUT to an existing record",function() {

        it("PUTs a good record and succeeds", function(done) {
            supertest(app)
                .put("/currencies/1") // by default,
                // application/x-www-form-urlencoded
                .send("symbol=sym")
                .send("title=example title")
                .set("Accept", "application/json")
                .expect(200)
                .expect("Content-Type", /application\/json/)
                .expect(JSONResponseOK)
                .end(done);
        });

        // PUT to a non-existant record simply results in zero rows updated.
        // No error.

    });

});

function hasZeroRecords(res) {
    cnt=JSON.parse(res.text).currencies.length;
    if (cnt != 0) throw new Error("There should not be any remaining records.");
}

function hasZeroOrMoreRecords(res) {
    // If this line executes successfully then we know
    // that there's no error and that we have an array
    // of 0 or more currency records.
    currencies = JSON.parse(res.text).currencies;
}

function JSONError(res) {
    jsonResult=JSON.parse(res.text);
    if(!jsonResult.error)
        throw new Error("I was expecting an error.  Instead: JSON response  = " + res.text);
}

function JSONResponseOK(res) {
    if(res.text != '{"result":"ok"}')
        throw new Error("JSON response = " + res.text);
}