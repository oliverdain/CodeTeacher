var db = require('../db/db');
var verbs = require('../routes/verbs');
var crypto = require('crypto');
var async = require('async');

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

// Constants for use with crypto.pbkdf2
var HASH_ITERS = 2000;
var HASH_LENGTH = 256;
var SALT_LENGHT = 256;

var auth = function(req, res, next) {
  var storedHash;
  async.waterfall([
      _.partial(db.getUserData, req.body.username),

      function(data, next) {
        // Copy to closure-captured storedHash variable so I can access it
        // futher down.
        storedHash = data.passhash;
        crypto.pbkdf2(
          req.body.password, data.salt, HASH_ITERS, HASH_LENGTH, next);
      }],

      function(err, computedHash) {
        computedHash = computedHash.toString('hex');

        if (err) {
          console.warn('Error checking user credentials:\n%s', err);
          req.flash('error', err);
          res.redirect(verbs.routes('get', 'LOGIN'));
        }

        if (computedHash === storedHash) {
          console.info('User password is correct. Authenticated.');
          req.session.user = req.body.username;
          res.redirect('/');
        } else {
          console.info('Bad password for %s', req.body.username);
          req.flash('error',  'Incorrect password');
          res.redirect(verbs.routes('get', 'LOGIN'));
        }
      });
};


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
