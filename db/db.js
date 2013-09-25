var sqlite = require('sqlite3');
var path = require('path');

var db = new sqlite.Database(path.join(__dirname, 'db.sqlite'));

var setup = function() {
  db.serialize(function() {
    var users_table = 'CREATE TABLE IF NOT EXISTS users (' +
      'uname TEXT NOT NULL PRIMARY KEY, ' + 
      'fullname TEXT, ' +
      'email TEXT, ' +
      'role TEXT NOT NULL, ' +
      'salt TEXT, ' +
      'passhash TEXT NOT NULL)';
    db.run(users_table);

    var assignments_table = 'CREATE TABLE IF NOT EXISTS assignments (' +
        'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
        'name TEXT NOT NULL, ' +
        'template_url TEXT NOT NULL, ' +
        'due_datetime TEXT NOT NULL)';
    db.run(assignments_table);

    var student_work_table = 'CREATE TABLE IF NOT EXISTS student_work (' +
        'assignment_id INTEGER NOT NULL, ' +
        'uname TEXT NOT NULL, ' +
        'submitted_url TEXT, ' +
        'submitted_datetime TEXT, ' +
        'PRIMARY KEY (assignment_id, uname))';
    db.run(student_work_table);

    var grades = 'CREATE TABLE IF NOT EXISTS grades (' +
        'uname TEXT NOT NULL, ' +
        'assignment_id INTEGER NOT NULL, ' +
        'datetime TEXT NOT NULL, ' +
        'PRIMARY KEY(uname, assignment_id))';
    db.run(grades);
  });
};

exports.getUserData = function(uname, cb) {
  db.get('select * from users where uname = ?', uname, cb);
};

exports.registerUser = function(userdata, cb) {
  db.run('insert into users (uname, fullname, email, salt, passhash) ' +
      'values ($username, $fullname, $email, $salt, $pass)', userdata, cb);
};

exports.getAssignmentsNotSubmitted = function(uname, cb) {
  db.all('select id, name, template_url, due_datetime from ' +
      'assignments a left join student_work w on ' +
      '(a.id = w.assignment_id and w.uname = ?) where ' +
      'w.assignment_id is null', uname, cb);
};

exports.getUngradedAssignments = function(uname, cb) {
  db.all('select a.name, submitted_url, submitted_datetime from ' +
      'student_work w, assignments a where a.id = w.assignment_id and ' +
     'uname = ?', uname, cb);
};

exports.getGradedAssignments = function(uname, cb) {
  db.all('select a.name, uname from grades g, assignments a where ' +
      'g.assignment_id = a.id and g.uname = ?', uname, cb);
};

exports.getFullName = function(uname, cb) {
  db.get('select fullname from users where uname = ?', uname, cb);
};

exports.submitAssignment = function(uname, assign_id, url, cb) {
  db.run('insert into student_work ' +
      '(uname, assignment_id, submitted_url, submitted_datetime) VALUES ' +
      "(?, ?, ?, datetime('now', 'localtime'))", uname, assign_id, url, cb);
};

exports.getAssignmentsThatNeedGrading = function(cb) {
  db.all('select * from (student_work sw join users u on (u.uname = sw.uname)) ' +
        'left join grades g on (g.assignment_id = sw.assignment_id) ' +
      'where submitted_datetime is not null and g.assignment_id is null', cb);
};

setup();
