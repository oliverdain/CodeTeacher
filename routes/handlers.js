db = require('../db/db');
verbs = require('./verbs');

exports.review = function(req, res) {
  res.render('review', {});
};

exports.home = function(req, res) {
  res.render('home', {});
};


exports.newProject = function(req, res, next) {
  if (!req.body.proj_name) {
    next(new Error('Project name is required'));
  } else {
    var projName = req.body.proj_name.trim();
    if (projName.length === 0) {
      next(new Error('Project name can not be empty.'));
    } else {
      // The callback on successful DB creation.
      var onCreate = function(err) {
        if (err) {
          next(err);
        } else {
          res.redirect(
              verbs.routes('get', 'EDITOR') + projName);
        }
      };
      db.createNewProject(
          req.session.user, projName, req.body.description, onCreate);
    }
  }
}
