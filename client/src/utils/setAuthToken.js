// Take the token if it is available add in the header
// we are not making any call with axios here we are just making global header
import axios from 'axios';

// If we have a token we will send it with every token
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
