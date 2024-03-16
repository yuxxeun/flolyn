const mysql = require('mysql');

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '', 
  database: 'flolyn'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL...');
  });

module.exports = db;