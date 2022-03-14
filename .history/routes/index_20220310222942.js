var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.get('/login', function(req, res, next) {
  res.render('login', { title: 'Log In' });
});

app.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/');
});

app.get('/login-success', function (req, res, next) {
  res.send('<p>You successfully logged in. <a href="/protected-route">Go to protected route</a></p>')
});

app.get("/login-failure", function (req, res, next) {
  res.send(
    '<p>You successfully logged in. <a href="/protected-route">Go to protected route</a></p>'
  );
});

module.exports = router;
