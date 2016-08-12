let ObjectId = require('mongodb').ObjectId

exports.defineRoutes = function (server, mongoDb) {
  server.get('/categories', (req, res, next) => {
    mongoDb.collection('categories').find({}).toArray().then(result => {
      res.json(result)
      next()
    }).catch(error => {
      res.json({error: error})
    })
  })

  server.get('/categories/:id', (req, res, next) => {
    mongoDb.collection('categories').find({'_id': ObjectId(req.params.id)}).toArray().then(result => {
      if (result.length === 0) result = {error: 'category ' + req.params.id + ' does not exist'}
      res.json(result)
      next()
    }).catch(error => {
      res.json({error: error})
    })
  })

  server.post('/categories', (req, res, next) => {
    // insertOne only returns the new _id.  We want to return complete
    // new document, which is what we originally requested to store
    // with the new _id added to this.
    let retVal = req.body
    mongoDb.collection('categories').insertOne(req.body).then(result => {
      retVal._id = result.insertedId.toString()
      res.json(retVal)
    }).catch(error => {
      res.json({error: error})
    })
  })

  server.put('/categories/:id', (req, res, next) => {
    mongoDb.collection('categories').findOneAndUpdate(
        {'_id': ObjectId(req.params.id)},
        {symbol: req.body.symbol, title: req.body.title},
        {returnOriginal: false}).then(function resolve (result) {
          res.json(result)
        }).catch(error => {
          res.json({'error': error})
        })
  })

  server.del('/categories/:id', (req, res, next) => {
    mongoDb.collection('categories').findOneAndDelete({'_id': ObjectId(req.params.id)}).then(function resolve (result) {
      res.json(result)
    }).catch(error => {
      res.json({'error': error})
    })
  })
}
