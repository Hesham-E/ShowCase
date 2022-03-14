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
const { connect } = require('http2');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// app.set("view engine", "ejs");

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
      host: "127.0.0.1",
      port: 3306,
      user: "seng401",
      password: "",
      database: "user_cookies",
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
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
  user: "seng401",
  password: "",
  port: 3306,
  database: "showcase_users",
  multipleStatements: true,
});

connection.connect(function(err) {
  if (!err) {
    console.log("Connected");
  } else {
    console.log("Failed to connect: " + err.message);
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

const strategy = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);

passport.serializeUser((user, done) => {
  console.log("Inside serializer");
  done(null, user.id);
});

passport.deserializeUser(function(userID, done) {
  console.log("Deserialize user: " + userID);
  connection.query('SELECT * FROM users WHERE id = ?', [userID], function(error, results) {
    done(null, results[0]);
  });
});

function validPassword(password, hash, salt) {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
  return hash === hashVerify;
}

function generatePassword(password) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 60, 'sha512').toString('hex');
  return {salt: salt, hash: genHash};
}

function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/not-authorized');
  }
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin == 1) {
    next();
  } else {
    res.redirect('/not-authorized-admin');
  }
}

function userExists(req, res, next) {
  connection.query('SELECT * FROM users WHERE username = ?', [req.body.username], function(error, results, fields) {
    if (error) {
      console.log('Error');
    } else if (results.length > 0) {
      res.redirect('/user-already-exists');
    } else {
      next();
    }
  });
}

app.get('/login', function (req, res, next) {
  res.render('login', { title: 'Log In' });
});

app.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/');
});

app.get('/login-success', function (req, res, next) {
  res.send(
    '<p>You successfully logged in. <a href="/protected-route">Go to protected route</a></p>'
  );
});

app.get('/login-failure', function (req, res, next) {
  res.send("You entered the wrong password.");
});

app.get('/register', function (req, res, next) {
  res.render("register");
});

app.post('/register', userExists, function (req, res, next) {
  const saltHash = generatePassword(req.body.password);
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  connection.query(
    "INSERT INTO users(username, hash, salt, isAdmin) values(?,?,?,0)",
    [req.body.username, hash, salt],
    function (error, results, fields) {
      if (error) {
        console.log("Registration error");
      } else {
        console.log('Successfully entered');
      }
    }
  );
  res.redirect('/login');
});

app.post('/login', passport.authenticate('local', {failureRedirect: '/login-failure', successRedirect: '/login-success'}));

app.get('/protected-route', isAuth, function(req, res, next) {
  res.send('<h1>Authenticated!</h1><p><a href="/logout">Log out</p>');
});

app.get('/admin-route', isAdmin, function (req, res, next) {
  res.send('<h1>Admin!</h1><p><a href="/logout">Log out</p>');
});

app.get('/not-authorized', function(req, res, next) {
  res.send('<h1>Error 401: Not authorized!</h1><p><a href="/login">Log in to view</p>');
});

app.get('/not-authorized-admin', function (req, res, next) {
  res.send(
    '<h1>Error 401: Not an authorized admin!</h1><p><a href="/login">Log in to view</p>'
  );
});

app.get('/not-authorized-admin', function (req, res, next) {
  res.send(
    '<h1>Error 401: Not an authorized admin!</h1><p><a href="/login">Log in to view</p>'
  );
});

app.get("/user-already-exists", function (req, res, next) {
  res.send(
    '<h1>Error: User already exists!</h1><p><a href="/register">Register with a different username</p>'
  );
});

// export { userExists, generatePassword, passport };

module.exports = app;
