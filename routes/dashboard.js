var express = require('express');
var router = express.Router();
var accounts = require('../model/account');
var passwords = require('../model/password');
var Cryptography = require('./cryptography');

var userCrypto;

/* GET users listing. */
router.get('/', async (req, res, next) => {
	if (req.session.passport === undefined)
		res.redirect('/login/google');
	else {
		if (!userCrypto) {
			var crypto = new Cryptography();
			var user = await accounts.findById(req.session.passport.user);
			var userKey = crypto.decrypt(user.key);
			userCrypto = new Cryptography(userKey);
		}

		const passwordList = await findPasswords(req);
		var response = { passwords: passwordList, success: 0 };
		res.render('dashboard', response);
	}
});

router.post('/', async (req, res, next) => {
	var action = req.body.action;
	var success = 0;
	if (action == "add") {
		var account = req.body.account;
		var found = await passwords.findOne({
			accountName: account,
			userID: req.session.passport.user
		});

		if (!found) {
			await passwords.create({
				accountName: account,
				password: userCrypto.encrypt(req.body.password),
				userID: req.session.passport.user
			});
			success = 1;
		}
	} else if (action == "edit") {
		var pwd = await passwords.findOne({
			userID: req.session.passport.user,
			accountName: req.body.account
		});

		pwd.password = userCrypto.encrypt(req.body.password);
		await passwords.updateOne(pwd);
	} else if (action == "delete") {
		await passwords.deleteOne({
			userID: req.session.passport.user,
			accountName: req.body.account
		});
	}

	const passwordList = await findPasswords(req);
	var response = { passwords: passwordList, success: success };
	res.render('dashboard', response);
});

async function findPasswords(req) {
	var passwordList = await passwords.find({ userID: req.session.passport.user }).cursor().toArray();
	for (let i = 0; i < passwordList.length; i++)
		passwordList[i].password = userCrypto.decrypt(passwordList[i].password);
	return passwordList;
}

module.exports = router;
