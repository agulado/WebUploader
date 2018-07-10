var router = require('express').Router();

router.get('/', function(req, res) {
	res.render('demo_amd.html');
});

module.exports = router;