/**
 * All routes are placed in this file
 * All urls if multiple words will use dashes
 */

'use strict';

// require built-in node modules
const fs = require('fs');
const path = require('path');

// require third-party modules
const express = require('express');
var router = express.Router();

// variables
const CONTROLLER_DIR = './controllers'; // app directory
const CONTROLLER_FILES = fs.readdirSync(CONTROLLER_DIR).filter(f => f.indexOf('.js') >= 0); // grab all js files

// require controller routes
const ROUTES = CONTROLLER_FILES.map(f => require(`${CONTROLLER_DIR}/${f}`).route);

module.exports = () => {

  // All app routes are automatically inserted here
  ROUTES.forEach(r => router = r(router));
  router.all('/*', (req, res) => res.redirect('/'));

  // return router
  return router;
}
