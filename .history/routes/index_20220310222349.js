var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.get('/login', function(req, res, next) {
  res.render('login', { title: 'Log In' });
});

app.get("/logout", function (req, res, next) {
  res.render("logout", { title: "Log In" });
});

module.exports = router;
