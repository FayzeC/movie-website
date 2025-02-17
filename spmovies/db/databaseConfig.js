const mysql = require("mysql");

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

var dbconnect = {
    getConnection: function () {
  
      var conn = mysql.createConnection({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        // retain DATE as a string
        dateStrings: true
      });
      // returns connection object
      return conn;
    }
};

module.exports = dbconnect;
