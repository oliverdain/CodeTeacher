db = require('../db/db');

exports.editor = function(req, res) {
  res.render('edit', {});
};

exports.home = function(req, res) {
  res.render('home', {});
};


exports.newProject = function(req, res, next) {
  db.getNewProjectId(function(err, newId) {
    if (err) {
      next(err);
    } else {
      req.projectId = newId;
      exports.editor(req, res);
    }
  });
}
