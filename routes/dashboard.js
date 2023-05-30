var express = require('express');
var router = express.Router();
var passwords = require('../model/password');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const passwordList = await findPasswords(req);
  var response = {passwords: passwordList, success: 0};
  res.render('dashboard', response);
});

router.post('/', async (req, res, next) => {
  var action = req.body.action;
  var success = 0;
  console.log("Action: " + action);
  if (action == "add") {
    var account = req.body.account;
    var password = req.body.password;
    await passwords.create({
      accountName: account,
      password: password,
      userID: req.session.passport.user
    });
    success = 1;
  } else if (action == "edit") {
    var pwd = await passwords.findOne({
      userID: req.session.passport.user,
      accountName: req.body.account
    });
    console.log("Password: " + pwd);
    pwd.password = req.body.password;
    await passwords.updateOne(pwd);
  } else if (action == "delete") {
    await passwords.deleteOne({
      userID: req.session.passport.user,
      account: req.body.account
    });
  }

  const passwordList = await findPasswords(req);
  var response = {passwords: passwordList, success: success};
  res.render('dashboard', response);
});

function findPasswords(req) {
  return passwords.find({userID: req.session.passport.user}).cursor().toArray();
}

module.exports = router;
