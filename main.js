const app = require('./lib/app');
const createHttpServer = require('./lib/httpServer');
const {connectToDatabase} = require('./lib/database');

async function start() {
  await connectToDatabase({
    user: 'app',
    password: 'app',
    database: 'magazyn2022',
    server: 'localhost'
  });

  createHttpServer(app);
}

start()

