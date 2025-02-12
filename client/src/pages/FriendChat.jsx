import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, List, ListItem } from "@mui/material";
import { socket } from "../utilis/api"; 
import FriendList from "../components/FriendList";


const FriendChat = () => {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedFriend) {
      // Start a private chat with the selected friend
      socket.emit("start_private_chat", selectedFriend);
      console.log("Starting chat with", selectedFriend);

      socket.on("private_message", (msg) => {
        setMessages((prev) => [...prev, { sender: selectedFriend, text: msg }]);
      });
    }

    // Cleanup listener
    return () => {
      socket.off("private_message");
    };
  }, [selectedFriend]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    socket.emit("private_message", { to: selectedFriend, text: message });
    setMessages((prev) => [...prev, { sender: "You", text: message }]);
    setMessage("");
  };

  return (
    <Box sx={{ p: 3 }}>
      {!selectedFriend ? (
        // Display friend list when no friend is selected
        <FriendList onSelectFriend={(friend) => setSelectedFriend(friend)} />
      ) : (
        <>
          <Typography variant="h5">Chatting with {selectedFriend}</Typography>
          <Box sx={{ border: "1px solid gray", p: 2, mt: 3, minHeight: "300px" }}>
            {messages.map((msg, index) => (
              <List key={index}>
                <ListItem>
                  {msg.sender}: {msg.text}
                </ListItem>
              </List>
            ))}
          </Box>
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button variant="contained" onClick={handleSendMessage} sx={{ mt: 1 }}>
            Send Message
          </Button>
          <Button
            variant="outlined"
            onClick={() => setSelectedFriend(null)}
            sx={{ mt: 2 }}
          >
            Back to Friend List
          </Button>
        </>
      )}
    </Box>
  );
};

export default FriendChat;


