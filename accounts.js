var ObjectId = require('mongodb').ObjectId;

module.exports = function(app, db) {

    app.get("/accounts", function (req, res) {
        db.collection('accounts').find({}).toArray().then(function resolve(result){
            res.json(result)
        }).catch(function reject(error){
            console.log(error)
            res.json({"error": error})
        })
    })

    app.get("/accounts/:id", function (req, res) {
        db.collection('accounts').find({'_id':ObjectId(req.params.id)}).toArray().then(function resolve(result){
            res.json(result)
        }).catch(function reject(error){
            console.log(error)
            res.json({"error": error})
        })
    })

    app.post("/accounts", function(req, res) {
        db.collection('accounts').insertOne({title: req.body.title})
            .then(function resolve(result){
                res.json({"result": "ok"})
            }).catch(function reject(error){
                console.log(error)
                res.json({"error": error})
            })
    })

    app.put("/accounts/:id", function(req, res) {
        db.collection('accounts').findOneAndUpdate({'_id':ObjectId(req.params.id)},{title:req.body.title}).then(function resolve(result){
            res.json(result)
        }).catch(function reject(error){
            console.log(error)
            res.json({"error": error})
        })
    })

    app.delete("/accounts/:id", function(req, res) {
        db.collection('accounts').findOneAndDelete({'_id':ObjectId(req.params.id)}).then(function resolve(result){
            res.json(result)
        }).catch(function reject(error){
            console.log(error)
            res.json({"error": error})
        })
    })
}
