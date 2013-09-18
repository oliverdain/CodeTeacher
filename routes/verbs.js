_ = require('underscore');

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
 * @param {Array} args an arr * @param {Array} args the arguments passed to the
 * get, post, etc. methods below. args[0] is therefore the name to give the
 * route and it is ignored.  args[1] should be the path. args[2] may be the
 * matchers for the path or the 1st callback function, etc.
 */
var applyVerb = function(verb, args) {
  var args = _.toArray(args);
  if (_.isString(args[2])) {
    // Concatenate the path strings (args[1] and args[2]), and then tack on the
    // rest of the array which holds the callback functions.
    args = [args[1] + args[2]].concat(args.slice(3));
  } else {
    args = args.slice(1);
  }
  verb.apply(app, args);
};


/**
 * Registers a get route and gives it a name. This can be called in one of two
 * ways as illustrated by the following examples:
 *
 * 1) get('PATH', '/foo', cb1, cb2): sets cb1 and cb2 as middleware handlers for
 * the route '/foo'. Sets app.locals.routes.get.PATH === '/foo'.
 *
 * 2) get('PATH', '/foo/', ':id/:name', cb1, cb2). This is just like the above,
 * except it registers the route '/foo/:id/:name. However, since :id and :name
 * can't be used "as-is" in templates and such, this sets
 * app.locals.routes.get.PATH === '/foo' *wihtout* the :id and :name parameters.
 */
exports.get = function(name, path) {
  applyVerb(app.get, arguments);
  app.locals.routes.get[name] = path;
};

/**
 * See get above.
 */
exports.post = function(name, path) {
  applyVerb(app.post, arguments);
  app.locals.routes.post[name] = path;
};

/**
 * Method to allow modules that don't have access to app.locals to find routes
 * by name.
 */
exports.routes = function(verb, name) {
  return app.locals.routes[verb][name];
}

exports.init = function(nodeApp) {
  app = nodeApp;

  app.locals.routes = {
    get: {},
    post: {}
  };
}
