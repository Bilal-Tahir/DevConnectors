import { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';
// import axios from 'axios';

const Register = ({ setAlert }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const { name, email, password, password2 } = formData;

  const onChangeHandler = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  const onSubmitFormHandler = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      // console.log('Password is incorrect');
      // setting alert from redux
      // we have a class in App.css for different alert-types like .alert-success or .aler-danger
      setAlert('Password is incorrect', 'danger');
    } else {
      console.log(formData);

      // The Code is example not the way we will submit data

      // const newUser = {
      //   name,
      //   email,
      //   password,
      // };
      // try {
      //   const config = {
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   };
      //   const body = JSON.stringify(newUser);

      //   const res = await axios.post('/api/users', body, config);
      //   console.log(res.data);
      // } catch (error) {
      //   console.error(error);
      // }
    }
  };
  return (
    <>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fa fa-user'></i> Create Your Account
      </p>
      <form className='form' onSubmit={(e) => onSubmitFormHandler(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={(e) => onChangeHandler(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={(e) => onChangeHandler(e)}
            required
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={(e) => onChangeHandler(e)}
            minLength='6'
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={(e) => onChangeHandler(e)}
            minLength='6'
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
};

// When we import it we have to export it this way
// It takes 2 things
// 1. Any state you want to map
// 2. Second is object with any actions we want to use
// {setAlert} is gonna let us do props.setAlert
// It's alternative would be useSelector
export default connect(null, { setAlert })(Register);
