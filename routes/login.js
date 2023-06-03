var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var account = require('../model/account');
const Cryptography = require('./cryptography');

//Passport setup
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/login/google/callback',
        scope: [ 'profile' ]
    },
    async (accessToken, refreshToken, profile, cb) => {
        //Getting account info for verifying its existence
        try {
            var user = await account.findOne({
                profileID: profile.id,
                provider: profile.provider
            });

            //Creating the user if not yet registered
            if(!user) {
                var crypto = new Cryptography();
                var key = crypto.encrypt(Cryptography.generateKey());
                user = await account.create({
                    profileID: profile.id,
                    provider: profile.provider,
                    key: key
                });
            }
        } catch(error) {
           console.log(error);
        }

        cb(null, user);
    }
));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((userId, done) => done(null, userId));

router.get('/', (req, res, next) => {
    if (req.body.failed == undefined)
        res.redirect('/login/google');
    else if (req.body.failed == true)
        res.render('error');
});

// GET Google OAuth handling
router.get('/google', passport.authenticate('google'));

// GET Google OAuth handling
router.get('/google/callback', passport.authenticate('google', {
    successReturnToOrRedirect: '/dashboard',
    failureRedirect: '/login?failed=true'
}));

module.exports = router;