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
  res.render('login', {flash: req.flash('error')});
}

// Constants for use with crypto.pbkdf2
var HASH_ITERS = 2000;
var HASH_LENGTH = 256;
var SALT_LENGHT = 256;

var auth = function(req, res, next) {
  var storedHash;

  async.waterfall([
      // For the life of me, I can't figure out why this is necessary!  This is
      // equivalent to _.partial(db.getUserData, req.body.username), but somehow
      // that does some very strange things with waterfall if sqlite returns
      // undefined (e.g. the username wasn't found). This fixes it for some
      // reason.
      function(callback) {
        db.getUserData(req.body.username, function(err, data) {
          if (err) {
            callback(err);
          } else {
            callback(null, data);
          }
        });
      },

      function(data, callback) {
        if (data === undefined) {
          callback(new Error('Username not found'));
        } else  {
          console.log('Data is: %s', data);
          console.dir(data);
          // Copy to closure-captured storedHash variable so I can access it
          // futher down.
          storedHash = data.passhash;
          crypto.pbkdf2(
            req.body.password, data.salt, HASH_ITERS, HASH_LENGTH, callback);
        }
      }],

      function(err, computedHash) {
        if (err) {
          console.warn('Error checking user credentials:\n%s', err);
          req.flash('error', err.toString());
          res.redirect(verbs.routes('get', 'LOGIN'));
        } else {
          computedHash = computedHash.toString('hex');
          if (computedHash === storedHash) {
            console.info('User password is correct. Authenticated.');
            req.session.user = req.body.username;
            res.redirect('/');
          } else {
            console.info('Bad password for %s', req.body.username);
            req.flash('error',  'Incorrect password');
            res.redirect(verbs.routes('get', 'LOGIN'));
          }
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
