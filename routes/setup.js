var handlers = require('./handlers');
var verbs = require('./verbs');
var auth = require('./auth');



////////////////////////////////////////////////////////////////////////////////
// Setup routes here.
////////////////////////////////////////////////////////////////////////////////

/**
 * All routes get set up from here.
 */
exports.setup = function() {
  auth.setup();
  verbs.get('EDITOR', '/edit', auth.requireAuth, handlers.editor);
};

