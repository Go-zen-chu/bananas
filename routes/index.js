var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'BANANAS', err_message:'' }); // pass dictionary obj to 'index.ejs'
});

router.get('/main',  function(req, res, next) {
  res.render('main.ejs', { title: 'BANANAS' }); // pass dictionary obj to 'index.ejs'
});

//app.get('/', loginCheck, routes);
//app.get('/login', routes.login);
//app.post('/add', routes.add);
//app.get('/logout', function(req, res){
//  req.session.destroy();
//  console.log('deleted sesstion');
//  res.redirect('/');

module.exports = router;

// load model
var model = require('../model.js'), User  = model.User;

// after successing logging in
module.exports.index = function(req, res){
    res.render('index', { user: req.session.user});
    console.log(req.session.user);
};

// register user
module.exports.add = function(req, res){
    var newUser = new User(req.body);
    newUser.save(function(err){
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            res.redirect('/');
        }
    });
};

// login function
module.exports.login = function(req, res){
    console.log('login');
	var email    = req.query.email;
    var password = req.query.password;
    var query = { "email": email, "password": password };
    User.find(query, function(err, data){
        if(err){
            console.log(err);
        }
		console.log(data);
        if(data == ""){
  			res.render('index.ejs', { title: 'BANANAS', err_message: 'User or Password not match!' });
            //res.render('/'); // login failed
        }else{
            req.session.user = email;
            res.redirect('/main');
        }
    });
};

