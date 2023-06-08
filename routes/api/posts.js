const express = require('express');
const router = express.Router();

// GET Route ( Public | no token needed) for api/posts
router.get('/', (req, res) => res.send('Posts Route'));

module.exports = router;
