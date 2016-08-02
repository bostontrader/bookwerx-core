let ObjectId = require('mongodb').ObjectId

exports.defineRoutes = function (server, mongoDb) {
  server.get('/transactions', (req, res, next) => {
    mongoDb.collection('transactions').find({}).toArray().then(result => {
      res.json(result)
      next()
    }).catch(error => {
      console.log(error)
      res.json({error: error})
    })
  })

  server.post('/transactions', (req, res, next) => {
    //if (req.body.title === undefined) {
      //res.json({error: 'the new document must have a title'})
      //next()
    //} else {
      let n = req.body
      mongoDb.collection('transactions').insertOne(n).then(result => {
        // mongoDb.collection('transactions').insertOne(req.body).then(result => {
        n._id = result.insertedId.toString()
        res.json(n)
      }).catch(error => {
        console.log(error)
        res.json({error: error})
      })
    //}
  })

  server.put('/transactions/:id', (req, res, next) => {
    mongoDb.collection('transactions').findOneAndUpdate(
      {'_id': ObjectId(req.params.id)},
      {title: req.body.title},
      {returnOriginal: false}).then(function resolve (result) {
        res.json(result)
      }).catch(error => {
        console.log(error)
        res.json({'error': error})
      })
  })

  server.del('/transactions/:id', (req, res, next) => {
    mongoDb.collection('transactions').findOneAndDelete({'_id': ObjectId(req.params.id)}).then(function resolve (result) {
      res.json(result)
    }).catch(error => {
      console.log(error)
      res.json({'error': error})
    })
  })
}
