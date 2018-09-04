var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next){
  return res.render('update');
});

router.post('/', function(req, res, next){
  var newMessage = new Message({
    username: req.body.username,
    message: req.body.message
  });
  newMessage.save((err)=>{
    if(err) throw err;
    return res.redirect('/');
  });
});

module.exports = router;
