import React, { useState, useEffect } from 'react';
import * as yup from 'yup'; // gather absolutely everything from 'yup'
import axios from 'axios';
// import Styled from 'styled-components';

// const FlexWrapper = Styled.div`
//   display: flex;
//   flex-direction: column;
// `;

// const StyledInput = Styled.input`
//   text-align: center;
// `;

const formSchema = yup.object().shape({
  username: yup
    .string()
    .min(6, "Usernames must be at least 6 characters long."),
  email: yup
    .string()
    .email("Must be a valid email address.")
    .required("Must include email address."),
  password: yup
    .string()
    .required("Password is Required")
    .min(6, "Passwords must be at least 6 characters long."),
  tos: yup
    .boolean()
    .oneOf([true], "You must accept Terms and Conditions")
});

const initialForm = {
  username: '',
  password: '',
  email: '',
  tos: false
}

export default function Form() {
  const [formData, setFormData] = useState(initialForm)
  const [errors, setErrors] = useState({ username: '', password: '', email: '', tos: '' })
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [users] = useState([]);

  const setFormErrors = (name, value) => {
    yup.reach(formSchema, name).validate(value)
      .then(() => setErrors({ ...errors, [name]: '' }))
      .catch(err => setErrors({ ...errors, [name]: err.errors[0] }))
  }

  const onFormInputChange = event => {
    const { name, type, value, checked } = event.target;
    const valueToUse = type === 'checkbox' ? checked : value;
    setFormErrors(name, valueToUse);
    setFormData({ ...formData, [name]: valueToUse });
  }

  const onFormSubmit = event => {
    event.preventDefault();
    axios.post('https://reqres.in/api/users', formData)
      .then(res => {
        users.push(formData);
        setFormData(initialForm);
      })
      .catch(err => {
        console.log('Axios POST Catch');
      })
  }

  useEffect(() => {
    formSchema.isValid(formData).then(valid => setSubmitDisabled(!valid));
  }, [formData]) // run effect when formData is changed - make submit button valid only if formData follows formSchema structure

  return (
    <div>
      <h3>Add User:</h3>
      <form className='form-component' onSubmit={onFormSubmit}>
        <input
          name='username'
          value={formData.username}
          onChange={onFormInputChange}
          placeholder='username'
        />
        <input
          name='password'
          value={formData.password}
          onChange={onFormInputChange}
          placeholder='password'
        />
        <input
          name='email'
          value={formData.email}
          onChange={onFormInputChange}
          placeholder='email'
        />
        <label>
        Terms of Service:
        <input type='checkbox'
          name='tos'
          checked={formData.tos}
          onChange={onFormInputChange}
        />
        </label>
        <input type='submit'
          disabled={submitDisabled}
        />
      </form>
      <div className='error-div' style={{ color: 'red' }}>
        <div>{errors.username}</div>
        <div>{errors.email}</div>
        <div>{errors.password}</div>
        <div>{errors.tos}</div>
      </div>
      <h3>Users:</h3>
      <div className='users-div' style={{ border: '1px solid crimson' }}>
      {
        // hindsight should've added another component here and added proper styling
        users.map(user => {
          return (
            <div key={user.username /* hack to get 'unique key' warning to go away; make sure users can't enter multiple of same key though, as that can be potentially even more problematic */}>
              <h4>User: {user.username}</h4>
              <h4>Pass: {user.password}</h4>
              <h4>Email: {user.email}</h4>
            </div> 
          )
        })
      }
      </div>
    </div>
  )
}