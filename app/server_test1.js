// Common to server and server_test- start
let restify = require('restify')
let config = require('config')
let port = config.get('port')

let MongoClient = require('mongodb').MongoClient
let mongoDb
let mongoConnectionURL = config.get('mongoConnectionURL')

//let accountsCategoriesRouter = require('./accounts_categories/routing')
let accountsRouter = require('./accounts/routing')
let categoriesRouter = require('./categories/routing')
let currenciesRouter = require('./currencies/routing')
let distributionsRouter = require('./distributions/routing')
//let toolsRouter = require('./tools/routing')
let transactionsRouter = require('./transactions/routing')

let server = restify.createServer()
server.use(restify.bodyParser())
server.use(restify.queryParser())
// Common to server and server_test- stop

// Unique to server_test- start
let client = restify.createJsonClient({
  url: 'http://127.0.0.1:' + port
})

let testdata = require('bookwerx-testdata')
var CRUDTest = require('./generic_crud_test');
var u1 = new CRUDTest(client,'account', 'accounts', testdata.accountBank, testdata.accountCash)
var u2 = new CRUDTest(client,'category', 'categories', testdata.categoryAsset, testdata.categoryExpense)
var u3 = new CRUDTest(client,'currency', 'currencies', testdata.currencyCNY, testdata.currencyRUB)

// Generic crud for transactions is ok because we can have tx w/o other foreign references.
var u4 = new CRUDTest(client,'transaction', 'transactions', testdata.transaction1, testdata.transaction1)

// Testing for distributions is way different because of all the foreign references.
var u5 = new CRUDTest(client)



// Common to server and server_test- start
MongoClient.connect(mongoConnectionURL)

// Start the server a listening
.then(result => {
  mongoDb = result
  return new Promise((resolve, reject) => {
    console.log("P1 mongo server started")
    //accountsCategoriesRouter.defineRoutes(server, mongoDb)
    accountsRouter.defineRoutes(server, mongoDb)
    categoriesRouter.defineRoutes(server, mongoDb)
    currenciesRouter.defineRoutes(server, mongoDb)
    //distributionsRouter.defineRoutes(server, mongoDb)
    //toolsRouter.defineRoutes(server, mongoDb)
    transactionsRouter.defineRoutes(server, mongoDb)

    server.listen(port, () => {
      console.log('P2 %s listening at %s', server.name, server.url)
      resolve(true)
    })
  })
})
// Common to server and server_test- stop

.then(result => {
  console.log("P3 drop db")
  mongoDb.dropDatabase()
  // mongoDb.collection('accounts').createIndex({ title: 1 }, { unique: true } )
})

//.then(result=>{
  //return new Promise((resolve, reject) => {
    //console.log("P3")
    //resolve("P3")
  //})
//})
    
// generic crud for accounts, categories, and currencies    
.then(result=>{
  let priorResults = {}
  return u1.testRunner(4, priorResults)
})
.then(result=>{
  let priorResults = {}
  return u2.testRunner(5, priorResults)
})
.then(result=>{
  let priorResults = {}
  return u3.testRunner(6, priorResults)
})
.then(result=>{
  let priorResults = {}
  return u4.testRunner(7, priorResults)
})
.then(result=>{
  let priorResults = {}
  return u5.testDistributionsCRUD(8, testdata, priorResults)
})
.then(result => {
  console.log('P9 tests passed')
  process.exit()
})
.catch((e) => {
  console.log("error=%j",e)
})
