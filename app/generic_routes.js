exports.get = function (server, mongoDb, collectionSingular, collectionPlural) {
  server.get('/' + collectionPlural, (req, res, next) => {
    mongoDb.collection(collectionPlural).find({}).toArray().then(result => {
      res.json(result)
      next()
    }).catch(error => {
      res.json({error: error})
    })
  })
}
