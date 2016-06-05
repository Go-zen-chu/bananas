var express = require('express');
var router = express.Router();

// a middleware function with no mount path. This code is executed for every request to the router
//router.use(function (req, res, next) {
//  console.log('Time:', Date.now());
//    next();
//	});
//}

router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'BANANAS' }); // pass dictionary obj to 'index.ejs'
});

module.exports = router;

/*モデル読み込み*/
var model = require('../model.js'),
    User  = model.User;

/*ログイン後ページ*/
exports.index = function(req, res){
    res.render('index', { user: req.session.user});
    console.log(req.session.user);
};

/*ユーザー登録機能*/
exports.add = function(req, res){
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

/*ログイン機能*/
exports.login = function(req, res){
    var email    = req.query.email;
    var password = req.query.password;
    var query = { "email": email, "password": password };
    User.find(query, function(err, data){
        if(err){
            console.log(err);
        }
        if(data == ""){
            res.render('login');
        }else{
            req.session.user = email;
            res.redirect('/');
        }
    });
};
