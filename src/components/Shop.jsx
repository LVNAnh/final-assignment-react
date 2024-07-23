import React, { useEffect, useState } from 'react';
import { Grid, Container, Typography, Card, CardContent, CardMedia, CardActions, Button } from '@mui/material';
import axios from 'axios';

const Shop = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Shop</Typography>
      <Grid container spacing={4}>
        {products.map((product) => (
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
                  ${product.price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">View</Button>
                <Button size="small">Add to Cart</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Shop;
