import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Container, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Select, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '@mui/material/Pagination';

const AddProduct = ({ user }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('There was an error fetching the categories!', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('There was an error fetching the products!', error);
    }
  };

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
      await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      toast.success('Sản phẩm đã được thêm');
      setName('');
      setPrice('');
      setDescription('');
      setCategory('');
      setStock('');
      setImage(null);
      fetchProducts();
    } catch (error) {
      console.error('There was an error adding the product!', error);
      toast.error('Có lỗi xảy ra khi thêm sản phẩm');
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
    setOpenEditDialog(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      toast.success('Sản phẩm đã được xóa');
      fetchProducts();
    } catch (error) {
      console.error('There was an error deleting the product!', error);
      toast.error('Có lỗi xảy ra khi xóa sản phẩm');
    }
  };

  const handleSaveEditProduct = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editProduct.name);
      formData.append('price', editProduct.price);
      formData.append('description', editProduct.description);
      formData.append('category', editProduct.category._id);
      formData.append('stock', editProduct.stock);
      if (editProduct.image) {
        formData.append('image', editProduct.image);
      }

      await axios.put(`http://localhost:5000/api/products/${editProduct._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      toast.success('Sản phẩm đã được cập nhật');
      fetchProducts();
      setOpenEditDialog(false);
      setEditProduct(null);
    } catch (error) {
      console.error('There was an error updating the product!', error);
      toast.error('Có lỗi xảy ra khi cập nhật sản phẩm');
    }
  };

  const handleFilterAndSort = useCallback(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category._id === selectedCategory);
    }

    if (sortOption === 'priceAsc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'priceDesc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage));
  }, [products, selectedCategory, sortOption, page, itemsPerPage]);

  useEffect(() => {
    handleFilterAndSort();
  }, [products, sortOption, selectedCategory, page, itemsPerPage, handleFilterAndSort]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  return (
    <Container>
      <h2>Thêm sản phẩm</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Giá"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Mô tả"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          select
          label="Danh mục"
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
          label="Kho hàng"
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
        <Button variant="contained" color="primary" type="submit" style={{ marginTop: '5px' }}>
          Thêm
        </Button>
      </form>

      <h2>Quản lý sản phẩm</h2>
      <FormControl fullWidth margin="normal">
        <InputLabel id="category-filter-label">Danh mục</InputLabel>
        <Select
          labelId="category-filter-label"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="sort-label">Sắp xếp theo</InputLabel>
        <Select
          labelId="sort-label"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <MenuItem value="">Không</MenuItem>
          <MenuItem value="priceAsc">Giá: Thấp đến Cao</MenuItem>
          <MenuItem value="priceDesc">Giá: Cao đến Thấp</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel id="items-per-page-label">Số sản phẩm mỗi trang</InputLabel>
        <Select
          labelId="items-per-page-label"
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(e.target.value)}
        >
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Kho hàng</TableCell>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.category.name}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  {product.image && (
                    <img src={`http://localhost:5000/uploads/${product.image}`} alt={product.name} style={{ width: '50px', height: '50px' }} />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditProduct(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteProduct(product._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(filteredProducts.length / itemsPerPage)}
        page={page}
        onChange={handleChangePage}
        variant="outlined"
        color="primary"
        style={{ marginTop: '20px' }}
      />

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên"
            value={editProduct ? editProduct.name : ''}
            onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Giá"
            value={editProduct ? editProduct.price : ''}
            onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
            type="number"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Mô tả"
            value={editProduct ? editProduct.description : ''}
            onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            select
            label="Danh mục"
            value={editProduct ? editProduct.category._id : ''}
            onChange={(e) => setEditProduct({ ...editProduct, category: { ...editProduct.category, _id: e.target.value } })}
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
            label="Kho hàng"
            value={editProduct ? editProduct.stock : ''}
            onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
            type="number"
            fullWidth
            margin="normal"
            required
          />
          <input
            accept="image/*"
            type="file"
            onChange={(e) => setEditProduct({ ...editProduct, image: e.target.files[0] })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Hủy
          </Button>
          <Button onClick={handleSaveEditProduct} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer />
    </Container>
  );
};

AddProduct.propTypes = {
  user: PropTypes.object.isRequired,
};

export default AddProduct;
