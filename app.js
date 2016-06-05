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

// defining session for logging in  
var session = require('express-session');
// setting of mongo db for saving login info
//var MongoStore = require('connect-mongo')(session);
//var mongoose = require('mongoose');

app.use(session({
    secret: 'secret',
    //store: new MongoStore({
    //    mongooseConnection: mongoose.connection,
	//	db: 'session',
    //    host: 'localhost',
    //    clear_interval: 60 * 60,
    //}),
    cookie: {
        httpOnly: false,
        maxAge: new Date(Date.now() + 30 * 60 * 1000) // 30min
    },
	resave: false,
	saveUninitialized: false 
}));

var util = require('util'); // for debuggin purpose

var sessionCheck = function(req, res, next) {
    console.log('session check');
    if(req.session.user){
		console.log(util.inspect(req.session,false,null));
    	res.redirect('/main'); // login successful
    }else{
	  next();
    }   
};

// a middleware function with no mount path. This code is executed for every request to the router 
//app.use(function (req, res, next) {
//	console.log('Time:', Date.now());
//  	next();
//});

var routes_main = require('./routes/main.js');
app.use('/main', routes_main);
var routes_index = require('./routes/index.js');
app.use('/', sessionCheck, routes_index); // '/' has to be defined at last otherwise it handles all kind of url 
//app.use('/users', users);

// error handlers (have to be defined after routes otherwise they show err anytime)
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



module.exports = app;
app.listen(port_num);
