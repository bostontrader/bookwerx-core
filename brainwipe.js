const MongoClient = require('mongodb').MongoClient

const bookwerxConstants = require('./app/constants')

if (!process.env.BW_MONGO) {
  console.log(bookwerxConstants.NO_CONNECTION_TO_MONGODB_DEFINED)
  process.exit(1)
}

// We don't want to run this test on any db that's not explicitly marked for testing lest we inadvertently cause serious dain bramage.
if (!process.env.BW_TEST) {
  console.log(bookwerxConstants.NOT_CONFIGURED_AS_TEST)
  process.exit(1)
}

run().catch(error => console.error(error))

async function run () {
  const mongoDb = await MongoClient.connect(process.env.BW_MONGO)

  // We want to drop the db in order to start with a fresh-slate.
  await mongoDb.dropDatabase()

  // What's holding this process open?  Why doesn't it just stop on its own?  Probably mongo.
  process.exit(0)
}
