var app = require("../app");

var supertest = require("supertest");

var accounts;

describe("tests basic CRUD for Accounts", function() {

    describe("try to POST a new record",function() {

        // This should just fail.  Don't worry about the exact error message.
        it("POSTs a record with missing title and fails", function(done) {
            supertest(app)
                .post("/accounts") // by default, application/x-www-form-urlencoded
                //.send("symbol=sym")
                .set("Accept", "application/json")
                .expect(200)
                .expect("Content-Type", /application\/json/)
                .expect(JSONError)
                .end(done);
        });

        it("POSTs a good record and succeeds", function(done) {
            supertest(app)
                .post("/accounts") // by default, application/x-www-form-urlencoded
                .send("title=example title")
                .set("Accept", "application/json")
                .expect(200)
                .expect("Content-Type", /application\/json/)
                .expect(JSONResponseOK)
                .end(done);
        });

    });

    describe("try to PUT to an existing record",function() {

        it("PUTs a good record and succeeds", function(done) {
            supertest(app)
                .put("/accounts/1") // by default, application/x-www-form-urlencoded
                //.send("symbol=sym")
                .send("title=title")
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
    cnt=JSON.parse(res.text).accounts.length;
    if (cnt != 0) throw new Error("There should not be any remaining records.");
}

function hasZeroOrMoreRecords(res) {
    // If this line executes successfully then we know
    // that there's no error and that we have an array
    // of 0 or more currency records.
    accounts = JSON.parse(res.text).accounts;
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