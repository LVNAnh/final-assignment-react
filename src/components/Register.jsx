import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    age: '',
    password: '',
    email: '',
    phone: '',
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const navigate = useNavigate();

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
        setSnackbarMessage('Đăng ký thành công!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Đợi 2 giây trước khi điều hướng đến trang đăng nhập
      })
      .catch(error => {
        setSnackbarMessage('Đã có lỗi xảy ra khi đăng ký. Vui lòng thử lại!');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
        console.error('There was an error registering!', error);
      });
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
