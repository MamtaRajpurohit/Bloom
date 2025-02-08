import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import MessageCard from './MessageCard';
import { getMessages, sendMessage } from '../utilis/api';

const ChatBox = () => {
  const [messages, setMessages] = useState([]); // Default empty array to avoid undefined issues
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await getMessages();
        setMessages(fetchedMessages || []); // Fallback to an empty array if undefined
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (currentMessage.trim()) {
      try {
        const newMessage = { sender: 'Divya', message: currentMessage };
        await sendMessage(newMessage);
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setCurrentMessage('');
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <Box sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Empathy Chat 💕</Typography>

      {messages && messages.length > 0 ? (
        messages.map((msg, index) => (
          <MessageCard key={index} message={`${msg.sender}: ${msg.message}`} />
        ))
      ) : (
        <Typography>No messages yet. Start the conversation!</Typography>
      )}

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

