var mysql = require("mysql");
var conn = mysql.createConnection({
    host : "localhost",//34.83.191.45
    port : "3306",
    user : "root",
    password : "password",//seng401
    database : "showcase", //SHOWCASE

});

conn.connect(function(err) {
if(err) throw err;
console.log("Database connected successfully");
});
module.exports = conn;