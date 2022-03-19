var mysql = require("mysql");
var conn = mysql.createConnection({
    host : "localhost",
    port : "3306",
    user : "root",
    password : "password",
    database : "showcase",

});

conn.connect(function(err) {
if(err) throw err;
console.log("Database connected successfully");
});
module.exports = conn;