import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCategory = () => {
  const [formData, setFormData] = useState({ name: '' });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('There was an error fetching the categories!', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/categories', formData)
      .then(response => {
        toast.success('Danh mục đã được thêm thành công');
        setFormData({ name: '' });
        fetchCategories();
      })
      .catch(error => {
        console.error('There was an error adding the category!', error);
        toast.error('Có lỗi xảy ra khi thêm danh mục');
      });
  };

  return (
    <Container>
      <Typography variant="h4">Thêm danh mục</Typography>
      <form onSubmit={handleSubmit}>
        <TextField 
          label="Tên" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          fullWidth 
          margin="normal" 
        />
        <Button type="submit" variant="contained" color="primary">Thêm danh mục</Button>
      </form>

      <ToastContainer />

      <Typography variant="h5" style={{ marginTop: '20px' }}>Danh sách danh mục</Typography>
      <ul>
        {categories.map((category) => (
          <li key={category._id}>{category.name}</li>
        ))}
      </ul>
    </Container>
  );
};

export default AddCategory;
