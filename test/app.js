'use strict'

let assert = require('chai').assert
let superagent = require("superagent")

describe("Brainwipe", function() {

    it("Brainwipe the DB",function(done){
        superagent
            .post('localhost:3003/brainwipe')
            .end(function(err, res){
                if (err || !res.ok) {
                    console.log(err)
                    assert.fail()
                    done()
                } else {
                    assert.equal(res.body.result,"ok")
                    done()
                }
            })
    })
})
