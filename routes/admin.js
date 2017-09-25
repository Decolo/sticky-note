var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res) {
  if (req.user) {
    res.render('admin', { 
      title: 'Sticky-Note',
      user: req.session.user
    })
  } else {
    res.redirect('/')
  }
})

module.exports = router
