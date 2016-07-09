'use strict'

let assert = require('chai').assert
let superagent = require('superagent');
require('superagent-as-promised')(superagent);

describe("Test basic CRUD for Accounts", function() {

    it("Test basic CRUD for Accounts", done=> {

        let firstNewRecord = {'title':'first new title'}
        let updatedRecord = {'title':'updated title'}
        let firstNewId
        let urlBase = "localhost:3003"

        // 1. Brainwipe.  Tested elsewhere
        superagent
            .post(urlBase+'/brainwipe')
            .then(response=>{
                console.log("1. Brainwipe response: "+response.text)

                // 2. Post a new record.
                return superagent
                    .post(urlBase+'/accounts')
                    .send('title='+firstNewRecord.title)

            }).then(response=>{
                console.log("2. Post new record response: "+response.text)
                firstNewId=JSON.parse(response.text).result[0]._id

                // 3. Read the record back.
                return superagent
                    .get(urlBase+'/accounts/'+firstNewId)

            }).then(response=>{
                console.log("3. Read the record back response: "+response.text)
                // Do the fields read match the fields written?
                assert.equal(JSON.parse(response.text)[0].title,firstNewRecord.title)

                // 4. Update the record.
                return superagent
                    .put(urlBase+'/accounts/'+firstNewId)
                    .send('title='+JSON.parse(response.text))

            }).then(response=>{
                console.log("4. Update the record response: "+response.text)

                // 5. Read the record back.
                return superagent
                    .get(urlBase+'/accounts/'+firstNewId)

            }).then(response=>{
                console.log("5. Read the record back response: " + response.text)
                // Do the fields read match the fields written?
                assert.equal(JSON.parse(response.text)[0].title, JSON.parse(response.text))

                // 6. Now delete the record
                return superagent
                    .del(urlBase+'/accounts/'+firstNewId)

            }).then(response=>{
                console.log("6. Delete the record response: " + response.text)
                done()
            }).catch(error=>{
                console.dir(error);
                done()
            })
    });
});
