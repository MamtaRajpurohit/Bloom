import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom'; // Use Link for routing instead of href

const Header = () => {
  return (
    <AppBar position="static" style={{ backgroundColor: '#6c63ff' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          🌸 Bloom - Empathy Chat Network
        </Typography>
        <Box>
          {/* Navigation Links */}
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/about">About</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/signup">Signup</Button>
          <Button color="inherit" href="/profile">Profile</Button>

        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

