var db = require('../db/db');
var verbs = require('./verbs');
var async = require('async');
var _ = require('underscore');

exports.review = function(req, res) {
  res.render('review', {});
};

exports.home = function(req, res) {
  console.assert(req.session !== null);
  console.assert(req.session.user !== null);

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

exports.submitAssignment = function(req, res, next) {
  var inputErrorMsg = null;
  if (!req.body.url) {
    inputErrorMsg = 'Can not submit an assignment without a URL';
  }
  var url = req.body.url.trim();
  if (url.length === 0) {
    inputErrorMsg = 'Can not submit an assignment without a URL';
  }
  var urlRegex = /^https?:\/\//;
  if (!urlRegex.test(url)) {
    inputErrorMsg = url + ' does not start with "http" as expected';
  }

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
