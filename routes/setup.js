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
  verbs.get('HOME', '/', handlers.home);
  verbs.post('SUBMIT_ASSIGN', '/submit_assignment', handlers.submitAssignment);
  verbs.post('RESUBMIT_ASSIGN', '/resubmit_assignment',
      handlers.changeAssignmentURL);
  verbs.get('CODE_REVIEW', '/cr/', ':uname/:assign_id', handlers.cr);
  verbs.get('FILE_REVIEW', '/file_review/', ':uname/:assign_id/:fname', handlers.fileReview);
  verbs.get('FILE_REVIEW_CONTENT', '/file_review_content/', ':uname/:assign_id/:fname',
      handlers.fileReviewContent);
  verbs.post('ADD_CODE_TO_REVIEW', '/add_to_review', handlers.addCodeToReview);
};

