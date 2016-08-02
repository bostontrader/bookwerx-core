let restify = require('restify')
let MongoClient = require('mongodb').MongoClient
let mongoDb
let accountsRouter = require('./accounts/routing')
let currenciesRouter = require('./currencies/routing')
let distributionsRouter = require('./distributions/routing')
let transactionsRouter = require('./transactions/routing')

let server = restify.createServer()
server.use(restify.bodyParser())

MongoClient.connect('mongodb://localhost:27017/bookwerx-core')

  // Start the server a listening
  .then(result => {
    mongoDb = result
    return new Promise((resolve, reject) => {
      accountsRouter.defineRoutes(server, mongoDb)
      mongoDb.collection('accounts').createIndex( { title: 1 }, { unique: true } )
      distributionsRouter.defineRoutes(server, mongoDb)
      currenciesRouter.defineRoutes(server, mongoDb)
      transactionsRouter.defineRoutes(server, mongoDb)

      server.listen(3003, () => {
        console.log('%s listening at %s', server.name, server.url)
        resolve(true)
      })
    })
  })

  .catch((e) => {
    console.log(e)
  })
