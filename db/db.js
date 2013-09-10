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

setup();
