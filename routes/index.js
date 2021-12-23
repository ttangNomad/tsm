var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.get('/', (req , res, next) => {
  res.redirect('index');
})

router.get('/bom_main', (req, res, next) => {
  res.render('BOMMain');
})

router.get('/bom_master_setting', (req, res, next) => {
  res.render('BOMMaster');
})

router.get('/injection_planning', (req, res, next) => {
  res.render('InjectionPlanning');
})

router.get('/decoration_planning', (req, res, next) => {
  res.render('DecorationPlanning');
})

module.exports = router;