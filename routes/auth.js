var db = require('../db/db');
var verbs = require('../routes/verbs');

var isAuthenticated = function(req) {
  if (req.session && req.session.user) {
    console.log('Current user: %s', req.session.user);
    return true;
  } else {
    console.log('No user set in the session.');
    return false;
  }
}

var login = function(req, res, next) {
  res.render('login', {});
}

var auth = function(req, res, next) {
  req.session.user = req.body.username;
  req.session.user = req.body.username;
  res.redirect('/');
}

exports.requireAuth = function(req, res, next) {
  if (isAuthenticated(req)) {
    next();
  } else {
    res.redirect(verbs.routes('get', 'LOGIN'));
  }
}

exports.setup = function() {
  verbs.get('LOGIN', '/login', login);
  verbs.post('AUTH', '/auth', auth);
}
