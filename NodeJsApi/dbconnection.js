var mysql = require("mysql");
var conn = mysql.createConnection({
    host : "34.83.191.45",//34.83.191.45
    port : "3306",
    user : "root",
    password : "seng401",//seng401
    database : "SHOWCASE",

});

conn.connect(function(err) {
if(err) throw err;
console.log("Database connected successfully");
});
module.exports = conn;