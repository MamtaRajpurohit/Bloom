import React from 'react';
import { Typography } from '@mui/material';

const AboutPage = () => {
  return (
    <div style={{ padding: '2em' }}>
      <Typography variant="h4" gutterBottom>About Bloom</Typography>
      <Typography variant="body1">
        Bloom is an Empathy Chat Network designed to foster meaningful connections by offering a safe space to share thoughts and feelings.
      </Typography>
    </div>
  );
};

export default AboutPage;
