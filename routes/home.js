var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
  if (!req.user) {
    res.render('home', { 
      title: 'Welcome',
      user: req.user
    })
  } else {
    res.redirect('/admin')
  }
})
module.exports = router