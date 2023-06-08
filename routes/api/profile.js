const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// GET Route ( Private | token needed) for api/profile/me
// Current User Profile
router.get('/me', auth, async (req, res) => {
  try {
    // req.user.id is the user id that comes from the token
    // .populate is for getting fields from user model
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'No Profile for this User' });
    }

    res.json(profile);
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
