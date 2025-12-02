const express = require('express');
const router = express.Router();

// Example sub-route
router.use('/example', require('./example'));

module.exports = router;
