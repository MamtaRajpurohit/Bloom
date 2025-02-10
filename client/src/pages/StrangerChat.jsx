import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Chip, CircularProgress, TextField } from "@mui/material";
import {
  setUserStatus,
  findStrangerWithMood,
  createChatSession,
  saveChatMessage,
  startAnonymousSession,
  listenForAuthChanges,
} from "../utilis/firebaseUtils";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";

const StrangerChat = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [chatSessionId, setChatSessionId] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noStrangerFound, setNoStrangerFound] = useState(false);
  const moods = ["Happy", "Sad", "Angry", "Excited", "Neutral"];

  useEffect(() => {
    const initializeSession = async () => {
      try {
        await startAnonymousSession();
        listenForAuthChanges((user) => {
          if (user) {
            setUserId(user.uid);
          }
        });
      } catch (error) {
        console.error("Error starting session:", error);
      }
    };

    initializeSession();
  }, []);

  useEffect(() => {
    if (chatSessionId) {
      const chatRef = doc(db, "chats", chatSessionId);
      const unsubscribe = onSnapshot(chatRef, (snapshot) => {
        if (snapshot.exists()) {
          setMessages(snapshot.data().messages || []);
        }
      });
      return () => unsubscribe();
    }
  }, [chatSessionId]);

  const handleMoodSelectionAndConnect = async () => {
    setLoading(true);
    setNoStrangerFound(false);

    try {
      if (!auth.currentUser) {
        await startAnonymousSession();
      }

      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) {
        alert("Failed to establish session. Please try again.");
        return;
      }

      await setUserStatus(currentUserId, selectedMood);

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("No users found within timeout")), 10000)
      );

      const strangerUser = await Promise.race([
        findStrangerWithMood(currentUserId, selectedMood),
        timeoutPromise,
      ]);

      if (strangerUser) {
        const chatId = await createChatSession(currentUserId, strangerUser.userId);
        setChatSessionId(chatId);
      } else {
        setNoStrangerFound(true);
      }
    } catch (error) {
      if (error.message === "No users found within timeout") {
        setNoStrangerFound(true);
      } else {
        console.error("Error establishing session:", error);
        alert("Failed to start chat. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await saveChatMessage(chatSessionId, userId, message);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Could not send message. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {!chatSessionId ? (
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
                {msg.senderId === userId ? "You" : "Stranger"}: {msg.message}
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
        </>
      )}
    </Box>
  );
};

export default StrangerChat;






