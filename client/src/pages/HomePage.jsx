import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

const HomePage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center' }}>
      <Typography variant="h3" sx={{ mb: 3 }}>
        Welcome to Bloom 🌸
      </Typography>
      <Typography variant="h5" sx={{ mb: 5 }}>
        Join hands to share empathy and make meaningful conversations.
      </Typography>
      <Button variant="contained" color="primary" href="/chat" sx={{ backgroundColor: '#6c63ff' }}>
        Start Chatting 💬
      </Button>
    </Container>
  );
};

export default HomePage;

