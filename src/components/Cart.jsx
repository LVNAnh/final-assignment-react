import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Checkbox, Box, IconButton } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import axios from 'axios';

const Cart = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [total, setTotal] = useState(0);

  const fetchCartItems = useCallback(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/users/${user._id}/cart`)
        .then(response => {
          setCartItems(response.data.cart);
        })
        .catch(error => {
          console.error('There was an error fetching the cart items!', error);
        });
    }
  }, [user]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const calculateTotal = useCallback((items) => {
    const totalAmount = items.reduce((acc, item) => {
      if (selectedItems[item.product._id]) {
        return acc + item.price * item.quantity;
      }
      return acc;
    }, 0);
    setTotal(totalAmount);
  }, [selectedItems]);

  useEffect(() => {
    calculateTotal(cartItems);
  }, [selectedItems, cartItems, calculateTotal]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Đảm bảo số lượng không nhỏ hơn 1
    axios.put(`http://localhost:5000/api/users/${user._id}/cart`, { productId, quantity: newQuantity })
      .then(response => {
        fetchCartItems();
      })
      .catch(error => {
        console.error('There was an error updating the quantity!', error);
      });
  };

  const handleRemoveItem = (productId) => {
    axios.delete(`http://localhost:5000/api/users/${user._id}/cart`, { data: { productId } })
      .then(response => {
        fetchCartItems();
      })
      .catch(error => {
        console.error('There was an error removing the item from the cart!', error);
      });
  };

  const handleSelectItem = (productId) => {
    setSelectedItems(prevSelectedItems => ({
      ...prevSelectedItems,
      [productId]: !prevSelectedItems[productId],
    }));
  };

  const handleCreateOrder = () => {
    const selectedProducts = cartItems.filter(item => selectedItems[item.product._id]);
    if (selectedProducts.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để tạo đơn hàng.');
      return;
    }
    // Xử lý logic tạo order từ các sản phẩm đã chọn
    console.log('Creating order with items:', selectedProducts);
  };

  if (!user) {
    return (
      <Container>
        <Typography variant="h4">Giỏ hàng</Typography>
        <Typography variant="body1">Vui lòng đăng nhập để xem giỏ hàng</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4">Giỏ hàng</Typography>
      {cartItems.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Chọn</TableCell>
                  <TableCell>Hình ảnh</TableCell>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Thành tiền</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.product._id}>
                    <TableCell>
                      <Checkbox
                        checked={!!selectedItems[item.product._id]}
                        onChange={() => handleSelectItem(item.product._id)}
                      />
                    </TableCell>
                    <TableCell>
                      <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.title} width="100" />
                    </TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.price} VND</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <IconButton onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}>
                          <Remove />
                        </IconButton>
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product._id, parseInt(e.target.value, 10))}
                          inputProps={{ min: 1 }}
                          sx={{ width: 60, textAlign: 'center' }}
                        />
                        <IconButton onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}>
                          <Add />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>{item.price * item.quantity} VND</TableCell>
                    <TableCell>
                      <Button color="error" onClick={() => handleRemoveItem(item.product._id)}>Xóa</Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={5} align="right">Tổng thành tiền:</TableCell>
                  <TableCell>{total} VND</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="flex-end" mb={2} mt={2}>
            <Button variant="contained" color="primary" onClick={handleCreateOrder}>
              Tiến hành thanh toán
            </Button>
          </Box>
        </>
      ) : (
        <Typography variant="body1">Giỏ hàng của bạn đang trống</Typography>
      )}
    </Container>
  );
};

// Define PropTypes
Cart.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default Cart;
