import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, MenuItem } from '@mui/material';
import axios from 'axios';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the categories!', error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('stock', stock);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
      // Reset form after successful submission
      setName('');
      setPrice('');
      setDescription('');
      setCategory('');
      setStock('');
      setImage(null);
    } catch (error) {
      console.error('There was an error adding the product!', error);
    }
  };

  return (
    <Container>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
          margin="normal"
          required
        >
          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          type="number"
          fullWidth
          margin="normal"
          required
        />
        <input
          accept="image/*"
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <Button variant="contained" color="primary" type="submit" style={{ marginTop: '20px' }}>
          Add Product
        </Button>
      </form>
    </Container>
  );
};

export default AddProduct;
