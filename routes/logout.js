var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
    req.logout(() => {
        delete req.session;
        res.redirect('/');
    });
});

module.exports = router;