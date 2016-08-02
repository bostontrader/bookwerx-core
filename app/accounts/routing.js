let ObjectId = require('mongodb').ObjectId

exports.defineRoutes = function (server, mongoDb) {
  server.get('/accounts', (req, res, next) => {
    mongoDb.collection('accounts').find({}).toArray().then(result => {
      res.json(result)
      next()
    }).catch(error => {
      console.log(error)
      res.json({error: error})
    })
  })

  server.get('/accounts/:id', (req, res, next) => {
    mongoDb.collection('accounts').find({'_id': ObjectId(req.params.id)}).toArray().then(result => {
      if (result.length === 0) result={error:'account '+req.params.id+' does not exist'}
      res.json(result)
      next()
    }).catch(error => {
      console.log(error)
      res.json({error: error})
    })
  })

  server.post('/accounts', (req, res, next) => {
    if (req.body.title === undefined) {
      res.json({error: 'the new document must have a title'})
      next()
    } else if (req.body.title === "") {
      res.json({error: 'the new document must have a title length > 0'})
    } else {
      let n = req.body
      mongoDb.collection('accounts').insertOne(n).then(result => {
        // mongoDb.collection('accounts').insertOne(req.body).then(result => {
        n._id = result.insertedId.toString()
        res.json(n)
      }).catch(error => {
        //console.log(error)
        res.json({error: error})
      })
    }
  })

  server.put('/accounts/:id', (req, res, next) => {
    // An update can concern fields other than title, so a missing title
    // is not an error as might be expected.
    // if (req.body.title === undefined) {
      // res.json({error: 'the new document must have a title'})
      // next()
    // } else
    if (req.body.title === "") {
      res.json({error: 'the new document must have a title length > 0'})
    } else {
      mongoDb.collection('accounts').findOneAndUpdate(
          {'_id': ObjectId(req.params.id)},
          {title: req.body.title},
          {returnOriginal: false}).then(function resolve (result) {
        res.json(result)
      }).catch(error => {
        //console.log(error)
        res.json({'error': error})
      })
    }
  })

  server.del('/accounts/:id', (req, res, next) => {
    mongoDb.collection('accounts').findOneAndDelete({'_id': ObjectId(req.params.id)}).then(function resolve (result) {
      res.json(result)
    }).catch(error => {
      console.log(error)
      res.json({'error': error})
    })
  })
}
