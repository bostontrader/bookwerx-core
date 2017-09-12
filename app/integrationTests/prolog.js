// Prolog.  We need to wipe the db and generate some keys.

// We need to use require
const colors = require('colors/safe')

//const bail = (error, location) => {console.error(colors.red(location,error.stack)); process.exit()}

const getKeySet = ({httpClient}) => {

  const url = '/keys'
  console.log('prolog.11', url)

  const p =  new Promise((resolve, reject) => {
    httpClient.post(url, {}, function (err, req, res, obj) {
      if (err) reject(err)
      console.log('%d -> %j', res.statusCode, res.headers);
      console.log('%j', obj);
      resolve(obj)
    })
  })
  .next(()=>{
    console.log('prolog.22')
  })
  .catch(bail)

  return p
}

// Now get two keys
//.then(result => {
//return new Promise((resolve, reject) => {
//const url = '/keys'
//console.log('P%s.B POST %s', pn, url)
//httpClient.post(url, {}, function (err, req, res, obj) {
//if (err) reject(err)
//console.log('P%s.B %j', pn, obj)
//resolve(obj)
//})
//})
//})
//.then(result => {
//return new Promise((resolve, reject) => {
//const url = '/keys'
//console.log('P%s.C POST %s', pn, url)
//httpClient.post(url, {}, function (err, req, res, obj) {
//if (err) reject(err)
//console.log('P%s.C %j', pn, obj)
//resolve([result,obj]) // return an array containing the two key objects we just created
//})
//})
//})


const prolog = ({pn, httpClient, mongoDb}) => {

  const p = mongoDb.dropDatabase()
  p.then(()=>{

    const p = getKeySet({httpClient})
    p.next(result => {
      console.log(result)
    })
    p.catch(error => {
      console.log(error)
    })
    // Now get two keys
    //.then(result => {
    //return new Promise((resolve, reject) => {




    //.then(result => {
    //return new Promise((resolve, reject) => {
    //const url = '/keys'
    //console.log('P%s.C POST %s', pn, url)
    //httpClient.post(url, {}, function (err, req, res, obj) {
    //if (err) reject(err)
    //console.log('P%s.C %j', pn, obj)
    //resolve([result,obj]) // return an array containing the two key objects we just created
    //})
    //})
    //})
    return p
  })
  p.catch(bail)

  return p



}

export default prolog
