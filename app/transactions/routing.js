// import genericRoutes from '../generic_routes'
// import authThenInvoke from '../authThenInvoke'

// let ObjectId = require('mongodb').ObjectId

// const collectionSingular = 'transaction'
// const collectionPlural = 'transactions'

// const defineRoutes = function (server, mongoDb) {

// genericRoutes.get(server, mongoDb, collectionPlural)
// genericRoutes.getOne(server, mongoDb, collectionSingular, collectionPlural)

// genericRoutes.post(server, mongoDb, collectionPlural)
// Override genericRoutes because we need to convert incoming date/time into ISODate
// server.post('/' + collectionPlural, (req, res, next) => {

// const coreQuery = (apiKey) => {

// req.body.apiKey=apiKey
// insertOne only returns the new _id.  We want to return complete
// new document, which is what we originally requested to store
// with the new _id added to this.
// let retVal = req.body
// req.body.datetime = new Date(req.body.datetime)
// return mongoDb.collection(collectionPlural)
// .insertOne(req.body)
// .then(result => {
// retVal._id = result.insertedId.toString()
// res.json(retVal)
// }).catch(error => {
// res.json({error: error})
// })
// }

// authThenInvoke(req, res, coreQuery)
// })

// genericRoutes.put(server, mongoDb, collectionSingular, collectionPlural)
// Override genericRoutes because we need to convert incoming date/time into ISODate
// server.put('/' + collectionPlural + '/:id', (req, res, next) => {

// const coreQuery = (apiKey) => {

// return Promise.resolve()
// .then(result => {
// if (req.body.datetime) req.body.datetime = new Date(req.body.datetime)
// req.body.apiKey = apiKey
// return mongoDb.collection(collectionPlural).findOneAndUpdate(
// {'_id': ObjectId(req.params.id)},
// req.body,
// {returnOriginal: false}
// )
// .then(function resolve (result) {
// if (result.value === null) result.value = {error: collectionSingular + ' ' + req.params.id + ' does not exist'}
// res.json(result.value)
// }).catch(error => {
// res.json({'error': error})
// })
// })
// }
// authThenInvoke(req, res, coreQuery)
// })

// genericRoutes.delete(server, mongoDb, collectionSingular, collectionPlural)
// This differs from genericRoutes in that it must not delete if other
// foreign keys refer to it.  Presently, only distributions.
// Note: DELETE does not have a body, so find the currency_id in req.params
// server.del('/' + collectionPlural + '/:transaction_id', (req, res, next) => {

// const coreQuery = () => {
// new Promise((resolve, reject) => {

// const transactionId = ObjectId(req.params.transaction_id)
// mongoDb.collection('distributions').find({'transaction_id': transactionId}).toArray().then(result => {
// if (result.length === 0) {
// resolve(true)
// } else {
// let msg = 'Cannot delete this transaction because distributions refer to it'
// reject(msg)
// }
// })
// })
// .then((result) => {
// return mongoDb.collection(collectionPlural).findOneAndDelete({'_id': ObjectId(req.params.transaction_id)})
// .then(function resolve (result) {
// if (result.value === null) result.value = {error: collectionSingular + ' ' + req.params.transaction_id + ' does not exist'}
// res.json(result.value)
// })
// })
// .catch(error => {
// res.json({error: error})
/// })
// }
// authThenInvoke(req, res, coreQuery)
// })

/*
The transaction dashboard contains a list of all distributions for a particular transaction,
listed in no particular order, as well as other various joined fields such as a currency symbol.
In addition, we also want info from the transaction document itself.

More particularly, we want:

{
"transaction":{
"_id": ...,
"datetime": ...,
"note": ...
},
"distributions": {[
"_id": ...,
"account_id":"123",
"currency_id":"456",
"amount":500,
"transaction_id":"nnn",
"account":[
{"_id":"123","title":"Cash in Mattress"}
],
"currency":[
{"_id":"456","symbol":"RMB","title":"Ren Min Bi"}
]
]}
}

We produce this with two queries to the db.  One to get the transaction info, and one to get the distribution (and
joined) info.

Even though account and currency are arrays (cuz that's how mongo rolls), in this app, there should only
be exactly one of each.

*/
/* server.get('/transactions/dashboard/:transaction_id', (req, res, next) => {
let distributions
return mongoDb.collection('distributions')
.aggregate([
{$match: {transaction_id: ObjectId(req.params.transaction_id)}},
{
$lookup: {
from: 'accounts',
localField: 'account_id',
foreignField: '_id',
as: 'account'
}
},
{
$lookup: {
from: 'currencies',
localField: 'currency_id',
foreignField: '_id',
as: 'currency'
}
}
]).toArray()
.then(result => {
distributions = result
return mongoDb.collection('transactions').findOne({'_id': ObjectId(req.params.transaction_id)})
})
.then(result => {
res.json({'distributions': distributions, 'transaction': result})
}).catch(error => {
res.json({'error': error})
})
}) */
// }

// export default defineRoutes
