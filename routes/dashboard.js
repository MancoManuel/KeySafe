var express = require('express');
var router = express.Router();

let passwords = [
  {
    account: "google", 
    password: "prova1234"
  }, 
  {
    account: "facebook",
    password: "ciao123456"
  }
];

/* GET users listing. */
router.get('/', function(req, res, next) {
  var response = {"passwords": passwords, "success": 0};
  res.render('dashboard', response);
});

router.post('/', function(req, res, next) {
  var action = req.body.action;
  var success = 0;
  if (action == "add") {
    var account = req.body.account;
    var password = req.body.password;
    passwords.push({account: account, password: password});
    success = 1;
  } else if (action == "edit") {
    var index = req.body.index;
    var password = req.body.password;
    passwords[index].password = password;
  } else if (action == "delete") {
    var index = req.body.index;
    passwords.splice(index, 1);
  }

  var response = {passwords: passwords, success: success};
  res.render('dashboard', response);
});

module.exports = router;
