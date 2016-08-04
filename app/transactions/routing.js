let ObjectId = require('mongodb').ObjectId

exports.defineRoutes = function (server, mongoDb) {
  server.get('/transactions', (req, res, next) => {
    mongoDb.collection('transactions').find({}).toArray().then(result => {
      res.json(result)
      next()
    }).catch(error => {
      res.json({error: error})
    })
  })

  server.get('/transactions/:id', (req, res, next) => {
    mongoDb.collection('transactions').find({'_id': ObjectId(req.params.id)}).toArray().then(result => {
      if (result.length === 0) result = {error: 'transaction ' + req.params.id + ' does not exist'}
      res.json(result)
      next()
    }).catch(error => {
      res.json({error: error})
    })
  })

  server.post('/transactions', (req, res, next) => {
    // insertOne only returns the new _id.  We want to return complete
    // new document, which is what we originally requested to store
    // with the new _id added to this.
    let retVal = req.body
    mongoDb.collection('transactions').insertOne(req.body).then(result => {
      retVal._id = result.insertedId.toString()
      res.json(retVal)
    }).catch(error => {
      res.json({error: error})
    })
  })

  server.put('/transactions/:id', (req, res, next) => {
    mongoDb.collection('transactions').findOneAndUpdate(
      {'_id': ObjectId(req.params.id)},
      {title: req.body.title},
      {returnOriginal: false}).then(function resolve (result) {
        res.json(result)
      }).catch(error => {
        res.json({'error': error})
      })
  })

  server.del('/transactions/:id', (req, res, next) => {
    mongoDb.collection('transactions').findOneAndDelete({'_id': ObjectId(req.params.id)}).then(function resolve (result) {
      res.json(result)
    }).catch(error => {
      res.json({'error': error})
    })
  })
}
