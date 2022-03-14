var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const mysql = require('mysql');
const crypto = require('crypto');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');
app.set("view engine", "ejs");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(
  session({
    key: "showcase_session_cookie",
    secret: "showcase_session_cookie_secret",
    store: new MySQLStore({
      host: 'localhost',
      port: 3306,
      user: 'root',
      database: 'user_cookies'
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000*60*60*24,
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "user",
  multipleStatements: true
});

connection.connect((err) => {
  if (!err) {
    console.log("Connected");
  } else {
    console.log("Failed to connect");
  }
});

const customFields = {
  usernameField: 'username',
  passwordField: 'password',
};

const verifyCallback = (username, password, done) => {
  connection.query('SELECT * FROM users WHERE username = ?', [username], function(error, results, fields) {
    if (error) {
      return done(error);
    }

    if (results.length == 0) {
      return done(null, false);
    }

    const isValid = validPassword(password, results[0].hash, results[0].salt);
    user = {id: results[0].id, username: results[0].username, hash: results[0].hash, salt: results[0].salt};
    if (isValid) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}

module.exports = app;
