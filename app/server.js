// Common to server and server_test- start
let restify = require('restify')
let config = require('config')
let port = config.get('port')

let MongoClient = require('mongodb').MongoClient
let mongoDb
let mongoConnectionURL = config.get('mongoConnectionURL')

let accountsCategoriesRouter = require('./accounts_categories/routing')
let accountsRouter = require('./accounts/routing')
let categoriesRouter = require('./categories/routing')
let currenciesRouter = require('./currencies/routing')
let distributionsRouter = require('./distributions/routing')
let toolsRouter = require('./tools/routing')
let transactionsRouter = require('./transactions/routing')

let server = restify.createServer()
server.use(restify.bodyParser())
server.use(restify.queryParser())
// Common to server and server_test- stop

// Common to server and server_test- start
MongoClient.connect(mongoConnectionURL)

  // Start the server a listening
  .then(result => {
    mongoDb = result
    console.log('mongo server started')
    return new Promise((resolve, reject) => {
      accountsCategoriesRouter.defineRoutes(server, mongoDb)
      accountsRouter.defineRoutes(server, mongoDb)
      categoriesRouter.defineRoutes(server, mongoDb)
      currenciesRouter.defineRoutes(server, mongoDb)
      distributionsRouter.defineRoutes(server, mongoDb)
      toolsRouter.defineRoutes(server, mongoDb)
      transactionsRouter.defineRoutes(server, mongoDb)

      server.listen(port, () => {
        console.log('Using configuration: %s', config.get('configName'))
        console.log('%s listening at %s', server.name, server.url)
        resolve(true)
      })
    })
  })
  // Common to server and server_test- stop

  .catch((e) => {
    console.log(e)
  })
