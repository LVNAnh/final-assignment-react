import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Register from './components/Register';
import Login from './components/Login';
import AddProduct from './components/AddProduct';
import AddCategory from './components/AddCategory';
import Shop from './components/Shop';

const App = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            MyApp
          </Typography>
          <Button color="inherit" component={Link} to="/shop">Shop</Button>
          <Button color="inherit" component={Link} to="/register">Register</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/add-product">Add Product</Button>
          <Button color="inherit" component={Link} to="/add-category">Add Category</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/shop" element={<Shop />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/add-category" element={<AddCategory />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
