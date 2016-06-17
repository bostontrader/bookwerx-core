var app = require("../app");

var supertest = require("supertest");

var transactions;

describe("tests basic CRUD for Transactions", function() {

    describe("GET Transactions",function(){
        describe("GET an existing Transaction",function(){});
    });

    describe("try to POST a new transaction record",function() {

        // This should just fail.  Don't worry about the exact error message.
        it("POSTs a record with missing tran_datetime and fails", function(done) {
            supertest(app)
                .post("/transactions") // by default, application/x-www-form-urlencoded
                .send("note=this is a new note")
                .set("Accept", "application/json")
                .expect(200)
                .expect("Content-Type", /application\/json/)
                .expect(JSONError)
                .end(done);
        });

        // This should just fail.  Don't worry about the exact error message.
        it("POSTs a record with missing note and fails", function(done) {
            supertest(app)
                .post("/transactions") // by default, application/x-www-form-urlencoded
                .send("tran_datetime=2016-05-15")
                .set("Accept", "application/json")
                .expect(200)
                .expect("Content-Type", /application\/json/)
                .expect(JSONError)
                .end(done);
        });

        it("POSTs a good record and succeeds", function(done) {
            supertest(app)
                .post("/transactions") // by default, application/x-www-form-urlencoded
                .send("tran_datetime=2016-05-15")
                .send("note=this is a new note")
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
                .put("/currencies/1") // by default, application/x-www-form-urlencoded
                .send("symbol=sym")
                .send("title=title")
                .set("Accept", "application/json")
                .expect(200)
                .expect("Content-Type", /application\/json/)
                .expect(JSONResponseOK)
                .end(done);
        });

        // PUT to a non-existent record simply results in zero rows updated.
        // No error.
        it("PUTs a good record and succeeds", function(done) {
            supertest(app)
                .put("/transactions/666") // by default,
                // application/x-www-form-urlencoded
                .send("tran_datetime=2016-05-20")
                .send("note=another note")
                .set("Accept", "application/json")
                .expect(200)
                .expect("Content-Type", /application\/json/)
                .expect(JSONResponseOK)
                .end(done);
        });

    });

});

function hasZeroRecords(res) {
    cnt=JSON.parse(res.text).transactions.length;
    if (cnt != 0) throw new Error("There should not be any remaining records.");
}

function hasZeroOrMoreRecords(res) {
    // If this line executes successfully then we know
    // that there's no error and that we have an array
    // of 0 or more currency records.
    transactions = JSON.parse(res.text).transactions;
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