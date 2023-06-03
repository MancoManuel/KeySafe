var express = require('express');
var router = express.Router();
var accounts = require('../model/account');
var passwords = require('../model/password');
var Cryptography = require('./cryptography');

const passwordList = [{
	service: "Google",
	accountName: "manu",
	password: "ciao"
}];

/* GET users listing. */
router.get('/', (req, res, next) => {
	if (req.session.passport === undefined)
		res.redirect('/login/google');
	else {
		//const passwordList = await findPasswords(req, await getCrypto(req));
		var response = { passwords: passwordList, success: 0 };
		res.render('dashboard', response);
	}
});

router.post('/', async (req, res, next) => {
	var userCrypto = await getCrypto(req);
	var action = req.body.action;
	var success = 0;
	if (action == "add") {
		success = -1;
		var service = req.body.service;
		var found = await passwords.findOne({
			service: service,
			userID: req.session.passport.user
		});

		if (!found) {
			await passwords.create({
				service: service,
				accountName: req.body.account,
				password: userCrypto.encrypt(req.body.password),
				userID: req.session.passport.user
			});
			success = 1;
		} else success = 2;
	} else if (action == "edit") {
		var pwd = await passwords.findOne({
			service: req.body.service,
			userID: req.session.passport.user,
		});

		if (pwd) {
			pwd.accountName = req.body.account;
			pwd.password = userCrypto.encrypt(req.body.password);
			await passwords.updateOne(pwd);
		}
	} else if (action == "delete") {
		await passwords.deleteOne({
			userID: req.session.passport.user,
			service: req.body.service
		});
	}

	const passwordList = await findPasswords(req, userCrypto);
	var response = { passwords: passwordList, success: success };
	res.render('dashboard', response);
});

async function findPasswords(req, userCrypto) {
	var passwordList = await passwords.find({ userID: req.session.passport.user }).cursor().toArray();
	for (let i = 0; i < passwordList.length; i++)
		passwordList[i].password = userCrypto.decrypt(passwordList[i].password);
	return passwordList;
}

async function getCrypto(req) {
	var crypto = new Cryptography();
	var user = await accounts.findById(req.session.passport.user);
	var userKey = crypto.decrypt(user.key);
	return new Cryptography(userKey);
}

module.exports = router;
