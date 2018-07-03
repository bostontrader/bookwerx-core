// const colors = require('colors/safe')

// GET /{collectionPlural} (the entire collection)
const getMany = async ({collName, expectedCnt, expectedError, fExpectSuccess, httpClient, pn, priorResults}) => {
  return new Promise((resolve, reject) => {
    let url = '/' + collName

    console.log('P%s.1 GET %s', pn, url)

    httpClient.get(url, function (err, req, res, obj) {
      if (err) reject(err)
      if (fExpectSuccess) {
      } else {
        if (obj.error !== expectedError) {
          reject(new Error('this test must generate the error:[' + expectedError + ']'))
        }
        resolve(priorResults)
      }
      if (obj.length !== expectedCnt) {
        reject(new Error('Expecting ' + expectedCnt + ' documents, found ' + obj.length + ' documents'))
      }
      console.log('P%s.1 Expected result: %j', pn, obj)
      // if (obj.length > 0) priorResults['goodId'] = obj[0]['_id']
      if (obj.length > 0) {
        priorResults['goodId'] = obj.map((e) => { return e['_id'] })
        // console.log(priorResults)
      }

      resolve(priorResults)
    })
  })
  // .catch(error => { console.error(colors.red(32 + ' ' + error)) })
}

// GET /{collectionPlural}/:id (a single document by id)
const getOne = ({collName, expectedError, fExpectSuccess, httpClient, id, pn, priorResults}) => {
  return new Promise((resolve, reject) => {
    let url = '/' + collName + '/' + id

    console.log('P%s.3 GET %s', pn, url)
    httpClient.get(url, function (err, req, res, obj) {
      if (err) reject(err)
      if (fExpectSuccess) {
      } else {
        // if (obj.error !== expectedError) {
        if (obj.errors[0]['value'] !== expectedError) {
          reject(new Error('this test must generate the error:[' + expectedError + ']'))
        }
        resolve(priorResults)
      }
      resolve(priorResults)
    })
  })
  // .catch(error => { console.error(colors.red(53 + ' ' + error)) })
}

// PATCH /{collectionPlural}/:id
const patch = ({collName, document, expectedError, fExpectSuccess, httpClient, id, pn, priorResults}) => {
  return new Promise((resolve, reject) => {
    let url = '/' + collName + '/' + id

    console.log('P%s.4 PATCH %s %j', pn, url, document)
    httpClient.patch(url, document, function (err, req, res, obj) {
      if (err) reject(err)
      if (fExpectSuccess) {
        // if (!obj.lastErrorObject) {
        //  reject(JSON.stringify(obj))
        // }
        console.log('P%s.4 Expected result: %j', pn, obj)
        resolve(priorResults)
      } else {
        if (obj.error !== expectedError) {
          reject(new Error('this test must generate the error:[' + expectedError + ']'))
        }
        resolve(priorResults)
      }
    })
  })
  // .catch(error => {console.error(colors.red(80 + ' ' + error))})
}

// POST /{collectionPlural}
const post = ({collName, document, expectedError, fExpectSuccess, httpClient, pn, priorResults}) => {
  return new Promise((resolve, reject) => {
    let url = '/' + collName

    console.log('P%s.2 POST %s %j', pn, url, document)

    httpClient.post(url, document, function (err, req, res, obj) {
      if (err) reject(err)
      if (fExpectSuccess) {
      } else {
        if (obj.error !== expectedError) { reject(new Error('this test must generate the error:[' + expectedError + ']')) }
        resolve(priorResults)
      }
      if (obj.ok !== 1) reject(JSON.stringify(obj))
      console.log('P%s.2 Expected result: %j', pn, obj)
      resolve(priorResults)
    })
  })
  // .catch(error => { console.error(colors.red(101 + ' ' + error)) })
}

// PUT /{collectionPlural}/:id
// const put = ({collName, document, expectedError, fExpectSuccess, httpClient, id, pn, priorResults}) => {

//  return new Promise((resolve, reject) => {

//    let url = '/' + collName  + '/' + id
// If no apiKey we don't care what the requestSig is
// if (apiKey) url += '?apiKey=' + apiKey + (requestSig ? '&requestSig=' + requestSig : '')

//    console.log('P%s.4 PUT %s %j', pn, url, document)
//    httpClient.put(url, document, function (err, req, res, obj) {
//      if (err) reject(err)
//      if (fExpectSuccess) {
//        // if (!obj.lastErrorObject) reject(JSON.stringify(obj))
//        console.log('P%s.4 Expected result: %j', pn, obj)
//        resolve(priorResults)
//      } else {
//        if (obj.error !== expectedError)
//          reject('this test must generate the error:[' + expectedError +']')
//        resolve(priorResults)
//      }
//    })
//  })
//  .catch(error => {console.error(colors.red(107 + ' ' + error))})
// }

// DELETE /{collectionPlural}/:id
const del = ({collName, expectedError, fExpectSuccess, httpClient, id, pn, priorResults}) => {
  return new Promise((resolve, reject) => {
    let url = '/' + collName + '/' + id

    console.log('P%s.4 DEL %s', pn, url)

    httpClient.del(url, function (err, req, res, obj) {
      if (err) reject(err)
      if (fExpectSuccess) {
      } else {
        if (obj.error !== expectedError) {
          reject(new Error('this test must generate the error:[' + expectedError + ']'))
        }
        resolve(priorResults)
      }
      // if (!obj.lastErrorObject) reject(JSON.stringify(obj))
      console.log('P%s.5 Expected result: %j', pn, obj)
      resolve(priorResults)
    })
  })
  // .catch(error => { console.error(colors.red(151 + ' ' + error)) })
}

module.exports.getMany = getMany
module.exports.getOne = getOne
module.exports.patch = patch
module.exports.post = post
module.exports.del = del
