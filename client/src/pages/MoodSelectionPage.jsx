import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Typography, Paper, Chip } from "@mui/material";

const MoodSelectionPage = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const chatType = new URLSearchParams(location.search).get("type");

  const moods = ["Happy", "Sad", "Angry", "Excited", "Neutral"];

  const handleProceed = () => {
    switch (chatType) {
      case "stranger":
        navigate(`/chat-stranger?mood=${selectedMood}`);
        break;
      case "friend":
        navigate(`/chat-friend?mood=${selectedMood}`);
        break;
      case "ai":
        navigate(`/chat-ai?mood=${selectedMood}`);
        break;
      default:
        break;
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh">
      <Paper elevation={3} style={{ padding: "40px", width: "400px", textAlign: "center" }}>
        <Typography variant="h5" color="#6c63ff" gutterBottom>
          Select Your Mood (Optional)
        </Typography>
        <Box style={{ margin: "20px 0" }}>
          {moods.map((mood) => (
            <Chip
              key={mood}
              label={mood}
              color={selectedMood === mood ? "primary" : "default"}
              onClick={() => setSelectedMood(mood)}
              style={{ margin: "5px" }}
            />
          ))}
        </Box>
        <Button
          variant="contained"
          style={{ backgroundColor: "#6c63ff", color: "white" }}
          onClick={handleProceed}
          fullWidth
        >
          Proceed
        </Button>
      </Paper>
    </Box>
  );
};

export default MoodSelectionPage;
