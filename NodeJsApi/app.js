
// var createError = require('http-errors');
const express = require('express');
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const { body } = require('express-validator');


app.use(bodyParser.urlencoded({extender : false}));
app.use(bodyParser.json());

const connectionString = {
  host : "localhost",//34.83.191.45
  port : "3306",
  user : "root",
  password : "password",
  database : "showcase",

};

  const connection = mysql.createConnection(connectionString);

  app.listen(3306, () => {
    console.log("Server is running! YESSSSSSSS");
  });

// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./router.js');








// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// module.exports = app;
