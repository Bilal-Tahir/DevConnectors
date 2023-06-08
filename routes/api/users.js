const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

//Bring the user model
const User = require('../../models/User');

// GET Route ( Public | no token needed) for api/users
router.get('/', (req, res) => res.send('User Route'));

//POST Route ( Public | no token needed) for registering users | api/users
router.post(
  '/',
  [
    check('name', 'Please provide with valid name').not().isEmpty(),
    check('email', 'Please provide with a valid email').isEmail(),
    check(
      'password',
      'Please provide with a valid password with minimum of 6 characters'
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    //checking if there is any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // 400 status is for bad request as we can't send 200 (ok) status
      return res.status(400).json({ error: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if the user exists
      let user = await User.findOne({ email }); // similar to {email: email} // it also returns promise so we can also do .then.catch

      if (user) {
        return res
          .status(400)
          .json({ error: [{ msg: 'User already exists' }] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt Password
      const salt = await bcrypt.genSalt(10);
      //It will create a has and will put that into user.password
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // res.send('User Registered');

      // Return jsonwebtoken
      const payload = {
        user: {
          // This user.id is from db and moongose converts it from user._id
          id: user.id,
        },
      };

      // now we need to signin
      // first arg is payload | data
      // Second argument is secret key | It could be any | defined in config default.json
      // third is optional for expiry time of token | it might be 3600 (1 hour) in production
      // then we are getting a callback function with err, token as param if err will throw err or return the token in json
      // in res you can send anything acc to project req
      jwt.sign(
        payload,
        config.get('jwtSecretKey'),
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          // with this token that will be returned if we paste it in jwt.io it will give info like in payload it will give user_id bcz we give it only user.id and other properties like expiry time
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
    }

    // // In orger to display req.body on console we need middleware that will parse the object.
    // // Written in server.js file (PARSER 1)
    // console.log(req.body);
    // res.send('OK');
  }
);

module.exports = router;
