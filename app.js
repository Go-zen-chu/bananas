var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();

var port_num = 13337;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// use is for using middlware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes');
app.use('/', routes.index);
//app.use('/users', users);


// error handlers======================

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// development error handler will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
// production error handler. no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//=====================================

var session = require('express-session');
// setting of mongo db
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

app.use(session({
    secret: 'secret',
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
		db: 'session',
        host: 'localhost',
        clear_interval: 60 * 60,
    }),
    cookie: {
        httpOnly: false,
        maxAge: new Date(Date.now() + 60 * 60 * 1000)
    },
	resave: true,
	saveUninitialized: true 
})); //追加

var loginCheck = function(req, res, next) {
    if(req.session.user){
      next();
    }else{
      res.redirect('/login');
    }
};

//app.get('/', loginCheck, routes.index);
//app.get('/login', routes.login);
//app.post('/add', routes.add);
//app.get('/logout', function(req, res){
//  req.session.destroy();
//  console.log('deleted sesstion');
//  res.redirect('/');
//});

module.exports = app;
app.listen(port_num);
