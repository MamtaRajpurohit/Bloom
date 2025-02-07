import React from 'react';
import { Typography, Box } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#6c63ff', color: 'white', textAlign: 'center', p: 2, mt: 4 }}>
      <Typography variant="body2">
        © 2025 Bloom - Empathy Chat Network. Crafted with 💖 to make the world a kinder place.
      </Typography>
    </Box>
  );
};

export default Footer;
