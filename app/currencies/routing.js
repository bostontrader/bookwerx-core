var ObjectId = require('mongodb').ObjectId

exports.defineRoutes = function (server, mongoDb) {
  server.get('/currencies', (req, res, next) => {
    mongoDb.collection('currencies').find({}).toArray().then(result => {
      res.json(result)
      next()
    }).catch(error => {
      res.json({error: error})
    })
  })

  // I don't think GET /currencies/:id is necessary.

  server.post('/currencies', (req, res, next) => {
    // insertOne only returns the new _id.  We want to return complete
    // new document, which is what we originally requested to store
    // with the new _id added to this.
    let retVal = req.body
    mongoDb.collection('currencies').insertOne(req.body).then(result => {
      retVal._id = result.insertedId.toString()
      res.json(retVal)
    }).catch(error => {
      res.json({error: error})
    })
  })

  server.put('/currencies/:id', (req, res, next) => {
    mongoDb.collection('currencies').findOneAndUpdate(
      {'_id': ObjectId(req.params.id)},
      {title: req.body.title},
      {returnOriginal: false}).then(function resolve (result) {
        res.json(result)
      }).catch(error => {
        res.json({'error': error})
      })
  })

  server.del('/currencies/:id', (req, res, next) => {
    mongoDb.collection('currencies').findOneAndDelete({'_id': ObjectId(req.params.id)}).then(function resolve (result) {
      res.json(result)
    }).catch(error => {
      res.json({'error': error})
    })
  })
}
