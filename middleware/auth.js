const jwt = require('jsonwebtoken');
const config = require('config');

// a miiddleware function contains req and res cycle and next which is a callback function to run another piece of middleware.
module.exports = (req, res, next) => {
  // Firstly, get the token from request header
  const token = req.header('x-auth-token');

  //check if the user is not login | token is not available
  if (!token) {
    // 401 status for unauthorized user
    return res.status(401).json({ msg: 'Not Authorized' });
  }

  // if the token is available then we need to verify the token
  try {
    // to decode | verify the token we need to pass the token with our custom set secret key
    const decode = jwt.verify(token, config.get('jwtSecretKey'));

    // decode will have a user object having user id as we have passed it while setting the token in user file
    req.user = decode.user;
    next();
  } catch (err) {
    // if any error due to token not valid
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
