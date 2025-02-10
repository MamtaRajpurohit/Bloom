import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { Box, Typography, Avatar, Button, Paper } from "@mui/material";

const ProfilePage = () => {
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    // Fetch username and avatar from localStorage
    const savedUsername = localStorage.getItem("username");
    const savedAvatar = localStorage.getItem("avatar");

    if (savedUsername) {
      setUsername(savedUsername);
    }

    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      localStorage.clear(); // Clear user data on logout
      window.location.href = "/login"; // Redirect to login
    } catch (error) {
      alert("Error logging out: " + error.message);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="90vh"
    >
      <Paper elevation={3} sx={{ padding: "40px", textAlign: "center", width: "400px" }}>
        <Typography variant="h4" color="#6c63ff" gutterBottom>
          🌸 Profile Page
        </Typography>

        {avatarUrl ? (
          <Avatar
            alt={username}
            src={avatarUrl}
            sx={{
              width: 150,
              height: 150,
              margin: "20px auto",
              border: "3px solid #6c63ff",
            }}
          />
        ) : (
          <Typography color="textSecondary">No Avatar Selected</Typography>
        )}

        <Typography variant="h5" gutterBottom>
          Username: {username || "Anonymous User"}
        </Typography>

        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{ mt: 3 }}
        >
          Logout
        </Button>
      </Paper>
    </Box>
  );
};

export default ProfilePage;

