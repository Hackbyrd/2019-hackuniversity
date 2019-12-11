/**
 * HOME CONTROLLER
 */

'use strict';

// environment variables
const { NODE_ENV, API_URL, HOST } = process.env; // grab environment variables
const ENV = { NODE_ENV, API_URL, HOST }; // store environment variables in ENV variable

module.exports = {
  route, // specify the route
  home
}

// the route for this page
function route(router) {
  router.all('/', home);
  return router;
}

// controller for this page
function home(req, res) {
  return res.render('index', {
    ENV: JSON.stringify(ENV), // pass environment variables to html
    title: 'Hack University',
    page: 'home',
    url: `${HOST}`,
    layout: 'layout' // change layout
  });
}