import React, { useState } from "react";
import { auth, provider } from "./firebase";
import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { Box, TextField, Button, Typography, Divider, Paper } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      alert("Logged in with Google!");
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="90vh"
    >
      <Paper elevation={3} style={{ padding: "40px", width: "400px" }}>
        <Typography variant="h4" color="#6c63ff" align="center" gutterBottom>
          🌸 Bloom - Login
        </Typography>

        <form onSubmit={handleLogin} style={{ marginTop: "20px" }}>
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
          <Button
            type="submit"
            variant="contained"
            fullWidth
            style={{ backgroundColor: "#6c63ff", color: "white" }}
          >
            Login
          </Button>
        </form>

        <Divider style={{ margin: "20px 0" }}>or</Divider>

        <Button
          variant="outlined"
          fullWidth
          onClick={handleGoogleSignIn}
          style={{ marginBottom: "10px" }}
        >
          Sign in with Google
        </Button>

        <Button
          variant="text"
          fullWidth
          color="error"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
