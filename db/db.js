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

    var projects_table = 'CREATE TABLE IF NOT EXISTS projects (' +
      'id TEXT NOT NULL PRIMARY KEY, ' +
      'uname TEXT NOT NULL, ' +
      'name TEXT NOT NULL, ' +
      'description TEXT)';
    db.run(projects_table);

    var projects_uname_idx = 'CREATE INDEX IF NOT EXISTS ' +
      'project_uname ON projects (uname)';
    db.run(projects_uname_idx);

    var versions_table = 'CREATE TABLE IF NOT EXISTS versions (' +
      'project_id TEXT NOT NULL, ' +
      'datetime TEXT NOT NULL, ' +
      'data TEXT NOT NULL, ' +
      'PRIMARY KEY(project_id, datetime))';
    db.run(versions_table);

    var assignments_table = 'CREATE TABLE IF NOT EXISTS assignments (' +
        'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
        'project_id TEXT NOT NULL, ' +
        'datetime TEXT NOT NULL, ' +
        'start_datetime TEXT NOT NULL, ' +
        'due_datetime TEXT NOT NULL, ' +
        'name TEXT NOT NULL)';
    db.run(assignments_table);

    var assignments_index = 'CREATE INDEX IF NOT EXISTS ' +
      'assignments_project ON assignments (project_id, datetime)';
    db.run(assignments_index);

    var student_work_table = 'CREATE TABLE IF NOT EXISTS student_work (' +
        'assignment_id INTEGER NOT NULL, ' +
        'uname TEXT NOT NULL, ' +
        // The project_id/version links to the versions table. datetime is NULL
        // if the user hasn't yet submitted their assignment. Once submitted,
        // datetime indicates which revision they're submitting.
        'project_id TEXT NOT NULL, ' +
        'datetime TEXT, ' +
        'PRIMARY KEY (assignment_id, uname))';
    db.run(student_work_table);

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
