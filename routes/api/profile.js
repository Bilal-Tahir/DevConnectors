const express = require('express');
const router = express.Router();
const request = require('request');
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

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
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST Profile Route ( Private | token needed) for api/profile/

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is Required').not().isEmpty(),
      check('skills', 'Skills is Rrequired').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build Profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills)
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    console.log(profileFields.skills);

    //Build Social Object
    //If we donot initialize this then it will give social undefined error while calling profileFields.social.youtube
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update if present
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //Create
      profile = new Profile(profileFields);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
    res.send('Hello');
  }
);

// Get Request (Public) | api/profile
// Get all Profiles
router.get('/', async (req, res) => {
  try {
    let profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET a Specific User Profile By ID
// Public Route
// api/profile/user/:user_id
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile)
      return res
        .status(400)
        .json({ msg: 'No Profile for this User is available' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);

    // If the user enters an invalid length of user_id then it will return server error
    // For that we are checking that if the kind of error is related to object id
    // We will still send the No Profile error
    if (err.kind == 'ObjectId')
      return res
        .status(400)
        .json({ msg: 'No Profile for this User is available' });

    res.status(500).send('Server Error');
  }
});

// Delete ( Privat ) request api/profile
// Delete profile, user and post

router.delete('/', auth, async (req, res) => {
  try {
    // remove users posts

    // remove user profiles
    await Profile.findOneAndRemove({ user: req.user.id });

    // remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User Deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT request (Private) to api/profile/experience
// Add Profile experience
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From Date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Delete User Profile Experience (Private)
// api/profile/expeience/:exp_id

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // No need for this as experinece won't show if we have no profile
    if (!profile)
      return res.status(400).json({ msg: 'User Profile does not exist' });

    //Function implemeted in course
    // const removeIndex = profile.experience
    //   .map((item) => item.id)
    //   .indexOf(req.params.exp_id);
    // profile.experinece.splice(removeIndex, 1);

    const filteredExperience = profile.experience.filter(
      (exp) => exp.id !== req.params.exp_id
    );

    profile.experience = filteredExperience;
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT request (Private) to api/profile/education
// Add Profile education
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
      check('from', 'From Date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Delete User Profile Education (Private)
// api/profile/education/:edu_id

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // No need for this as experinece won't show if we have no profile
    if (!profile)
      return res.status(400).json({ msg: 'User Profile does not exist' });

    //Function implemeted in course
    // const removeIndex = profile.education
    //   .map((item) => item.id)
    //   .indexOf(req.params.edu_id);
    // profile.education.splice(removeIndex, 1);

    const filteredEducation = profile.education.filter(
      (edu) => edu.id !== req.params.edu_id
    );

    profile.education = filteredEducation;
    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get user github repo | Public Request as anyone can see other's profile
// api/profile/github/:user_name

router.get('/github/:user_name', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.user_name
      }/repos?per_page=5&
      sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No github profile found' });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
