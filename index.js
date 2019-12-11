/**
 * Run the server and cluster. Main entry point
 */

'use strict';

// built-in node modules
const os = require('os');
const fs = require('fs');
const path = require('path');

// require third-party node modules
const throng = require('throng'); // concurrency

// env variables
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT ? Number(process.env.PORT) : 8003;
const PROCESSES = NODE_ENV === 'production' ? (process.env.WEB_CONCURRENCY || os.cpus().length) : 1; // number of cores

// function to start app
function startApp(processId) {
  // create server
  const server = require('./server'); // get app

  // shutdown
  const { gracefulExit } = require('./middleware/shutdown');

  console.log(`process.env.NODE_ENV: ${ NODE_ENV }`);

    // listen server
  server.listen(PORT, () => {
    console.log(`Process ID: ${ processId } - Server started on port ${ PORT }`);

    // on terminate command: killall node
    process.on('SIGTERM', () => {
      console.log(`Process ${ processId } exiting...`);

      // gracefully exit server
      gracefulExit(server);
    });
  });
  return false;
}

// run concurrent workers
throng({
  workers: PROCESSES, // Number of workers (cpu count)
  lifetime: Infinity, // ms to keep cluster alive (Infinity)
  grace: 5000 // ms grace period after worker SIGTERM (5000)
}, startApp);
