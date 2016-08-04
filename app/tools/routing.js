exports.defineRoutes = function (server, mongoDb) {
  server.put('/brainwipe', (req, res, next) => {
    mongoDb.dropDatabase().then(function resolve (result) {
      res.json(result)
    }).catch(error => {
      res.json({'error': error})
    })
  })
}
