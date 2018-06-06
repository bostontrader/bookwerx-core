// import restify        from 'restify'
const restify = require('restify')

// const express = require('express')
// const bodyParser = require('body-parser')
// import restifyClients from 'restify-clients'
// const restifyClients = require('restify-clients')

// import restifyPlugins from 'restify-plugins'
const restifyPlugins = require('restify-plugins')

// import accountsRouter      from './accounts/routing'
// import categoriesRouter    from './categories/routing'
// import bookWerxConstants from './constants'

// import currenciesRouter    from './currencies/routing'
const currenciesRouter = require('./currencies/routing')

// import distributionsRouter from './distributions/routing'
// import keysRouter          from './keys/routing'
const keysRouter = require('./keys/routing')

// import toolsRouter         from './tools/routing'
// import transactionsRouter  from './transactions/routing'

// Mongo is special.  Do it this way.
const MongoClient = require('mongodb').MongoClient
// const mongoConnectionURL = config.get('mongoConnectionURL')

// const restifyCore = restify.createServer()
// var app = express()
// const expressCore = express()
const restifyCore = restify.createServer()

// expressCore.post('/currencies', bodyParser.json)
// expressCore.post(express.json())
// Create a GraphQL endpoint
/* expressCore.use('/graphql', expressGraphQL({
  schema: schema,
  rootValue: root,
  graphiql: true
})) */

// const corsMiddleware = require('restify-cors-middleware')
// const cors = corsMiddleware({
// preflightMaxAge: 5, //Optional
// origins: ['*'],
// allowHeaders: ['API-Token'],
// allowHeaders: ['Access-Control-Allow-Origin'],
//  exposeHeaders: ['API-Token-Expiry']
// expose: ['Access-Control-Allow-Origin']

// })

// server.pre(cors.preflight)
// restifyCore.use(cors.actual)

// restifyCore.use(restifyPlugins.queryParser())
restifyCore.use(restifyPlugins.bodyParser())

// restifyCore.use( (req, res, next) => {
//  console.log('server.31', req.path(), req.query, req.body)
//  if (req.path() === '/keys') return next()

// This request must be authorized
//  if('apiKey' in req.query) {
//    if('requestSig' in req.query) {
//      if(req.query.requestSig === 'goodsecret') { // if the signature is correct
// The signature is good so continue
//        next()
//      } else {
//        res.json({error: bookWerxConstants.API_SIG_NOT_CORRECT})
//        next(false)
//      }
//    } else {
//      res.json({error: bookWerxConstants.API_SIG_NOT_CORRECT})
//      next(false)
//    }
//    return next()
//  } else {
//    res.json({error: bookWerxConstants.MISSING_API_KEY})
//    next(false)
//  }
// })

// restifyCore.use(restify.CORS({
// origins: ['https://foo.com', 'http://bar.com', 'http://baz.com:8081'],   // defaults to ['*']
// credentials: true,                 // defaults to false
// headers: ['x-foo']                 // sets expose-headers
// }))

// restifyCore.on('uncaughtException', (req, res, route, err) => {
//  console.log(colors.red('server.35', err))
//  res.send({ success: false, error: err.message });
// })

// restifyCore.on('NotFound', function (request, response, cb) {console.log(34,'NotFound')});
// restifyCore.on('MethodNotAllowed', function (request, response, cb) {35,'MethoNotAllowed'})
// const bail = (error, location) => {console.error(colors.red(location,error.stack)); process.exit()}

module.exports = {

  start: (port, mongoConnectionURL) => {
    return MongoClient.connect(mongoConnectionURL)

      .then(mongoDb => {
        console.log('Connected to the mongo server: ', mongoConnectionURL)
        console.log(keysRouter)
        keysRouter(restifyCore, mongoDb)
        //      accountsRouter(restifyCore, mongoDb)
        //      categoriesRouter(restifyCore, mongoDb)
        currenciesRouter(restifyCore, mongoDb)
        //      distributionsRouter(restifyCore, mongoDb)
        //      toolsRouter(restifyCore, mongoDb)
        //      transactionsRouter(restifyCore, mongoDb)
        //     app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'))
        return new Promise((resolve, reject) => {
          restifyCore.listen(port, () => {
            console.log('The bookwerx-core server is listening on port', port)
            resolve(mongoDb)
          })
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
}
