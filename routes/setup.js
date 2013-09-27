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

  app.get('*', auth.requireAuth);
  app.post('*', auth.requireAuth);

  ///////////////////////////////////////////////
  // All routes below this require autentication!
  ///////////////////////////////////////////////
  verbs.get('REVIEW', '/review', handlers.review);
  verbs.get('HOME', '/', handlers.home);
  verbs.post('SUBMIT_ASSIGN', '/submit_assignment', handlers.submitAssignment);
  verbs.post('RESUBMIT_ASSIGN', '/resubmit_assignment',
      handlers.changeAssignmentURL);
  verbs.post('CREATE_CR', '/create_cr', handlers.createCR);
  verbs.post('ADD_CODE_TO_REVIEW', '/add_to_review', handlers.addCodeToReview);
};

