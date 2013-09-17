var sqlite = require('sqlite3');
var path = require('path');

var db = new sqlite.Database(path.join(__dirname, 'db.sqlite'));

var setup = function() {
  db.serialize(function() {
    var users_table = 'CREATE TABLE IF NOT EXISTS users (' +
      'uname TEXT NOT NULL PRIMARY KEY, ' + 
      'fullname TEXT, ' +
      'email TEXT, ' +
      'salt TEXT, ' +
      'passhash TEXT NOT NULL)';

    db.run(users_table);
  });
};

exports.getUserData = function(uname, cb) {
  db.get('select * from users where uname = ?', uname, cb);
}

exports.registerUser = function(userdata, cb) {
  console.log('registerUser called with:');
  console.dir(userdata);
  db.run('insert into users (uname, fullname, email, salt, passhash) ' +
      'values ($username, $fullname, $email, $salt, $pass)', userdata, cb);
}

setup();
