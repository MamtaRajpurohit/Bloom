import React, { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  Grid,
} from "@mui/material";

const avatarOptions = [
  "https://api.dicebear.com/6.x/identicon/svg?seed=Option1",
  "https://api.dicebear.com/6.x/identicon/svg?seed=Option2",
  "https://api.dicebear.com/6.x/identicon/svg?seed=Option3",
  "https://api.dicebear.com/6.x/identicon/svg?seed=Option4",
];

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username) {
      alert("Please enter a username");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      // Store username and avatar locally
      localStorage.setItem("username", username);
      localStorage.setItem("avatar", selectedAvatar);

      alert("User created successfully!");
      window.location.href = "/profile"; // Redirect to Profile Page
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh">
      <Paper elevation={3} style={{ padding: "40px", width: "400px" }}>
        <Typography variant="h4" color="#6c63ff" align="center" gutterBottom>
          🌸 Bloom - Sign Up
        </Typography>

        <form onSubmit={handleSignup} style={{ marginTop: "20px" }}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: "20px" }}
          />

          <Typography variant="h6" color="#6c63ff" gutterBottom>
            Choose an Avatar:
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {avatarOptions.map((avatar) => (
              <Grid item key={avatar}>
                <Avatar
                  src={avatar}
                  sx={{
                    width: 60,
                    height: 60,
                    border: selectedAvatar === avatar ? "3px solid #6c63ff" : "",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedAvatar(avatar)}
                />
              </Grid>
            ))}
          </Grid>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            style={{ backgroundColor: "#6c63ff", color: "white", marginTop: "20px" }}
          >
            Sign Up
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Signup;

