var ObjectId =require('mongodb').ObjectId;

module.exports=(app,db)=>{

    app.get("/accounts",(req,res)=>{
        db.collection('accounts').find({}).toArray().then(function resolve(result){
            res.json(result)
        }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })

    app.get("/accounts/:id",(req,res)=>{
        db.collection('accounts').find({'_id':ObjectId(req.params.id)}).toArray().then(function resolve(result){
            res.json(result)
        }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })

    app.post("/accounts",(req,res)=>{
        db.collection('accounts').insertOne({title: req.body.title})
            .then(function resolve(result){
                res.json({"result": result.ops})
            }).catch(error=>{
                console.log(error)
                res.json({"error": error})
            })
    })

    app.put("/accounts/:id",(req,res)=>{
        db.collection('accounts').findOneAndUpdate({'_id':ObjectId(req.params.id)},{title:req.body.title}).then(function resolve(result){
            res.json(result)
        }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })

    app.delete("/accounts/:id",(req,res)=>{
        db.collection('accounts').findOneAndDelete({'_id':ObjectId(req.params.id)}).then(function resolve(result){
            res.json(result)
        }).catch(error=>{
            console.log(error)
            res.json({"error": error})
        })
    })
}
