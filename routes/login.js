var express = require('express');
var router = express.Router();
var title_name = 'BANNAS'

// load model
var model = require('../model.js'), User  = model.User;

router.get('/', function(req, res, next) {
	res.render('login.ejs', { title: title_name, err_message:'' }); // pass dictionary obj to 'index.ejs'
});

router.post('/', function(req, res, next) {
    console.log('post login');
	var email    = req.body.email;
    var password = req.body.password;
    var query = { "email": email, "password": password };
	User.find(query, function(err, data){
        console.log(query)
		if(err) {
			console.log(err);
		}
		console.log(data);
        if(data == "") {
  			res.render('login.ejs', { title: title_name, err_message: 'User or Password not match!' }); // login failed
        }else{
            req.session.user = email;
            res.redirect('/');
        }
    });
});

module.exports = router;


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

