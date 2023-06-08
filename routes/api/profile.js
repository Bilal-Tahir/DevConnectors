const express = require('express');
const router = express.Router();

// GET Route ( Public | no token needed) for api/profile
router.get('/', (req, res) => res.send('Profile Route'));

module.exports = router;
