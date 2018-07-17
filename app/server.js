const MongoClient = require('mongodb').MongoClient
const restify = require('restify')
const restifyPlugins = require('restify-plugins')

const accountsRouter = require('./accounts/routing')
const categoriesRouter = require('./categories/routing')
const currenciesRouter = require('./currencies/routing')
// import distributionsRouter from './distributions/routing'
// import toolsRouter         from './tools/routing'
const transactionsRouter = require('./transactions/routing')

const restifyCore = restify.createServer()

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
        categoriesRouter(restifyCore, mongoDb)
        currenciesRouter(restifyCore, mongoDb)
        // distributionsRouter(restifyCore, mongoDb)
        // toolsRouter(restifyCore, mongoDb)
        transactionsRouter(restifyCore, mongoDb)

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
