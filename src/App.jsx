import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, IconButton, Menu, MenuItem, Badge } from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import axios from 'axios';
import Register from './components/Register';
import Login from './components/Login';
import AddProduct from './components/AddProduct';
import AddCategory from './components/AddCategory';
import Shop from './components/Shop';
import Cart from './components/Cart';
import { CartProvider, CartContext } from './components/CartContext'; // Import CartContext
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  // Load user information from localStorage on page reload
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Router>
      <CartProvider user={user}>
        <MainContent
          user={user}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          categories={categories}
          anchorEl={anchorEl}
          handleMenuClick={handleMenuClick}
          handleMenuClose={handleMenuClose}
        />
      </CartProvider>
    </Router>
  );
};

const MainContent = ({ user, handleLogin, handleLogout, categories, anchorEl, handleMenuClick, handleMenuClose }) => {
  const navigate = useNavigate();
  const { cartItems } = React.useContext(CartContext); // Use CartContext

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button 
            component={Link} 
            to="/shop" 
            variant="h6" 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              padding: '10px', 
              margin: '10px', 
              minWidth: 'auto' 
            }}
          >
            Fresh Rau
          </Button>
          <div style={{ flexGrow: 1 }} /> {/* This ensures the rest of the content is aligned properly */}
          {user ? (
            <>
              <Typography variant="h6" style={{ marginRight: '10px' }}>
                Xin chào {user.lastname} {user.firstname}
              </Typography>
              <Button color="inherit" style={{ marginRight: '10px' }} onClick={handleLogoutClick}>Đăng xuất</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/register">Đăng ký</Button>
              <Button color="inherit" component={Link} to="/login">Đăng nhập</Button>
            </>
          )}
          <Button color="inherit" onClick={handleMenuClick}>Sản Phẩm</Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {categories.map((category) => (
              <MenuItem key={category._id} component={Link} to={`/shop/${category._id}`} onClick={handleMenuClose}>
                {category.name}
              </MenuItem>
            ))}
          </Menu>
          {user && (
            <>
              <Button color="inherit" component={Link} to="/add-product">Quản lý sản phẩm</Button>
              <Button color="inherit" component={Link} to="/add-category">Thêm danh mục</Button>
              <IconButton color="inherit" component={Link} to="/cart">
                <Badge badgeContent={cartItems.length} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container className="main-container">
        <Routes>
          <Route path="/shop/:categoryId?" element={<Shop user={user} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/add-product" element={<AddProduct user={user} />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/cart" element={<Cart user={user} />} />
        </Routes>
      </Container>
    </>
  );
};

export default App;
