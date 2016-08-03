// Common to server and server_test- start
let restify = require('restify')
let MongoClient = require('mongodb').MongoClient
let mongoDb

let accountsRouter = require('./accounts/routing')
let currenciesRouter = require('./currencies/routing')
let distributionsRouter = require('./distributions/routing')
let transactionsRouter = require('./transactions/routing')

let server = restify.createServer()
server.use(restify.bodyParser())
// Common to server and server_test- stop

// Unique to server_test- start
let client = restify.createJsonClient({
  url: 'http://127.0.0.1:3003'
})

let accountsTests = require('./accounts/tests')
accountsTests.setClient(client)

let currenciesTests = require('./currencies/tests')
currenciesTests.setClient(client)

let distributionsTests = require('./distributions/tests')
distributionsTests.setClient(client)

let transactionsTests = require('./transactions/tests')
transactionsTests.setClient(client)
// Unique to server_test- stop

// Common to server and server_test- start
MongoClient.connect('mongodb://localhost:27017/bookwerx-core')

  // Start the server a listening
  .then(result => {
    mongoDb = result
    console.log('mongo server started')
    return new Promise((resolve, reject) => {
      accountsRouter.defineRoutes(server, mongoDb)
      mongoDb.collection('accounts').createIndex( { title: 1 }, { unique: true } )
      currenciesRouter.defineRoutes(server, mongoDb)
      distributionsRouter.defineRoutes(server, mongoDb)
      transactionsRouter.defineRoutes(server, mongoDb)

      server.listen(3003, () => {
        console.log('%s listening at %s', server.name, server.url)
        resolve(true)
      })
    })
  })
  // Common to server and server_test- stop

  // Unique to server_test- start
  .then(result => {
    mongoDb.dropDatabase()
    mongoDb.collection('accounts').createIndex( { title: 1 }, { unique: true } )
  })
  //.then(transform.tests)
  .then(accountsTests.tests)
  .then(currenciesTests.tests)
  //.then(distributionsTests.tests)
  //.then(transactionsTests.tests)
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

