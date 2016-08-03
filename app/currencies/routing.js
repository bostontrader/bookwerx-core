var ObjectId = require('mongodb').ObjectId

exports.defineRoutes = function (server, mongoDb) {
  server.get('/currencies', (req, res, next) => {
    mongoDb.collection('currencies').find({}).toArray().then(result => {
      res.json(result)
      next()
    }).catch(error => {
      console.log(error)
      res.json({error: error})
    })
  })

  server.post('/currencies', (req, res, next) => {
    let n = req.body
    if (req.body.title === undefined) {
      res.json({error: 'the new document must have a title'})
      next()
    } else {
      let n = req.body
      mongoDb.collection('currencies').insertOne(n).then(result => {
        // mongoDb.collection('currencies').insertOne(req.body).then(result => {
        n._id = result.insertedId.toString()
        res.json(n)
      }).catch(error => {
        console.log(error)
        res.json({error: error})
      })
    }
  })

  server.put('/currencies/:id', (req, res, next) => {
    mongoDb.collection('currencies').findOneAndUpdate(
      {'_id': ObjectId(req.params.id)},
      {title: req.body.title},
      {returnOriginal: false}).then(function resolve (result) {
        res.json(result)
      }).catch(error => {
        console.log(error)
        res.json({'error': error})
      })
  })

  server.del('/currencies/:id', (req, res, next) => {
    mongoDb.collection('currencies').findOneAndDelete({'_id': ObjectId(req.params.id)}).then(function resolve (result) {
      res.json(result)
    }).catch(error => {
      console.log(error)
      res.json({'error': error})
    })
  })
}
