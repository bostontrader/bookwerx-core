var ObjectId =require('mongodb').ObjectId;

module.exports=(app,db)=>{

    app.get("/currencies",(req,res)=>{
        db.collection('currencies').find({}).toArray().then(function resolve(result){
            res.json(result)
        }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })

    app.get("/currencies/:id",(req,res)=>{
        db.collection('currencies').find({'_id':ObjectId(req.params.id)}).toArray().then(function resolve(result){
            res.json(result)
        }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })

    app.post("/currencies",(req,res)=>{
        db.collection('currencies').insertOne({title: req.body.title})
            .then(function resolve(result){
                res.json({"result": result.ops})
            }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })

    app.put("/currencies/:id",(req,res)=>{
        db.collection('currencies').findOneAndUpdate({'_id':ObjectId(req.params.id)},{title:req.body.title}).then(function resolve(result){
            res.json(result)
        }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })

    app.delete("/currencies/:id",(req,res)=>{
        db.collection('currencies').findOneAndDelete({'_id':ObjectId(req.params.id)}).then(function resolve(result){
            res.json(result)
        }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })
}
