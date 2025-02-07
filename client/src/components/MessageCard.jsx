import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const MessageCard = ({ message }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography>{message}</Typography>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
