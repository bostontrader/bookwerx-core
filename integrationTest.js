/*
In order to perform integration testing we're going to start with a completely empty db and perform many operations on it.  We will monitor the operation looking for errors.  The testing follows the following phases:

1. Prolog.  We need to wipe the db and generate some keys.

2. GenericCRU testing.  Here we attempt to create, read, and update the documents in the various collections.  I didn't say delete because we want to keep these records for subsequent testing and we'll do the delete testing after all the other tests.

3. Special CRU testing for the interaction of integrity constraints between certain collections.  Two examples are:
*  Currencies/Distributions/Transactions
*  Accounts/Categories

4. Aggregate testing.  There are some functions that work with broad swath of the data.  For example: one function summarizes distributions for a particular category, by time period.  Now that the db is stuffed with data, now would be a good time to test these functions.

5. Special delete testing for the items in Special CRU testing.

6. GenericDelete testing.

7. Verify that the db is now completely empty.  No documents in any collection.

For some of these categories, generally for the generic tests, we will run the tests twice, once for each of our example piKeys. The testing will fail if the documents from one key are mixed up with documents from another key.

For some of thest categories, generally for the specialized constraint testing, we only run the test once for a single api key. The CRUD operations are tested elsewhere and in these tests we only want to focus on the integrity constraints.

Almost all routes (except for the key generating routes) should be separately tested for no key, bad key, and good key but bad signature.

 */

// We need to use require for this
const colors = require('colors/safe')

import testData       from 'bookwerx-testdata'
import config         from 'config'
import restifyClients from 'restify-clients'

//import genericCRUDTest    from './app/integrationTest/generic_crud_test'
import server             from './app/server'
//import accountsCategories from './app/integrationTest/accountsCategories'
//import prolog             from './app/integrationTest/prolog'
import genericCRU         from './app/integrationTests/basicCRUD/genericCRU'
import genericDel         from './app/integrationTests/basicCRUD/genericDel'

const port = config.get('port')

// We don't want to run this test on any db that's not explicitly marked for testing lest we cause serious dain bramage.
if (!config.get('enableTest')) {
  let msg = 'Configuration ' + config.get('configName') + ' does not allow testing.'
  throw new Error(msg)
}

const httpClient = restifyClients.createJsonClient({url: 'http://127.0.0.1:' + port})

let keys

process.on('uncaughtException', function (err) {
  console.log(colors.red('error'),'UNCAUGHT EXCEPTION - keeping process alive:',  err);
});

const p = server.start()

// 1. This will drop the db and enable us to start with a clean slate.
.then(mongoDb => {
  console.log('The Server is ready to ROCK!')

  return new Promise((resolve, reject) => {
    mongoDb.dropDatabase().then(() => {console.log('brainwipe');resolve(true)})
  })

})

.then(result => {

  const pReadDawgFood =  new Promise((resolve, reject) => {
    httpClient.post('/dawgfood', {}, function (err, req, res, obj) {
      if (err) resolve(err) // in this case I expect an error
    })
  })

  //const pReadKeys =  new Promise((resolve, reject) => {
    //httpClient.post('/keys', {}, function (err, req, res, obj) {
      //if (err) reject(err)
      //console.log('%d -> %j', res.statusCode, res.headers);
      //console.log('%j', obj);
      //resolve(obj)
    //})
  //})

  //const p2 = pReadDawgFood.then((result)=>{
    //console.log('72 dawgfood error',result)
    //Promise.resolve(result)
  //})

  const pReadKey1 =  new Promise((resolve, reject) => {
    httpClient.post('/keys', {}, function (err, req, res, obj) {
      if (err) reject(err)
      //console.log('%d -> %j', res.statusCode, res.headers);
      //console.log('%j', obj);
      resolve(obj)
    })
  })

  const pReadKey2 =  new Promise((resolve, reject) => {
    httpClient.post('/keys', {}, function (err, req, res, obj) {
      if (err) reject(err)
      //console.log('%d -> %j', res.statusCode, res.headers);
      //console.log('%j', obj);
      resolve(obj)
    })
  })

  return Promise.all([pReadDawgFood,pReadKey1,pReadKey2])

})
.then((result) => {
  keys = [
    result[1],
    result[2]
  ]
  console.log(95,result[1], result[2])
})



// 2. Generic CRU testing
.then(result => {return genericCRU({collName:'accounts', httpClient,  keys, newDoc1:testData.accountBank, newDoc2:testData.accountCash, pn:20})})

//.then(result => {return genericCRU({collName:'categories', httpClient,  keys, newDoc1: testData.categoryAsset, newDoc2: testData.categoryExpense, pn:21})})

//.then(result => {return genericCRU({collName:'currencies', httpClient, keys, newDoc1: testData.currencyCNY, newDoc2: testData.currencyRUB, pn: 22})})

//.then(result => {return genericCRU({collName:'transactions', httpClient, keys, newDoc1: testData.transaction1, newDoc2: testData.transaction2, pn: 23})})

// 3. CustomCRU testing specialized for particular collections./
//.then(() => {return accountsCategories({httpClient,  keys, pn:30})})

//const p = new Promise( (resolve, reject) => {
//reject('promise rejected')
//resolve()
//




//.then(result => {
//	let priorResults = {}
//	return distributionsTest.testRunner(7, testData, priorResults)
//})

// accounts_categories are not manipulated via a public API, so there's no direct testing
// of CRUD or other operations.  Instead, the CRUD operations of accounts should reveal
// or change the state of accounts_categories.  Test that here.
//.then(result => {
  //return accountsCategoriesTest.testRunner(9, testData)
//})

// 6. Generic delete testing.
.then(result => {return genericDel({collName:'accounts', httpClient,  keys, pn:60})})
//.then(result => {return genericDel({collName:'categories', httpClient,  keys, pn:61})})
//.then(result => {return genericDel({collName:'currencies', httpClient,  keys, pn:62})})
//.then(result => {return genericDel({collName:'transactions', httpClient,  keys, pn:63})})

.then(result => {
  console.log(colors.green('P10 tests passed'))
  process.exit()
})

p.catch(error => {
  console.error(colors.red(error))
})
