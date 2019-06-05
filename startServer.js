const server = require('./app/server.js')
const bookwerxConstants = require('./app/constants.js')

if (!process.env.BW_PORT) {
  console.log(bookwerxConstants.NO_LISTENING_PORT_DEFINED)
  process.exit(1)
}

if (!process.env.BW_MONGO) {
  console.log(bookwerxConstants.NO_CONNECTION_TO_MONGODB_DEFINED)
  process.exit(1)
}

server.start(process.env.BW_PORT, process.env.BW_MONGO)
