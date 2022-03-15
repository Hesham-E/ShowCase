var mysql = require("mysql");
var conn = mysql.createConnection({
    host : "",
    port : "",
    user : "",
    password : "",
    database : "showCaseDB",

});

conn.connect(function(err) {
if(err) throw err;
console.log("Database connected successfully");
});
module.exports = conn;