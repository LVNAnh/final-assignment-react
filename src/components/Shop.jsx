import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Grid, Container, Typography, Card, CardContent, CardMedia, CardActions, Button, TextField, Pagination } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Shop = ({ user, setUser }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { categoryId } = useParams();
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(categoryId 
          ? `http://localhost:5000/api/products?category=${categoryId}`
          : 'http://localhost:5000/api/products');
        setProducts(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      } catch (error) {
        console.error('There was an error fetching the products!', error);
      }
    };

    fetchProducts();
  }, [categoryId]);

  useEffect(() => {
    if (categoryId) {
      const fetchCategoryName = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/categories/${categoryId}`);
          setCategoryName(response.data.name);
        } catch (error) {
          console.error('There was an error fetching the category name!', error);
        }
      };

      fetchCategoryName();
    } else {
      setCategoryName('');
    }
  }, [categoryId]);

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      return;
    }
  

      const response = await axios.post(
        'http://localhost:5000/api/users/updateCart',
        { productId, quantity: 1, userId: user._id }
      );
  
      // Kiểm tra phản hồi để xác định xem có thành công hay không
      if (response.product) {
        console.log('Response from add to cart:', response.product);
        setUser(response.product);
        toast('Sản phẩm đã được thêm vào giỏ hàng');
      } else {
        // Xử lý lỗi nếu có
        toast.success('Sản phẩm đã được thêm vào giỏ hàng');
      }
   
  };

  // Lọc sản phẩm dựa trên từ khóa tìm kiếm
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính toán các sản phẩm cần hiển thị trên trang hiện tại
  const displayedProducts = filteredProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {categoryName ? `Sản phẩm thuộc danh mục: ${categoryName}` : 'Sản phẩm'}
      </Typography>
      <TextField
        label="Tìm kiếm sản phẩm"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Grid container spacing={4}>
        {displayedProducts.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={3}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={`http://localhost:5000/uploads/${product.image}`}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.price} VND
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.category?.name}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">View</Button>
                <Button size="small" onClick={() => handleAddToCart(product._id)}>Add to Cart</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Pagination
        count={totalPages}
        page={page}
        onChange={handleChangePage}
        color="primary"
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      />
      <ToastContainer />
    </Container>
  );
};

Shop.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func.isRequired,
};

export default Shop;
