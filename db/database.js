const mysql = require('mysql');

const sqlConnection = {
  host: 'localhost',
  user: 'root',
  password: process.env.mysqlPwd,
  database: 'musicStream',
};

const connection = mysql.createConnection(sqlConnection);

connection.connect((err) => {
  if (err) console.log(err)
  else console.log('Succesfully connected to mysql');
});

module.exports = connection;
