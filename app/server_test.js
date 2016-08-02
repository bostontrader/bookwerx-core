let restify = require('restify')
let MongoClient = require('mongodb').MongoClient
let mongoDb

let accountsRouter = require('./accounts/routing')
let accountsTests = require('./accounts/tests')

let currenciesRouter = require('./currencies/routing')
let currenciesTests = require('./currencies/tests')

let distributionsRouter = require('./distributions/routing')
let distributionsTests = require('./distributions/tests')

let transactionsRouter = require('./transactions/routing')
let transactionsTests = require('./transactions/tests')

let server = restify.createServer()
server.use(restify.bodyParser())

let client = restify.createJsonClient({
  url: 'http://127.0.0.1:3003'
})

accountsTests.setClient(client)
currenciesTests.setClient(client)
distributionsTests.setClient(client)
transactionsTests.setClient(client)

let transform = require('./transform')
transform.setClient(client)

MongoClient.connect('mongodb://localhost:27017/bookwerx-core')

  // Start the server a listening
  .then(result => {
    mongoDb = result
    console.log('mongo server started')
    return new Promise((resolve, reject) => {
      accountsRouter.defineRoutes(server, mongoDb)
      currenciesRouter.defineRoutes(server, mongoDb)
      distributionsRouter.defineRoutes(server, mongoDb)
      transactionsRouter.defineRoutes(server, mongoDb)

      server.listen(3003, () => {
        console.log('%s listening at %s', server.name, server.url)
        resolve(true)
      })
    })
  })

  .then(result => {
    mongoDb.dropDatabase()
    mongoDb.collection('accounts').createIndex( { title: 1 }, { unique: true } )
  })
  .then(transform.tests)
  //.then(accountsTests.tests)
  //.then(currenciesTests.tests)
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

