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

// restifyCore.use(restifyPlugins.queryParser())
restifyCore.use(restifyPlugins.bodyParser())

module.exports = {

  start: (port, mongoConnectionURL) => {
    return MongoClient.connect(mongoConnectionURL)

      .then(mongoDb => {
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
