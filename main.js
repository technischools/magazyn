const app = require('./lib/app');
const createHttpServer = require('./lib/httpServer');
const {connectToDatabase} = require('./lib/database');

async function start() {
  await connectToDatabase();

  createHttpServer(app);
}

start()

