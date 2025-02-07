import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import MessageCard from './MessageCard';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      setMessages([...messages, currentMessage]);
      setCurrentMessage('');
    }
  };

  return (
    <Box sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Empathy Chat 💕</Typography>
      {messages.map((msg, index) => (
        <MessageCard key={index} message={msg} />
      ))}
      <TextField
        fullWidth
        variant="outlined"
        label="Type your message..."
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" onClick={handleSendMessage} sx={{ mt: 2, backgroundColor: '#6c63ff' }}>
        Send
      </Button>
    </Box>
  );
};

export default ChatBox;

