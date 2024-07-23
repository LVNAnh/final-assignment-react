import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    age: '',
    password: '',
    email: '',
    phone: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/users/register', formData)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error registering!', error);
      });
  };

  return (
    <Container>
      <Typography variant="h4">Register</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="First Name" name="firstname" onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Last Name" name="lastname" onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Age" name="age" type="number" onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Email" name="email" type="email" onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Phone" name="phone" onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Password" name="password" type="password" onChange={handleChange} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary">Register</Button>
      </form>
    </Container>
  );
};

export default Register;
