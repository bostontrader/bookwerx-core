let client

let firstNewDistribution = {title: 'first new title'}
let secondNewDistribution = {title: 'second new title'}

exports.setClient = function (c) {
  client = c
}

exports.tests = function () {
  return new Promise((resolve, reject) => {
    console.log('GET /distributions, sb empty')
    client.get('/distributions', function (err, req, res, obj) {
      if (err) reject(err)
      if (obj.length !== 0) reject('distributions should be empty')
      console.log('distributions=%j', obj)
      resolve(true)
    })
  })

  .then((result) => {
    console.log('POST /distributions, 1st new document')
    return new Promise((resolve, reject) => {
      client.post('/distributions', firstNewDistribution, function (err, req, res, obj) {
        if (err) reject(err)
        firstNewDistribution = obj
        console.log('%j', firstNewDistribution)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /distributions, sb only 1 document')
    return new Promise((resolve, reject) => {
      client.get('/distributions', function (err, req, res, obj) {
        if (err) reject(err)
        if (obj.length !== 1) reject('distributions should only have one document')
        console.log('distributions=%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('POST /distributions, 2nd new document')
    return new Promise((resolve, reject) => {
      client.post('/distributions', secondNewDistribution, function (err, req, res, obj) {
        if (err) reject(err)
        console.log('%j', obj)
        resolve(true)
      })
    })
  })

  .then((result) => {
    console.log('GET /distributions, sb two documents')
    return new Promise((resolve, reject) => {
      client.get('/distributions', function (err, req, res, obj) {
        if (err) reject(err)
        if (obj.length !== 2) reject('distributions should only have two documents')
        console.log('distributions=%j', obj)
        resolve(true)
      })
    })
  })

  // post a bad document (empty title)
  .then((result) => {
    console.log('POST /distributions, bad document, empty title')
    return new Promise((resolve, reject) => {
      client.post('/distributions', {}, function (err, req, res, obj) {
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
    console.log('PUT /distributions, good id, good document')
    return new Promise((resolve, reject) => {
      client.put('/distributions/' + firstNewDistribution._id, {title: 'first amended title'}, function (err, req, res, obj) {
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
    console.log('PUT /distributions, bad id, good document')
    return new Promise((resolve, reject) => {
      client.put('/distributions/666666b816070328224cf098', {}, function (err, req, res, obj) {
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
    console.log('DELETE /distributions, bad id')
    return new Promise((resolve, reject) => {
      client.del('/distributions/666666b816070328224cf098', function (err, req, res, obj) {
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
    console.log('DELETE /distributions, good id')
    return new Promise((resolve, reject) => {
      client.del('/distributions/' + firstNewDistribution._id, function (err, req, res, obj) {
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
