_ = require('underscore');
handlers = require('./handlers');

var app;

////////////////////////////////////////////////////////////////////////////////
// In order to make sure we can easily move routes around, we map each route
// to a symbolic value (kinda like an enum) in app.locals.routes. That way,
// a template that needs a link to the editor can link to the value of
// routes.get.EDITOR instead of hard coding the path. This makes it easy to
// change paths later.
//
// The following methods setup get, post, etc. methods that work like the
// standard node methods but also append the paths to app.locals using a
// symbolic name.
////////////////////////////////////////////////////////////////////////////////


/**
 * Used by get, post, etc. below.
 *
 * @param {function} verb app.get, app.post, or whatever the verb is
 *
 * @param {Array} args an array such that args.slice(1) returns the correct arguments to
 * app.get, app.post, etc. (e.g. the 1st value in the slice is the path and the
 * rest are functions to call.
 */
var applyVerb = function(verb, args) {
  console.log('applyVerb called');
  args = _.toArray(args);
  console.log('Calling apply on %s with %s', verb, args.slice(1));
  verb.apply(app, args.slice(1));
};


var get = function(name, path) {
  console.log('get called.');
  applyVerb(app.get, arguments);
  app.locals.routes.get[name] = path;
};

////////////////////////////////////////////////////////////////////////////////
// Setup routes here.
////////////////////////////////////////////////////////////////////////////////

/**
 * All routes get set up from here.
 */
exports.setup = function(nodeApp) {
  app = nodeApp;
  app.locals.routes = {
    get: {},
    post: {}
  };

  get('EDITOR', '/edit', handlers.editor);
};

