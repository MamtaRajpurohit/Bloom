import React, { useState, useEffect, useRef } from "react";
import { Box, Button, Typography, Chip, CircularProgress, TextField } from "@mui/material";
import { onMatchFound, findStranger, sendMessageSocket, listenForMessages, sendFriendRequest } from "../utilis/api";

const StrangerChat = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [chatStarted, setChatStarted] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noStrangerFound, setNoStrangerFound] = useState(false);
  const [currentStrangerId, setCurrentStrangerId] = useState(null); // Store the current stranger's ID
  const moods = ["Happy", "Sad", "Angry", "Excited", "Neutral"];

  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    // Handle match event
    onMatchFound((data) => {
      clearTimeout(searchTimeoutRef.current);
      if (data) {
        setCurrentStrangerId(data.id); // Store the stranger ID
        setChatStarted(true);
        setLoading(false);
        setNoStrangerFound(false);
        console.log("Matched with stranger:", data);
      } else {
        setLoading(false);
        setNoStrangerFound(true);
      }
    });

    listenForMessages((incomingMessage) => {
      console.log("Incoming message:", incomingMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Stranger", text: incomingMessage },
      ]);
    });

    return () => clearTimeout(searchTimeoutRef.current);
  }, []);

  const handleMoodSelectionAndConnect = () => {
    setLoading(true);
    setNoStrangerFound(false);
    console.log("Connecting with mood:", selectedMood || "No mood selected");
    findStranger();
    searchTimeoutRef.current = setTimeout(() => {
      setLoading(false);
      setNoStrangerFound(true);
      console.log("Timeout reached, no match found.");
    }, 10000);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageSocket(message);
    setMessages((prevMessages) => [...prevMessages, { sender: "You", text: message }]);
    setMessage("");
  };

  return (
    <Box sx={{ p: 3 }}>
      {!chatStarted ? (
        <>
          <Typography variant="h5" gutterBottom>
            Select Your Mood (Optional)
          </Typography>
          <Box sx={{ my: 2 }}>
            {moods.map((mood) => (
              <Chip
                key={mood}
                label={mood}
                color={selectedMood === mood ? "primary" : "default"}
                onClick={() => setSelectedMood(mood)}
                sx={{ margin: "5px" }}
              />
            ))}
          </Box>
          <Button variant="contained" onClick={handleMoodSelectionAndConnect} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Find Stranger"}
          </Button>
          {noStrangerFound && (
            <Typography sx={{ mt: 2, color: "red" }}>
              No matching strangers found. Please try again later.
            </Typography>
          )}
        </>
      ) : (
        <>
          <Typography variant="h5">Chatting Now</Typography>
          <Box sx={{ border: "1px solid gray", p: 2, mt: 3, minHeight: "300px" }}>
            {messages.map((msg, index) => (
              <Typography key={index}>
                {msg.sender}: {msg.text}
              </Typography>
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
            variant="contained"
            color="primary"
            onClick={() => sendFriendRequest(currentStrangerId)}
            sx={{ mt: 2 }}
          >
            Send Friend Request
          </Button>
        </>
      )}
    </Box>
  );
};

export default StrangerChat;













