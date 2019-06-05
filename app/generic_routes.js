let ObjectId = require('mongodb').ObjectId

exports.get = function (server, mongoDb, collectionPlural, sort = {}) {
  server.get('/' + collectionPlural, (req, res, next) => {
    if (req.query.sort) sort = JSON.parse(req.query.sort)
    mongoDb.collection(collectionPlural).find().sort(sort).toArray().then(result => {
      res.json(result)
      next()
    }).catch(error => {
      res.json({error: error})
    })
  })
}

exports.getOne = function (server, mongoDb, collectionSingular, collectionPlural) {
  server.get('/' + collectionPlural + '/:id', (req, res, next) => {
    mongoDb.collection(collectionPlural).findOne({'_id': ObjectId(req.params.id)}).then(result => {
      if (result === null) result = {error: collectionSingular + ' ' + req.params.id + ' does not exist'}
      res.json(result)
      next()
    }).catch(error => {
      res.json({error: error})
    })
  })
}

exports.post = function (server, mongoDb, collectionPlural) {
  server.post('/' + collectionPlural, (req, res, next) => {
    // insertOne only returns the new _id.  We want to return complete
    // new document, which is what we originally requested to store
    // with the new _id added to this.
    let retVal = req.body
    mongoDb.collection(collectionPlural).insertOne(req.body).then(result => {
      retVal._id = result.insertedId.toString()
      res.json(retVal)
    }).catch(error => {
      res.json({error: error})
    })
  })
}

exports.put = function (server, mongoDb, collectionSingular, collectionPlural) {
  server.put('/' + collectionPlural + '/:id', (req, res, next) => {
    mongoDb.collection(collectionPlural).findOneAndUpdate(
        {'_id': ObjectId(req.params.id)},
        req.body,
        {returnOriginal: false}).then(function resolve (result) {
          if (result.value === null) result.value = {error: collectionSingular + ' ' + req.params.id + ' does not exist'}
          res.json(result.value)
        }).catch(error => {
          res.json({'error': error})
        })
  })
}

exports.delete = function (server, mongoDb, collectionSingular, collectionPlural) {
  server.del('/' + collectionPlural + '/:id', (req, res, next) => {
    mongoDb.collection(collectionPlural).findOneAndDelete({'_id': ObjectId(req.params.id)}).then(function resolve (result) {
      if (result.value === null) result.value = {error: collectionSingular + ' ' + req.params.id + ' does not exist'}
      res.json(result.value)
    }).catch(error => {
      res.json({'error': error})
    })
  })
}
