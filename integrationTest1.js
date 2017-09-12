// We need to use require for this
const colors = require('colors/safe')

//import testData       from 'bookwerx-testdata'
//import {bookA} from './app/integrationTest/testdata_keyed.js'
//import {bookB} from './app/integrationTest/testdata_keyed.js'

import config         from 'config'
import restifyClients from 'restify-clients'

//import genericCRUDTest    from './app/integrationTest/generic_crud_test'
import server             from './app/server'
//import accountsCategories from './app/integrationTest/accountsCategories'
//import prolog             from './app/integrationTest/prolog'
//import genericCRU         from './app/integrationTest/genericCRU'
//import genericDel         from './app/integrationTest/genericDel'





const port = config.get('port')

// We don't want to run this test on any db that's not explicitly marked for testing lest we cause serious dain bramage.
if (!config.get('enableTest')) {
  let msg = 'Configuration ' + config.get('configName') + ' does not allow testing.'
  throw new Error(msg)
}

const httpClient = restifyClients.createJsonClient({url: 'http://127.0.0.1:' + port})

//const bail = (error, location) => {console.error(colors.red(location,error.stack)); process.exit()}

let keys

const pReadDawgFood =  new Promise((resolve, reject) => {
  httpClient.post('/dawgfood', {}, function (err, req, res, obj) {
    if (err) resolve(err) // in this case I expect an error
  })
})

const pReadKeys =  new Promise((resolve, reject) => {
  httpClient.post('/keys', {}, function (err, req, res, obj) {
    if (err) reject(err)
    console.log('%d -> %j', res.statusCode, res.headers);
    console.log('%j', obj);
    resolve(obj)
  })
})



const p = server.start()

// 1. This will drop the db and enable us to start with a clean slate.
p.then(mongoDb => {
  console.log('The Server is ready to ROCK!')

  return new Promise((resolve, reject) => {
    mongoDb.dropDatabase().then(() => {console.log('brainwipe');resolve(true)})
  })


//
})
.then(result => {
  //const pBrainwipe =  new Promise((resolve, reject) => {
    //mongoDb.dropDatabase().then(() => {resolve(true)})
  //})

  const p2 = pReadDawgFood.then((result)=>{
    console.log('72 dawgfood error',result)
  })

  const p3 = pReadKeys.then((result)=>{
    console.log('76 keys ',result)
  })

  return Promise.all([p2,p3])
  //const p2 =
  //const p = prolog({httpClient, mongoDb})
  //p.then(()=>{
  //console.log(colors.green('P10 All tests passed'))
  //process.exit()
  //})
  //p.catch(error => {console.error(colors.red(bail(error,'integrationTest1.41'))); process.exit()})
  //return p
//}).catch(error => {console.error(colors.red(bail(error,'integrationTest1.43'))); process.exit()})
//.then(result => {
  //keys = result
  //console.log('integrationTest1.40',keys)
  //return Promise.resolve()
//})

// Fill the db with testdata


// 3. CustomCRU testing specialized for particular collections.
//.then(() => {return accountsCategories({httpClient,  keys, pn:30})})

//const p = new Promise( (resolve, reject) => {
//reject('promise rejected')
//resolve()
//
})


.then(result => {
  console.log(colors.green('All tests passed.'))
  process.exit()
})
//p.then(()=>{
  //console.log('mongo started 2')

//})

//p.catch(error => {console.error(colors.red(error,'integrationTest1.69')); process.exit()})
