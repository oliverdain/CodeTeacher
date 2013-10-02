var db = require('../db/db');
var verbs = require('../routes/verbs');
var crypto = require('crypto');
var async = require('async');

var isAuthenticated = function(req) {
  if (req.session && req.session.user) {
    return true;
  } else {
    return false;
  }
}

var login = function(req, res, next) {
  res.render('login', {flash: req.flash('error')});
}

var logout = function(req, res, next) {
  req.session = {};
  res.redirect(verbs.routes('get', 'LOGIN'));
}

// Constants for use with crypto.pbkdf2
var HASH_ITERS = 2000;
var HASH_LENGTH = 256;
var SALT_LENGTH= 256;

var auth = function(req, res, next) {
  var storedHash;
  var role;

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
          // Copy to closure-captured storedHash variable so I can access it
          // futher down.
          storedHash = data.passhash;
          role = data.role;
          getPassHash(req.body.password, data.salt, callback);
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
            req.session.role = role;
            res.redirect(verbs.routes('get', 'HOME'));
          } else {
            console.info('Bad password for %s', req.body.username);
            req.flash('error',  'Incorrect password');
            res.redirect(verbs.routes('get', 'LOGIN'));
          }
        }
      });
};

// This may be poorly named. It just sets the submitted user's password to the
// given value. Note that we first ensure that the user is logged in and is a
// teacher.
var passReset = function(req, res, next) {
  console.log('passReset called with: %s', req.body);
  var salt;
  async.waterfall([
      function(cb) {
        requireAuth(req, res, cb);
      },
      function(cb) {
        if (req.session.role != 'teacher') {
          cb('Error! You are NOT the teacher!');
        } else {
          salt = getSalt();
          getPassHash(req.body.newPass, salt, cb);
        }
      },
      function(passHash, cb) {
          db.setNewPassHash(req.body.uname, salt,
            passHash.toString('hex'), cb);
      }
      ],

      function(err, result) {
        if (err) {
          res.send('Error: ', err);
        } else {
          res.send('SUCCESS');
        }
      });
};

var register = function(req, res, next) {
  var errs = req.flash('error');
  res.render('register', {flash: errs});
};

var getSalt = function() {
  return crypto.randomBytes(SALT_LENGTH).toString('hex');
};

var getPassHash = function(pass, salt, cb) {
  crypto.pbkdf2(pass, salt, HASH_ITERS, HASH_LENGTH, cb);
};

var onRegister = function(req, res, next) {
  try {
    var username = req.body.username.trim();
    var pwd = req.body.password.trim();

    var errors = false;
    if (username.length === 0) {
      req.flash('error', 'Username can not be blank');
    }

    if (pwd.length === 0) {
      req.flash('error', 'Password can not be blank');
    }

    if (errors) {
      res.redirect(verbs.routes('get', 'REGISTER'));
    } else {
      var salt = getSalt();
      async.waterfall([
          function(cb) {
            getPassHash(pwd, salt, cb);
          },

          function(passHash, cb) {
            db.registerUser({
              $username: username,
              $fullname: req.body.fullname.trim(),
              $email: req.body.email.trim(),
              $salt: salt,
              $pass: passHash.toString('hex')}, cb);
          }
      ], function(err, dbResult) {
        if (err) {
          console.log('Errors adding new user to the database:');
          console.dir(err);
          if (err.errno === 19 && err.code === 'SQLITE_CONSTRAINT') {
            req.flash('error', 'This username is already in use.');
          } else {
            req.flash('error', err.toString());
          }
          res.redirect(verbs.routes('get', 'REGISTER'));
        } else {
          res.redirect(verbs.routes('get', 'HOME'));
        }
      });
    }
  } catch (e) {
    console.log('Caught error: %s', e);
    req.flash('error', e.toString());
    res.redirect(verbs.routes('get', 'REGISTER'));
  }
};

var requireAuth = function(req, res, next) {
  if (isAuthenticated(req)) {
    next();
  } else {
    res.redirect(verbs.routes('get', 'LOGIN'));
  }
};
exports.requireAuth = requireAuth;

exports.requireTeacher = function(req, res, next) {
  if (req.session && req.session.role &&
      req.session.role === 'teacher') {
    next();
  } else {
    res.send('Disallowed. You are not a teacher.');
  }
};


exports.setup = function() {
  verbs.post('REGISTER', '/register', onRegister);
  verbs.get('REGISTER', '/register', register);
  verbs.post('AUTH', '/auth', auth);
  verbs.get('LOGIN', '/login', login);
  verbs.get('LOGOUT', '/logout', logout);
  verbs.post('PASS_RESET', '/pass_reset', passReset);
}
