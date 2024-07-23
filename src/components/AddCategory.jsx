import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/categories', formData)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error adding the category!', error);
      });
  };

  return (
    <Container>
      <Typography variant="h4">Add Category</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="Name" name="name" onChange={handleChange} fullWidth margin="normal" />
        <Button type="submit" variant="contained" color="primary">Add Category</Button>
      </form>
    </Container>
  );
};

export default AddCategory;
