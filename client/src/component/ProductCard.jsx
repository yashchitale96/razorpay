import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';
import PaymentButton from './PaymentButton';

export default function ProductCard({ product }) {
  if (!product) {
    return null;
  }

  return (
    <Card sx={{ width: 320, margin: 1 }}>
      <div>
        <Typography level="title-lg">{product.name}</Typography>
        <Typography level="body-sm" sx={{ color: 'text.secondary', mb: 1 }}>
          {product.category}
        </Typography>

        <IconButton
          aria-label={`bookmark ${product.name}`}
          variant="plain"
          color="neutral"
          size="sm"
          sx={{ position: 'absolute', top: '0.875rem', right: '0.5rem' }}
        >
          <BookmarkAdd />
        </IconButton>
      </div>
      
      <AspectRatio minHeight="120px" maxHeight="200px">
        <img
          src={product.image}
          srcSet={`${product.image} 2x`}
          loading="lazy"
          alt={product.name}
        />
      </AspectRatio>
      
      <Typography level="body-xs" sx={{ px: 2, pb: 1, color: 'text.secondary' }}>
        {product.description}
      </Typography>
      
      <CardContent orientation="horizontal">
        <div>
          <Typography level="body-xs">Total price:</Typography>
          <Typography sx={{ fontSize: 'lg', fontWeight: 'lg' }}>
            {product.price} {product.currency}
          </Typography>
        </div>
        <PaymentButton price={product.price} />
      </CardContent>
    </Card>
  );
}