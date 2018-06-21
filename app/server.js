const restify = require('restify')

// const bodyParser = require('body-parser')
// import restifyClients from 'restify-clients'
// const restifyClients = require('restify-clients')

const restifyPlugins = require('restify-plugins')

const accountsRouter = require('./accounts/routing')
// import categoriesRouter    from './categories/routing'
// import bookWerxConstants from './constants'
const currenciesRouter = require('./currencies/routing')

// import distributionsRouter from './distributions/routing'

// import toolsRouter         from './tools/routing'
// import transactionsRouter  from './transactions/routing'

const MongoClient = require('mongodb').MongoClient
// const mongoConnectionURL = config.get('mongoConnectionURL')

const restifyCore = restify.createServer()

// expressCore.post('/currencies', bodyParser.json)
// expressCore.post(express.json())
// Create a GraphQL endpoint
/* expressCore.use('/graphql', expressGraphQL({
  schema: schema,
  rootValue: root,
  graphiql: true
})) */

const corsMiddleware = require('restify-cors-middleware')
const cors = corsMiddleware({
  // preflightMaxAge: 5, //Optional
  origins: ['http://localhost:3004']
  // allowHeaders: ['API-Token'],
  // allowHeaders: ['Access-Control-Allow-Origin'],
  // exposeHeaders: ['API-Token-Expiry']
  // expose: ['Access-Control-Allow-Origin']
})

restifyCore.pre(cors.preflight)
restifyCore.use(cors.actual)

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


// restifyCore.on('NotFound', function (request, response, cb) {console.log(34,'NotFound')});
// restifyCore.on('MethodNotAllowed', function (request, response, cb) {35,'MethoNotAllowed'})
// const bail = (error, location) => {console.error(colors.red(location,error.stack)); process.exit()}

module.exports = {

  start: (port, mongoConnectionURL) => {
    return MongoClient.connect(mongoConnectionURL)

      .then(mongoDb => {
        console.log('Connected to the mongo server: ', mongoConnectionURL)
        accountsRouter(restifyCore, mongoDb)
        // categoriesRouter(restifyCore, mongoDb)
        currenciesRouter(restifyCore, mongoDb)
        // distributionsRouter(restifyCore, mongoDb)
        // toolsRouter(restifyCore, mongoDb)
        // transactionsRouter(restifyCore, mongoDb)

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
