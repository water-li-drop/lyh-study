var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/hello', function(req, res, next) {
    res.send('The time is ' + new Date().toString());
});
router.get('/user/:username', function(req, res, next) {
    res.send('name: ' + req.params.username);
})
router.get('/index/:name', function(req, res, next) {
    res.render('test', {
        name: req.params.name,
        title: 'index'
    });
});
module.exports = router;