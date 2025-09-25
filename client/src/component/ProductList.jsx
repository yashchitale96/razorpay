import React from 'react';
import { Box, Container, Typography } from '@mui/joy';
import ProductCard from './ProductCard';
import { products } from './products';

export default function ProductList() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        level="h2" 
        sx={{ 
          textAlign: 'center', 
          mb: 4,
          background: 'linear-gradient(45deg, #3399cc, #667eea)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}
      >
        Our Premium Collection
      </Typography>
      
      <Box 
        sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, 
          justifyContent: 'center',
          alignItems: 'stretch' 
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Box>
    </Container>
  );
}