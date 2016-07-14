var ObjectId =require('mongodb').ObjectId;

module.exports=(app,db)=>{

    app.get("/transactions",(req,res)=>{
        db.collection('transactions').find({}).toArray().then(function resolve(result){
            res.json(result)
        }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })

    app.get("/transactions/:id",(req,res)=>{
        db.collection('transactions').find({'_id':ObjectId(req.params.id)}).toArray().then(function resolve(result){
            res.json(result)
        }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })

    app.post("/transactions",(req,res)=>{
        db.collection('transactions').insertOne({title: req.body.title})
            .then(function resolve(result){
                res.json({"result": result.ops})
            }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })

    app.put("/transactions/:id",(req,res)=>{
        db.collection('transactions').findOneAndUpdate({'_id':ObjectId(req.params.id)},{title:req.body.title}).then(function resolve(result){
            res.json(result)
        }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })

    app.delete("/transactions/:id",(req,res)=>{
        db.collection('transactions').findOneAndDelete({'_id':ObjectId(req.params.id)}).then(function resolve(result){
            res.json(result)
        }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })
}
