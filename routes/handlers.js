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

