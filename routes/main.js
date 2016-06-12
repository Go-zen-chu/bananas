var express = require('express');
var router = express.Router();
var title_name = 'BANANAS'

router.get('/', function(req, res, next) {
  console.log('main get');
  res.render('main.ejs', { title: title_name });
});

router.post('/', function(req, res, next) {
});

module.exports = router;
