let client

let firstNewAccount = {title: 'first new title'}
let secondNewAccount = {title: 'second new title'}

exports.setClient = function (c) {client = c}

exports.tests = function () {
  // 1. GET /accounts and look for the correct operation of returning
  // an array of zero, one, or > 1 elements.
  return new Promise((resolve, reject) => {
    console.log('GET /accounts, sb empty')
    client.get('/accounts', function (err, req, res, obj) {
      if (err) reject(err)
      if (obj.length !== 0) reject('accounts should be empty')
      console.log('accounts=%j', obj)
      resolve(true)
    })
  })

  .then((result) => {
    console.log('POST /accounts, 1st new document')
    return new Promise((resolve, reject) => {
      client.post('/accounts', firstNewAccount, function (err, req, res, obj) {
        if (err) reject(err)
        firstNewAccount = obj
        console.log('%j', firstNewAccount)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /accounts, sb only 1 document')
    return new Promise((resolve, reject) => {
      client.get('/accounts', function (err, req, res, obj) {
        if (err) reject(err)
        if (obj.length !== 1) reject('accounts should only have one document')
        console.log('accounts=%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('POST /accounts, 2nd new document')
    return new Promise((resolve, reject) => {
      client.post('/accounts', secondNewAccount, function (err, req, res, obj) {
        if (err) reject(err)
        console.log('%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /accounts, sb two documents')
    return new Promise((resolve, reject) => {
      client.get('/accounts', function (err, req, res, obj) {
        if (err) reject(err)
        if (obj.length !== 2) reject('accounts should only have two documents')
        console.log('accounts=%j', obj)
        resolve(true)
      })
    })
  })

  // 2. GET /accounts/:id
  .then((result) => {
    console.log('GET /accounts/:id, bad id')
    return new Promise((resolve, reject) => {
      client.get('/accounts/666666b816070328224cf098', function (err, req, res, obj) {
        if (err) reject(err)
        if (!obj.error) reject('this test must generate an error')
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /accounts/:id, good id')
    return new Promise((resolve, reject) => {
      client.get('/accounts/'+firstNewAccount._id, function (err, req, res, obj) {
        if (err) reject(err)
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  // 3. POST /accounts
  // We already know that POST works.

  // 4. PUT /accounts/:id
  .then((result) => {
    console.log('PUT /accounts, good id')
    return new Promise((resolve, reject) => {
      client.put('/accounts/' + firstNewAccount._id, {title: 'first amended title'}, function (err, req, res, obj) {
        if (err) {
          console.log(err)
          reject(err)
        }
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('PUT /accounts, bad id')
    return new Promise((resolve, reject) => {
      client.put('/accounts/666666b816070328224cf098', {}, function (err, req, res, obj) {
        if (err) {
          console.log(err)
          reject(err)
        }
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  // 5. DELETE /accounts/:id
  .then((result) => {
    console.log('DELETE /accounts, bad id')
    return new Promise((resolve, reject) => {
      client.del('/accounts/666666b816070328224cf098', function (err, req, res, obj) {
        if (err) {
          console.log(err)
          reject(err)
        }
        console.log('correct result:%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('DELETE /accounts, good id')
    return new Promise((resolve, reject) => {
      client.del('/accounts/' + firstNewAccount._id, function (err, req, res, obj) {
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
