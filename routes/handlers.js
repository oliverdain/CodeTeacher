var db = require('../db/db');
var verbs = require('./verbs');
var async = require('async');
var _ = require('underscore');

exports.home = function(req, res, next) {
  console.assert(req.session !== null);
  console.assert(req.session.user !== null);

  if (req.session.role === 'teacher') {
    getTeacherHome(req, res, next);
    return;
  } 

  async.parallel([
      _.bind(db.getAssignmentsNotSubmitted, db, req.session.user),
      _.bind(db.getUngradedAssignments, db, req.session.user),
      _.bind(db.getGradedAssignments, db, req.session.user),
      _.bind(db.getFullName, db, req.session.user)
      ],

      function(err, allResults) {
        if (err) {
          console.error('Error: %s', err);
          console.dir(err);
          res.send('Error: ' + err);
        } else {
          console.assert(allResults.length === 4);

          var renderData = {
            notstarted: allResults[0],
            submitted: allResults[1],
            graded: allResults[2],
            fullname: allResults[3].fullname
          };
          res.render('home', renderData);
        }
      });
};

var getTeacherHome = function(req, res, next) {
  async.parallel([
      db.getAssignmentsThatNeedGrading,
      db.getAllUsers
    ],

    function(err, results) {
      console.assert(results.length === 2);

      if (err) {
        next(err);
      } else {
        res.render('teacher_home', {
          needGrading: results[0],
          allUsers: results[1]
        });
      }
    });
};

var validateSubmittedURL = function(url) {
  var inputErrorMsg = null;
  if (!url) {
    inputErrorMsg = 'Can not submit an assignment without a URL';
  }
  url = url.trim();
  if (url.length === 0) {
    inputErrorMsg = 'Can not submit an assignment without a URL';
  }
  var urlRegex = /^https?:\/\//;
  if (!urlRegex.test(url)) {
    inputErrorMsg = url + ' does not start with "http" as expected';
  }

  return {url: url, err: inputErrorMsg};
};

exports.submitAssignment = function(req, res, next) {
  var urlRes = validateSubmittedURL(req.body.url);
  var inputErrorMsg = urlRes.err;
  var url = urlRes.url;

  if (!req.body.assign_id) {
    inputErrorMsg = 'Can not submit an assignment without an id';
  }
  var assignId = parseInt(req.body.assign_id);
  if (! _.isNumber(assignId) || _.isNaN(assignId)) {
    inputErrorMsg = 'Invalid assignment id: ' + assignId;
  }
  
  if (inputErrorMsg !== null) {
    next(new Error(inputErrorMsg));
  } else {
    db.submitAssignment(req.session.user, assignId, url, function(err, result) {
      if (err) {
        next(err);
      } else {
        res.redirect(verbs.routes('get', 'HOME'));
      }
    });
  }
};

exports.changeAssignmentURL = function(req, res, next) {
  var urlRes = validateSubmittedURL(req.body.url);
  var inputErrorMsg = urlRes.err;
  var url = urlRes.url;

  if (!req.body.assign_id) {
    inputErrorMsg = 'Can not submit an assignment without an id';
  }
  var assignId = parseInt(req.body.assign_id);
  if (! _.isNumber(assignId) || _.isNaN(assignId)) {
    inputErrorMsg = 'Invalid assignment id: ' + assignId;
  }
  
  if (inputErrorMsg !== null) {
    next(new Error(inputErrorMsg));
  } else {
    db.changeAssignmentURL(assignId, req.session.user, url, function(err, result) {
      if (err) {
        next(err);
      } else {
        res.redirect(verbs.routes('get', 'HOME'));
      }
    });
  }
};

exports.cr = function(req, res, next) {
  async.parallel([
      _.partial(db.getUserData, req.params.uname),
      _.partial(db.getAssignmentData, req.params.assign_id)],

  function(err, results) {
    if (err) {
      next(err);
      return;
    }
    
    res.render('cr', {
      student: results[0],
      assign: results[1]
    });
  });
}

exports.addCodeToReview = function(req, res, next) {
  var b = req.body;
  db.addFileToCodeReview(b.uname, b.assign_id, b.fname, b.code, function(err) {
    if (err) {
      next(err);
    } else {
      res.send('SUCCESS');
    }
  });
};

exports.fileReview = function(req, res, next) {
  res.render('file_review', {review: req.params});
};

exports.fileReviewContent = function(req, res, next) {
  db.getFileReviewData(req.params.uname, req.params.assign_id, req.params.fname,
      function(err, result) {
        if (err) {
          next(err);
        } else {
          console.assert(result && result.code);
          res.json(result);
        }
      });
};
