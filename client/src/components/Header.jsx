import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static" style={{ backgroundColor: '#6c63ff' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          🌸 Bloom - Empathy Chat Network
        </Typography>
        <Box>
          <Button color="inherit" href="/">Home</Button>
          <Button color="inherit" href="/about">About</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
