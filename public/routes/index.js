const express = require('express');
const router = express.Router();

// Get Homepage
router.get('/', function(req, res) {
   res.render('index');
});

module.exports = router;
