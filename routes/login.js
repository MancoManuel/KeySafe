var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var account = require('../model/account');

//Passport setup
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:5500/login/google/callback',
        scope: [ 'profile' ]
    },
    async (accessToken, refreshToken, profile, cb) => {
        //Getting account info for verifying its existence
        var user = await account.findOne({
            userID: profile.id,
            provider: profile.provider
        });

        //Creating the user if not yet registered
        if(!user) {
            user = await account.create({
                userID: profile.id,
                provider: profile.provider
            });
        }

        cb(null, user);
    }
));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((userId, done) => done(null, userId));

// GET Google OAuth handling
router.get('/google', passport.authenticate('google'));

// GET Google OAuth handling
router.get('/google/callback', passport.authenticate('google', {
    successReturnToOrRedirect: '/dashboard',
    failureRedirect: '/login?failed=true'
}));

module.exports = router;