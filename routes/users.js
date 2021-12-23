var express = require('express');
var router = express.Router();

router.get('/login', (req, res, next) => {
    res.render('Login');
})

router.post('/login', (req, res, next) => {

})

router.get('/logout', (req, res, next) => {
    res.redirect('/users/login')
})

module.exports = router;