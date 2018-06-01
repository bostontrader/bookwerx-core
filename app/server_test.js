/*
This is an integration test for the bookwerx-core server.  The test will turn on the server, empty all collections, and then submit a tedious sequence of requests to the server, to make said server play tricks.

No testing will happen unless the proper configuration, as described supra, is used.  This is a safety feature to prevent cooking your real books.  If anybody is going to cook the books, it will be you, not some half-witted test software.

The testing and associated error handling takes part in three phases:

1. Initial configuration check.  Synchronous code.  If this fails, throw Errors.  Else continue...

2. Acquire a connection to the mongo server.  Asynchronous code. If this fails, the promise reject handler will find out, and will then throw an Error.  Else continue...

3. Do the actual testing.
 */

let restify = require('restify')
let restify_clients = require('restify-clients')
let config = require('config')
if (!config.has('port')) {
  console.log('No suitable configuration was found.')
  process.exit()
}
let port = config.get('port')

if (!config.has('enableTest')) {
  console.log('This configuration is not enabled for testing.')
  process.exit()
}

let MongoClient = require('mongodb').MongoClient
let mongoClient
let mongoDb
let mongoConnectionURL = config.get('mongoConnectionURL')
let mongoDBName = config.get('mongoDBName')

let accountsRouter = require('./accounts/routing')
//let categoriesRouter = require('./categories/routing')
//let currenciesRouter = require('./currencies/routing')
//let distributionsRouter = require('./distributions/routing')
//let toolsRouter = require('./tools/routing')
//let transactionsRouter = require('./transactions/routing')

let server = restify.createServer()
server.use(restify.plugins.bodyParser())
//server.use(restify.plugins.queryParser())
// Common to server and server_test- stop

// Unique to server_test- start
//if (!config.get('enableTest')) {
  //let msg = 'Configuration ' + config.get('configName') + ' does not allow testing.'
  //throw new Error(msg)
//}

let client = restify_clients.createJsonClient({
  url: 'http://127.0.0.1:' + port
})

let testdata = require('bookwerx-testdata')
let CRUDTest = require('./generic_crud_test')

// This test _only_ tests the basic CRUD operations for accounts.  Although CRUD operations on accounts
// will reveal or change the state of accounts_categories, said testing is done elsewhere.
let accountsCRUDTest = new CRUDTest(client, 'account', 'accounts', testdata.accountBank, testdata.accountCash)

//let categoriesCRUDTest = new CRUDTest(client, 'category', 'categories', testdata.categoryAsset, testdata.categoryExpense)
//let currenciesCRUDTest = new CRUDTest(client, 'currency', 'currencies', testdata.currencyCNY, testdata.currencyRUB)

// Generic crud for transactions is ok because we can have tx w/o other foreign references.
//let transactionsCRUDTest = new CRUDTest(client, 'transaction', 'transactions', testdata.transaction1, testdata.transaction1)

// Testing for distributions and accounts_categories is way different because of all the foreign references,
// and because ordinary CRUD operations are not so relevant.
//let DistributionsTest = require('./distributions/distributions_test')
//let distributionsTest = new DistributionsTest(client, testdata)

//let AccountsCategoriesTest = require('./accounts_categories_test')
//let accountsCategoriesTest = new AccountsCategoriesTest(client, testdata)

// let toolsTests = require('./tools/tests')
// toolsTests.setClient(client)

// Unique to server_test- stop

//const RESOLVED = new Promise((resolve, reject) => {resolve(true)})

let connectToMongoClient = () => {
  console.log('Connecting to mongo server')
  return MongoClient.connect(mongoConnectionURL)
}

let emptyCollections = (result) => {
    console.log('Emptying existing collections')
    const mongoDbb = mongoClient.db(mongoDBName) // not promise
    mongoDb = mongoDbb
    const collection = mongoDbb.collection('accounts');
    return collection.deleteMany()
}

// If we can connect to the mongo server, then what?
let connectSuccess = (result) => {
  mongoClient = result
  console.log('Connected to mongo server')
  return emptyCollections()
    .then(startTheBookwerxServer)
    .then(runTheTests)
    .then(stopTheBookwerxServer)
}

let connectError = (error) => {
  console.log('error=%j', error)

  // If we cannot connect to mongod then the mere act of trying produces some side effect which prevents node from terminating.  We need this to force termination.
  process.exit()
}

let startTheBookwerxServer = (result) => {
    console.log('Starting the Bookwerx Server')
    return new Promise((resolve, reject) => {
      //console.log('Mongo server started')
      accountsRouter.defineRoutes(server, mongoDb)
      //categoriesRouter.defineRoutes(server, mongoDb)
      //currenciesRouter.defineRoutes(server, mongoDb)
      //distributionsRouter.defineRoutes(server, mongoDb)
      //toolsRouter.defineRoutes(server, mongoDb)
      //transactionsRouter.defineRoutes(server, mongoDb)
      server.listen(port, () => {
        console.log('%s listening at %s', server.name, server.url)
        resolve(true)
      })
    })



    //mongoClient = result
    //return dropTestDb()
    //.then(connectToMongoClient)
}

let stopTheBookwerxServer = (result) => {
  console.log('Stopping the Bookwerx Server')
  return new Promise((resolve, reject) => {
    server.close(() => {
      console.log('The Bookwerx Server is stopped')
      resolve(true)
    })
  })
}

let runTheTests = (result) => {
  console.log('Running tests')
  let priorResults = {}
  return accountsCRUDTest.testRunner(4, priorResults)
}

let disconnectTheClient = () => {
  console.log('Disconnecting from the mongo server')
  return mongoClient.close()
}

//let dropTestDb = () => {
  //console.log('Dropping the test db')
  //return mongoClient.db(mongoDBName).dropDatabase()
//}

let p1Connect = connectToMongoClient()
p1Connect.then(connectSuccess).then(disconnectTheClient)
p1Connect.catch(connectError)


// Start the server a listening
//.then(
  //mongoClient => {
    //mongoDb = result
    //console.log('Connected to mongo server')
    //mongoDb = mongoClient.db(mongoDBName) // not promise

    //return new Promise((resolve, reject) => {
      //console.log('Disconnecting from mongo server')
      //mongoClient.close()
        //resolve(true)
    //})





      //return RESOLVED
    //})

    //.then(result => {
      //console.log('Dropping database')
      //return mongoDb.db(mongoDBName).dropDatabase()
    //})

    // generic crud for accounts, categories, and currencies
    //.then(result => {
      //let priorResults = {}
      //return accountsCRUDTest.testRunner(4, priorResults)
    //})

    //.then(result => {
      //console.log('Dropping database')
      //return mongoDb.db(mongoDBName).dropDatabase()
      //resolve(true)
      // mongoDb.collection('accounts').createIndex({ title: 1 }, { unique: true } )
      //mongoDb.close()
    //})

    //.then(result => {
      //console.log('All tests succeeded')
      //return mongoDb.dropDatabase()
      //resolve(true)
      // mongoDb.collection('accounts').createIndex({ title: 1 }, { unique: true } )
      //mongoDb.close()
    //})

      //error => {
      //console.log('error=%j', error)
      //return RESOLVED
      //}

//)



//.then(result => {
      //console.log('Dropping database')
      //mongoDb.dropDatabase()
      //resolve(true)
      // mongoDb.collection('accounts').createIndex({ title: 1 }, { unique: true } )
//})


//.then(result => {
      //let priorResults = {}
      //return categoriesCRUDTest.testRunner(5, priorResults)
//})
//.then(result => {
      //let priorResults = {}
      //return currenciesCRUDTest.testRunner(6, priorResults)
//})
//.then(result => {
      //let priorResults = {}
      //return transactionsCRUDTest.testRunner(7, priorResults)
//})

// distribution and account_category testing is handled differently. Lots of integrity constraints, not
// so much CRUD
//.then(result => {
      //let priorResults = {}
      //return distributionsTest.testRunner(8, testdata, priorResults)
//})

// accounts_categories are not manipulated via a public API, so there's no direct testing
// of CRUD or other operations.  Instead, the CRUD operations of accounts should reveal
// or change the state of accounts_categories.  Test that here.
//.then(result => {
      //return accountsCategoriesTest.testRunner(9, testdata)
//})

//.then(result => {
      //console.log('All tests passed')
      //process.exit()
//})
  //},
  //.catch((e) => {

//)
