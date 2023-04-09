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
  var account = req.body.account;
  var password = req.body.password;
  console.log("Account: " + account + ", password: " + password);

  //passwords.push({account: account, password: password});
  var response = {passwords: passwords, success: 1};
  res.render('dashboard', response);
});

module.exports = router;
