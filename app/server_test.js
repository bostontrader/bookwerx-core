// Common to server and server_test- start
let restify = require('restify')
let config = require('config')
let port = config.get('port')

let MongoClient = require('mongodb').MongoClient
let mongoDb
let mongoConnectionURL = config.get('mongoConnectionURL')

let accountsRouter = require('./accounts/routing')
let categoriesRouter = require('./categories/routing')
let currenciesRouter = require('./currencies/routing')
let distributionsRouter = require('./distributions/routing')
let toolsRouter = require('./tools/routing')
let transactionsRouter = require('./transactions/routing')

let server = restify.createServer()
server.use(restify.bodyParser())
// Common to server and server_test- stop

// Unique to server_test- start
let client = restify.createJsonClient({
  url: 'http://127.0.0.1:' + port
})

let accountsTests = require('./accounts/tests')
accountsTests.setClient(client)

let categoriesTests = require('./categories/tests')
categoriesTests.setClient(client)

let currenciesTests = require('./currencies/tests')
currenciesTests.setClient(client)

let distributionsTests = require('./distributions/tests')
distributionsTests.setClient(client)

let toolsTests = require('./tools/tests')
toolsTests.setClient(client)

let transactionsTests = require('./transactions/tests')
transactionsTests.setClient(client)
// Unique to server_test- stop

// Common to server and server_test- start
MongoClient.connect(mongoConnectionURL)

  // Start the server a listening
  .then(result => {
    mongoDb = result
    console.log('mongo server started')
    return new Promise((resolve, reject) => {
      accountsRouter.defineRoutes(server, mongoDb)
      categoriesRouter.defineRoutes(server, mongoDb)
      currenciesRouter.defineRoutes(server, mongoDb)
      distributionsRouter.defineRoutes(server, mongoDb)
      toolsRouter.defineRoutes(server, mongoDb)
      transactionsRouter.defineRoutes(server, mongoDb)

      server.listen(port, () => {
        console.log('%s listening at %s', server.name, server.url)
        resolve(true)
      })
    })
  })
  // Common to server and server_test- stop

  // Unique to server_test- start
  // .then(toolsTests.tests)
  .then(result => {
    mongoDb.dropDatabase()
    // mongoDb.collection('accounts').createIndex({ title: 1 }, { unique: true } )
  })
  .then(accountsTests.tests)
  .then(categoriesTests.tests)
  .then(currenciesTests.tests)
  // .then(distributionsTests.tests)
  .then(transactionsTests.tests)
  .then(() => {
    return new Promise((resolve, reject) => {
      client.close()
      server.close(() => {
        console.log('%s close', server.name)
        resolve(true)
      })
    })
  })

  .then(result => {
    console.log('tests passed')
    process.exit()
  })

  .catch((e) => {
    console.log(e)
  })

