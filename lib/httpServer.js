const http = require("http");

function createHttpServer(app) {
  /**
   * Get port from environment and store in Express.
   */

  var port = normalizePort(process.env.PORT || "3000");

  app.set("port", port);

  /**
   * Create HTTP server.
   */

  var server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port);
  server.on("error", onError);
  server.on("listening", onListening);

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== "listen") {
      throw error;
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error("Nie masz uprawnień do uruchomienia aplikacji.");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(`Aplikacja jest już uruchomiona. Zatrzymaj aplikację, aby uruchomić ją ponowanie.`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log(`Server HTTP działa! Aplikacja dostępna jest pod adresem http://localhost:${addr.port}`);
  }
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

module.exports = createHttpServer;
