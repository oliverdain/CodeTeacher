var handlers = require('./handlers');
var verbs = require('./verbs');
var auth = require('./auth');



////////////////////////////////////////////////////////////////////////////////
// Setup routes here.
////////////////////////////////////////////////////////////////////////////////

/**
 * All routes get set up from here.
 */
exports.setup = function(app) {
  auth.setup();

  ////////
  // All routes below this require autentication!
  ///////
  app.use(auth.requireAuth);
  verbs.get('EDITOR', '/edit/', ':proj/:datetime?',
      handlers.editor);
  verbs.get('HOME', '/', handlers.home);
};

