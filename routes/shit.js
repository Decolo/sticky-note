var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(1)
  res.send('respond with a resource');
});
router.get('/:user_id', function(req, res, next) {
  console.log(2)
  // User.getInfo(req.path)
  res.send('heihiehie');
});

module.exports = router;