const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
});

// Create the "dashboard" database if it doesn't already exist
connection.query('CREATE DATABASE IF NOT EXISTS dashboard', (err) => {
  if (err) throw err;
  console.log('Database created');
});

// Connect to the "dashboard" database
connection.query('USE dashboard', (err) => {
  if (err) throw err;
  console.log('Using database: dashboard');
});

// Create the "mentors" table
connection.query(`
  CREATE TABLE IF NOT EXISTS mentors (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    PRIMARY KEY (id)
  )`, (err) => {
    if (err) throw err;
    console.log('Mentors table created');
  });

// Create the "students" table
connection.query(`
  CREATE TABLE IF NOT EXISTS students (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    mentor_id INT,
    evaluated_by INT,
    PRIMARY KEY (id),
    FOREIGN KEY (mentor_id) REFERENCES mentors(id),
    FOREIGN KEY (evaluated_by) REFERENCES mentors(id)
  )`, (err) => {
    if (err) throw err;
    console.log('Students table created');
  });

// Create the "student_marks" table
connection.query(`
  CREATE TABLE IF NOT EXISTS student_marks (
    id INT NOT NULL AUTO_INCREMENT,
    student_id INT NOT NULL,
    idea_marks INT DEFAULT 0,
    execution_marks INT DEFAULT 0,
    presentation_marks INT DEFAULT 0,
    communication_marks INT  DEFAULT 0,
    total_marks INT AS (idea_marks + execution_marks + presentation_marks + communication_marks) STORED,
    PRIMARY KEY (id),
    FOREIGN KEY (student_id) REFERENCES students(id)
  )`, (err) => {
    if (err) throw err;
    console.log('Student marks table created');
  });

module.exports = connection;