import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/users/login', formData)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error logging in!', error);
      });
  };

  return (
    <Container>
      <Typography variant="h4">Login</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Email" name="email" type="email" onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Password" name="password" type="password" onChange={handleChange} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary">Login</Button>
      </form>
    </Container>
  );
};

export default Login;
