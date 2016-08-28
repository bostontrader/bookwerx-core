// Common to server and server_test- start
let restify = require('restify')
let config = require('config')
let port = config.get('port')

let MongoClient = require('mongodb').MongoClient
let mongoDb
let mongoConnectionURL = config.get('mongoConnectionURL')

// let accountsCategoriesRouter = require('./accounts_categories/routing')
let accountsRouter = require('./accounts/routing')
let categoriesRouter = require('./categories/routing')
let currenciesRouter = require('./currencies/routing')
let distributionsRouter = require('./distributions/routing')
// let toolsRouter = require('./tools/routing')
let transactionsRouter = require('./transactions/routing')

let server = restify.createServer()
server.use(restify.bodyParser())
server.use(restify.queryParser())
// Common to server and server_test- stop

// Unique to server_test- start
if (!config.get('enableTest')) {
  let msg = 'Configuration ' + config.get('configName') + ' does not allow testing.'
  throw new Error(msg)
}

let client = restify.createJsonClient({
  url: 'http://127.0.0.1:' + port
})

// let accountsCategoriesTests = require('./accounts_categories/tests')
// accountsCategoriesTests.setClient(client)

let testdata = require('bookwerx-testdata')
let CRUDTest = require('./generic_crud_test')
let accountsCRUDTest = new CRUDTest(client, 'account', 'accounts', testdata.accountBank, testdata.accountCash)
let categoriesCRUDTest = new CRUDTest(client, 'category', 'categories', testdata.categoryAsset, testdata.categoryExpense)
let currenciesCRUDTest = new CRUDTest(client, 'currency', 'currencies', testdata.currencyCNY, testdata.currencyRUB)

// Generic crud for transactions is ok because we can have tx w/o other foreign references.
let transactionsCRUDTest = new CRUDTest(client, 'transaction', 'transactions', testdata.transaction1, testdata.transaction1)

// Testing for distributions is way different because of all the foreign references,
// and because ordinary CRUD testing is not so relevant.
let DistributionsTest = require('./distributions_test')
var distributionsTest = new DistributionsTest(client, testdata)

// let toolsTests = require('./tools/tests')
// toolsTests.setClient(client)

// Unique to server_test- stop

// Common to server and server_test- start
MongoClient.connect(mongoConnectionURL)

// Start the server a listening
.then(result => {
  mongoDb = result
  return new Promise((resolve, reject) => {
    console.log('P1 mongo server started')
    // accountsCategoriesRouter.defineRoutes(server, mongoDb)
    accountsRouter.defineRoutes(server, mongoDb)
    categoriesRouter.defineRoutes(server, mongoDb)
    currenciesRouter.defineRoutes(server, mongoDb)
    distributionsRouter.defineRoutes(server, mongoDb)
    // toolsRouter.defineRoutes(server, mongoDb)
    transactionsRouter.defineRoutes(server, mongoDb)

    server.listen(port, () => {
      console.log('P2 %s listening at %s', server.name, server.url)
      resolve(true)
    })
  })
})
// Common to server and server_test- stop

.then(result => {
  console.log('P3 drop db')
  mongoDb.dropDatabase()
  // mongoDb.collection('accounts').createIndex({ title: 1 }, { unique: true } )
})

// generic crud for accounts, categories, and currencies
.then(result => {
  let priorResults = {}
  return accountsCRUDTest.testRunner(4, priorResults)
})
.then(result => {
  let priorResults = {}
  return categoriesCRUDTest.testRunner(5, priorResults)
})
.then(result => {
  let priorResults = {}
  return currenciesCRUDTest.testRunner(6, priorResults)
})
.then(result => {
  let priorResults = {}
  return transactionsCRUDTest.testRunner(7, priorResults)
})

// distribution testing is handled differently. Lot of integrity constraints, not
// so much CRUD
.then(result => {
  let priorResults = {}
  return distributionsTest.testRunner(8, testdata, priorResults)
})
.then(result => {
  console.log('P9 tests passed')
  process.exit()
})
.catch((e) => {
  console.log('error=%j', e)
})
