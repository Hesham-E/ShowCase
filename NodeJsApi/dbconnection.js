var mysql = require("mysql");
var conn = mysql.createConnection({
    host : "localhost", // 34.83.191.45
    port : "3306", //3306
    user : "root", //root
    password : "password", //seng401
    database : "showcase", //showcase

});

conn.connect(function(err) {
if(err) {
    console.log("error connecting database");
   // throw err;
} else{
    console.log("Database connected successfully");
}

});
module.exports = conn;