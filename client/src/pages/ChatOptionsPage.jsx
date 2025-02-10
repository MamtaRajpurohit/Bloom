import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ChatOptionsPage = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh">
      <Paper elevation={3} style={{ padding: "40px", width: "400px", textAlign: "center" }}>
        <Typography variant="h4" color="#6c63ff" gutterBottom>
          🌸 Bloom Chat Options
        </Typography>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "20px", backgroundColor: "#6c63ff" }}
          fullWidth
          onClick={() => navigate("/mood-selection?type=stranger")}
        >
          Chat with a Stranger Online
        </Button>
        <Button
          variant="contained"
          style={{ marginTop: "20px", backgroundColor: "#ff6f61", color: "white" }}
          fullWidth
          onClick={() => navigate("/mood-selection?type=friend")}
        >
          Chat with a Friend
        </Button>
        <Button
          variant="contained"
          style={{ marginTop: "20px", backgroundColor: "#4caf50", color: "white" }}
          fullWidth
          onClick={() => navigate("/mood-selection?type=ai")}
        >
          Chat with AI
        </Button>
      </Paper>
    </Box>
  );
};

export default ChatOptionsPage;
