var ObjectId =require('mongodb').ObjectId;

module.exports=(app,db)=>{

    app.get("/distributions",(req,res)=>{
        db.collection('distributions').find({}).toArray().then(function resolve(result){
            res.json(result)
        }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })

    app.get("/distributions/:id",(req,res)=>{
        db.collection('distributions').find({'_id':ObjectId(req.params.id)}).toArray().then(function resolve(result){
            res.json(result)
        }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })

    app.post("/distributions",(req,res)=>{
        db.collection('distributions').insertOne({title: req.body.title})
            .then(function resolve(result){
                res.json({"result": result.ops})
            }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })

    app.put("/distributions/:id",(req,res)=>{
        db.collection('distributions').findOneAndUpdate({'_id':ObjectId(req.params.id)},{title:req.body.title}).then(function resolve(result){
            res.json(result)
        }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })

    app.delete("/distributions/:id",(req,res)=>{
        db.collection('distributions').findOneAndDelete({'_id':ObjectId(req.params.id)}).then(function resolve(result){
            res.json(result)
        }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })
}
