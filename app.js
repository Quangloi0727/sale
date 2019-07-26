var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var sessionMiddleware=require('./middlewares/session.middleware');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Lang_nghe', {useNewUrlParser: true});
var app = express();
app.use(cookieParser('aaaaa'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))
app.use(sessionMiddleware);

app.use(express.static(path.join(__dirname, 'public')));
app.use("assets",express.static(__dirname +"/assets"));
app.use("fonts",express.static(__dirname +"/fonts"));
app.use("image_admin",express.static(__dirname +"/image_admin"));
app.use("images",express.static(__dirname +"/images"));
app.use("javascripts",express.static(__dirname +"/javascripts"));
app.use("scss",express.static(__dirname +"/scss"));
app.use("stylesheets",express.static(__dirname +"/stylesheets"));
app.use("vendor",express.static(__dirname +"/vendor"));
app.use("anhsp",express.static(__dirname +"/anhsp"));

app.use(express.urlencoded({ extended: false }));
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

module.exports = app;
