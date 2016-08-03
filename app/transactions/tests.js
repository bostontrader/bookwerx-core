let client

let firstNewAccount = {title: 'first new title'}
let secondNewAccount = {title: 'second new title'}

exports.setClient = function (c) {
  client = c
}

exports.tests = function () {
  return new Promise((resolve, reject) => {
    console.log('GET /transactions, sb empty')
    client.get('/transactions', function (err, req, res, obj) {
      if (err) reject(err)
      if (obj.length !== 0) reject('transactions should be empty')
      console.log('transactions=%j', obj)
      resolve(true)
    })
  })

  .then((result) => {
    console.log('POST /transactions, 1st new document')
    return new Promise((resolve, reject) => {
      client.post('/transactions', firstNewAccount, function (err, req, res, obj) {
        if (err) reject(err)
        firstNewAccount = obj
        console.log('%j', firstNewAccount)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /transactions, sb only 1 document')
    return new Promise((resolve, reject) => {
      client.get('/transactions', function (err, req, res, obj) {
        if (err) reject(err)
        if (obj.length !== 1) reject('transactions should only have one document')
        console.log('transactions=%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('POST /transactions, 2nd new document')
    return new Promise((resolve, reject) => {
      client.post('/transactions', secondNewAccount, function (err, req, res, obj) {
        if (err) reject(err)
        console.log('%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /transactions, sb two documents')
    return new Promise((resolve, reject) => {
      client.get('/transactions', function (err, req, res, obj) {
        if (err) reject(err)
        if (obj.length !== 2) reject('transactions should only have two documents')
        console.log('transactions=%j', obj)
        resolve(true)
      })
    })
  })

  // post a bad document (empty title)
  .then((result) => {
    console.log('POST /transactions, bad document, empty title')
    return new Promise((resolve, reject) => {
      client.post('/transactions', {}, function (err, req, res, obj) {
        if (err) {
          console.log(err)
          reject(err)
        }
        if (obj.error === undefined) { reject('this test must generate an error') }
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  // put a good document id
  .then((result) => {
    console.log('PUT /transactions, good id, good document')
    return new Promise((resolve, reject) => {
      client.put('/transactions/' + firstNewAccount._id, {title: 'first amended title'}, function (err, req, res, obj) {
        if (err) {
          console.log(err)
          reject(err)
        }
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  // put a bad document id
  .then((result) => {
    console.log('PUT /transactions, bad id, good document')
    return new Promise((resolve, reject) => {
      client.put('/transactions/666666b816070328224cf098', {}, function (err, req, res, obj) {
        if (err) {
          console.log(err)
          reject(err)
        }
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  // put a bad document

  // delete a bad document id
  .then((result) => {
    console.log('DELETE /transactions, bad id')
    return new Promise((resolve, reject) => {
      client.del('/transactions/666666b816070328224cf098', function (err, req, res, obj) {
        if (err) {
          console.log(err)
          reject(err)
        }
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  // delete a good document id
  .then((result) => {
    console.log('DELETE /transactions, good id')
    return new Promise((resolve, reject) => {
      client.del('/transactions/' + firstNewAccount._id, function (err, req, res, obj) {
        if (err) {
          console.log(err)
          reject(err)
        }
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })
}
