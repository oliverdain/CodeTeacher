var sqlite = require('sqlite3');
var path = require('path');

var db = new sqlite.Database(path.join(__dirname, 'db.sqlite'));

var setup = function() {
  db.serialize(function() {
    var users_table = 'CREATE TABLE IF NOT EXISTS users (' +
      'uname TEXT NOT NULL PRIMARY KEY, ' + 
      'fullname TEXT, ' +
      'email TEXT, ' +
      'role TEXT NOT NULL DEFAULT \'student\', ' +
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
        'grade INTEGER NOT NULL, ' +
        'comments TEXT, ' +
        'PRIMARY KEY(uname, assignment_id))';
    db.run(grades);

    var reviews = 'CREATE TABLE IF NOT EXISTS code_reviews (' +
        'uname TEXT NOT NULL, ' +
        'assignment_id INTEGER NOT NULL, ' +
        'file_name TEXT NOT NULL, ' +
        'code TEXT NOT NULL, ' +
        'comment_blocks TEXT, ' +
        'PRIMARY KEY(uname, assignment_id, file_name))';
    db.run(reviews);
  });
};

exports.getUserData = function(uname, cb) {
  db.get('select * from users where uname = ?', uname, cb);
};

exports.getAllUsers = function(cb) {
  db.all('select * from users', cb);
};


exports.registerUser = function(userdata, cb) {
  db.run('insert into users (uname, fullname, email, salt, passhash) ' +
      'values ($username, $fullname, $email, $salt, $pass)', userdata, cb);
};

exports.setNewPassHash = function(uname, salt, hash, cb) {
  db.run('update users set salt = ?, passhash = ? where uname = ?',
      salt, hash, uname, cb);
};

exports.getAssignmentData = function(assign_id, cb) {
  db.get('select * from assignments where id = ?', assign_id, cb);
};

exports.getSubmittedData = function(uname, assign_id, cb) {
  db.get('select * from student_work where uname = ? and assignment_id = ?',
      uname, assign_id, cb);
};

exports.getFileReviewData = function(uname, assign_id, fname, cb) {
  db.get('select code, comment_blocks from code_reviews where ' +
      'uname = ? and assignment_id = ? and file_name = ?',
      uname, assign_id, fname, cb);
};

exports.getAssignmentsNotSubmitted = function(uname, cb) {
  db.all('select id, name, template_url, due_datetime from ' +
      'assignments a left join student_work w on ' +
      '(a.id = w.assignment_id and w.uname = ?) where ' +
      'w.assignment_id is null', uname, cb);
};

exports.getUngradedAssignments = function(uname, cb) {
  db.all('select a.name, a.id, submitted_url, ' +
      'submitted_datetime, due_datetime from ' +
      '(student_work w join assignments a on (a.id = w.assignment_id and ' +
      'w.uname = ?)) left join grades g on ' +
      '(g.uname = w.uname and g.assignment_id = a.id) where ' +
      'g.uname is null', uname, cb);
};

exports.getGradedAssignments = function(uname, cb) {
  db.all('select a.name, g.* from grades g, assignments a where ' +
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

exports.changeAssignmentURL = function(assign_id, uname, url, cb) {
  db.run('update student_work set submitted_url = ?, ' +
      'submitted_datetime = datetime(\'now\', \'localtime\') where ' +
      'assignment_id = ? and uname = ?', url, assign_id, uname, cb);
};

exports.getAssignmentsThatNeedGrading = function(cb) {
  db.all('select sw.assignment_id, sw.uname, sw.submitted_url, ' +
      'sw.submitted_datetime, a.name, u.fullname, a.due_datetime ' +
      'from (student_work sw join users u on (u.uname = sw.uname)) ' +
      'left join grades g on ' +
      '(g.assignment_id = sw.assignment_id and g.uname = sw.uname) ' +
      'join assignments a on (a.id = sw.assignment_id) ' +
      'where submitted_datetime is not null and g.assignment_id is null', cb);
};

exports.addFileToCodeReview =  function(
    uname, assignment_id, file_name, code, cb) {
  db.run('insert into code_reviews (uname, assignment_id, file_name, code) ' +
      'values (?, ?, ?, ?)', uname, assignment_id, file_name, code, cb);
};

exports.getCRFiles = function(uname, assignment_id, cb) {
  db.all('select * from code_reviews where uname = ? and assignment_id = ?',
      uname, assignment_id, cb);
};

exports.saveCRComments = function(uname, assign_id, file_name, comments, cb) {
  db.run('update code_reviews set comment_blocks = ? where ' +
      'uname = ? and assignment_id = ? and file_name = ?',
      JSON.stringify(comments), uname, assign_id, file_name, cb);
};

exports.submitGrade = function(uname, assign_id, grade, comments, cb) {
  db.run('insert or replace into grades ' +
      '(uname, assignment_id, datetime, grade, comments) values ' +
      "(?, ?, datetime('now', 'localtime'), ?, ?)",
      uname, assign_id, grade, comments, cb);
};

exports.getAssignmentGrade = function(uname, assign_id, cb) {
  db.get('select * from grades where uname = ? and assignment_id = ?',
      uname, assign_id, cb);
};

exports.getGradesForStudent = function(uname, cb) {
  db.all('select * from assignments a, grades g, student_work sw where ' +
      'a.id = g.assignment_id and a.id = sw.assignment_id and ' +
      'g.uname = sw.uname and g.uname = ?', uname, cb);
};

setup();
