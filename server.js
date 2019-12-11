/**
 * Main Express Application: set up express app
 */

'use strict';

// require third-party node modules
const express = require('express');
const sslRedirect = require('heroku-ssl-redirect');
const ejsLayouts = require('express-ejs-layouts');
const compression = require('compression');
const bodyParser = require('body-parser');
const helmet = require('helmet')
const http = require('http');

// env variables
const { NODE_ENV } = process.env;

// server
function server() {

  // require custom middleware
  const shutdown = require('./middleware/shutdown');

  // set up express app
  const app = express();
  const newServer = http.createServer(app);

  // enable ssl redirect in production
  app.use(sslRedirect());

  // only log requests in development
  NODE_ENV === 'development' ? app.use(require('morgan')('dev')) : null;

  // add middleware and they must be in order
  app.use(compression()); // GZIP all assets
  app.use(helmet()); // protect against vulnerabilities
  app.use(bodyParser.json()); // raw application/json
  app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded

  // only secure in production
  if (NODE_ENV === 'production')
    app.set('trust proxy', 1); // get ip address using req.ip

  // custom middleware
  app.use(shutdown.middleware); // stops here if server is in the middle of shutting down

  // set view engine to EJS
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/public'));
  app.use(ejsLayouts); // use express layouts
  app.set('layout', 'layouts/auth');
  app.set('layout extractScripts', true);

  // set up routes
  const router = require('./routes')(); // grab routes
  app.use('/', router); // place routes here

  // error middleware MUST GO LAST
  return newServer; // return newServer
}

module.exports = server(); // return server app for testing
