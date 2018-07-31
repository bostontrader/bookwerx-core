/*
In order to perform integration testing we're going to start with a completely empty db and perform many operations on it.  The testing follows the following phases:

1. Prolog. Start the server and brainwipe the db.

2. GenericCRU testing for each collection.  Here we attempt to create, read, and update documents in the various collections.  I didn't say delete because we want to keep these records for subsequent testing and we'll do the delete testing after all the other tests.

3. Special CRU testing for the interaction of integrity constraints between certain collections.  Two examples are:
*  Currencies/Distributions/Transactions
*  Accounts/Categories

4. Aggregate testing.  There are some functions that work with broad swaths of the data.  For example: one function summarizes distributions for a particular category, by time period.  Now that the db is stuffed with data, we have a good opportunity to test these functions.

5. Special delete testing for the items in Special CRU testing.

6. GenericDelete testing.

7. Verify that the db is now completely empty.  No documents in any collection.
 */
const colors = require('colors/safe')
const testData = require('bookwerx-testdata')
const restifyClients = require('restify-clients')

const bookwerxConstants = require('./app/constants')

if (!process.env.BW_PORT) {
  console.log(bookwerxConstants.NO_LISTENING_PORT_DEFINED)
  process.exit(1)
}

if (!process.env.BW_MONGO) {
  console.log(bookwerxConstants.NO_CONNECTION_TO_MONGODB_DEFINED)
  process.exit(1)
}

if (!process.env.BWCORE_HOSTNAME) {
  console.log(bookwerxConstants.NO_BWCORE_HOSTNAME_DEFINED)
  process.exit(1)
}

const server = require('./app/server')

// import accountsCategories from './app/integrationTest/accountsCategories'
const genericCRU = require('./app/integrationTests/basicCRUD/genericCRU')
const genericDel = require('./app/integrationTests/basicCRUD/genericDel')

// We don't want to run this test on any db unless we explicity request testing lest we cause serious dain bramage.
if (!process.env.BW_TEST) {
  console.log(bookwerxConstants.NOT_CONFIGURED_AS_TEST)
  process.exit(1)
}

run().catch(error => console.error(error))

async function run () {
  // 1. Prolog
  // 1.1 Going to need a functioning server.
  const mongoDb = await server.start(process.env.BW_PORT, process.env.BW_MONGO)

  // 1.2 We want to drop the db in order to start with a fresh-slate.
  await mongoDb.dropDatabase()

  // 1.3 We will need a client to make subsequent requests to the bookwerx-core server.
  const jsonClient = restifyClients.createJsonClient({url: 'http://' + process.env.BWCORE_HOSTNAME + ':' + process.env.BW_PORT})

  // 2. genericCRU
  await genericCRU({collName: 'accounts', collSingular: 'account', httpClient: jsonClient, newDoc1: testData.accountBank, newDoc2: testData.accountCash, pn: 20})
  await genericCRU({collName: 'categories', collSingular: 'category', httpClient: jsonClient, newDoc1: testData.categoryAsset, newDoc2: testData.categoryExpense, pn: 21})

  await genericCRU({collName: 'currencies', collSingular: 'currency', httpClient: jsonClient, newDoc1: testData.currencyCNY, newDoc2: testData.currencyRUB, pn: 22})

  await genericCRU({collName: 'transactions', collSingular: 'transaction', httpClient: jsonClient, newDoc1: testData.transaction1, newDoc2: testData.transaction2, pn: 23})

  // 3. CustomCRU testing specialized for particular collections.
  // .then(() => {return accountsCategories({jsonClient,  keys, pn:30})})

  // const p = new Promise( (resolve, reject) => {
  // reject('promise rejected')
  // resolve()
  //

  // .then(result => {
  // let priorResults = {}
  // return distributionsTest.testRunner(7, testData, priorResults)
  // })

  // accounts_categories are not manipulated via a public API, so there's no direct testing
  // of CRUD or other operations.  Instead, the CRUD operations of accounts should reveal
  // or change the state of accounts_categories.  Test that here.
  // .then(result => {
  // return accountsCategoriesTest.testRunner(9, testData)
  // })

  // 6. Generic delete testing.
  await genericDel({collName: 'accounts', httpClient: jsonClient, pn: 60})
  // .then(result => {return genericDel({collName:'categories', jsonClient,  keys, pn:61})})
  await genericDel({collName: 'currencies', httpClient: jsonClient, pn: 62})
  await genericDel({collName: 'transactions', httpClient: jsonClient, pn: 63})

  // 7. Verify that all collections are empty

  console.log(colors.green('All tests passed'))

  // What's holding this process open?  Why doesn't it just stop on its own?  Probably mongodb and the server.
  process.exit(0)
}
