// We need to use require for this
//const colors = require('colors/safe')

import config         from 'config'
import restify        from 'restify'
//import restifyClients from 'restify-clients'
import restifyPlugins from 'restify-plugins'

import accountsRouter      from './accounts/routing'
//import categoriesRouter    from './categories/routing'
import bookWerxConstants from './constants'

//import currenciesRouter    from './currencies/routing'
//import distributionsRouter from './distributions/routing'
import keysRouter          from './keys/routing'
//import toolsRouter         from './tools/routing'
//import transactionsRouter  from './transactions/routing'

const port = config.get('port')

// Mongo is special.  Do it this way.
const MongoClient = require('mongodb').MongoClient
const mongoConnectionURL = config.get('mongoConnectionURL')


const restifyCore = restify.createServer()

const corsMiddleware = require('restify-cors-middleware')
const cors = corsMiddleware({
  //preflightMaxAge: 5, //Optional
  origins: ['*'],
  allowHeaders: ['API-Token'],
  exposeHeaders: ['API-Token-Expiry']
})

//server.pre(cors.preflight)
restifyCore.use(cors.actual)




restifyCore.use(restifyPlugins.queryParser())
restifyCore.use(restifyPlugins.bodyParser())

restifyCore.use( (req, res, next) => {
  console.log('server.31', req.path(), req.query, req.body)
  if (req.path() === '/keys') return next()

  // This request must be authorized
  if('apiKey' in req.query) {
    if('requestSig' in req.query) {
      if(req.query.requestSig === 'goodsecret') { // if the signature is correct
        // The signature is good so continue
        next()
      } else {
        res.json({error: bookWerxConstants.API_SIG_NOT_CORRECT})
        next(false)
      }
    } else {
      res.json({error: bookWerxConstants.API_SIG_NOT_CORRECT})
      next(false)
    }
    return next()
  } else {
    res.json({error: bookWerxConstants.MISSING_API_KEY})
    next(false)
  }
})

//restifyCore.use(restify.CORS({
  // origins: ['https://foo.com', 'http://bar.com', 'http://baz.com:8081'],   // defaults to ['*']
  //credentials: true,                 // defaults to false
  //headers: ['x-foo']                 // sets expose-headers
//}))

restifyCore.on('uncaughtException', (req, res, route, err) => {
  console.log(colors.red('server.35', err))
  res.send({ success: false, error: err.message });
})

//restifyCore.on('NotFound', function (request, response, cb) {console.log(34,'NotFound')});
//restifyCore.on('MethodNotAllowed', function (request, response, cb) {35,'MethoNotAllowed'})
//const bail = (error, location) => {console.error(colors.red(location,error.stack)); process.exit()}

const server = {

  start: () => {

    return MongoClient.connect(mongoConnectionURL)

    .then(mongoDb => {
      console.log('mongo server started')

      keysRouter(restifyCore, mongoDb)
      accountsRouter(restifyCore, mongoDb)
      //categoriesRouter(restifyCore, mongoDb)
      //currenciesRouter(restifyCore, mongoDb)
      //distributionsRouter(restifyCore, mongoDb)
      //toolsRouter(restifyCore, mongoDb)
      //transactionsRouter(restifyCore, mongoDb)

      return new Promise( (resolve, reject) => {
        restifyCore.listen(port, () => {
          console.log('Using configuration: %s', config.get('configName'))
          console.log('%s listening at %s', restifyCore.name, restifyCore.url)
          resolve(mongoDb)
        })
      })
    })
  }
}

export default server
