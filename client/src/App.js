import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ChatOptionsPage from "./pages/ChatOptionsPage.jsx";
import MoodSelectionPage from "./pages/MoodSelectionPage.jsx";
import StrangerChat from "./pages/StrangerChat.jsx";
import FriendChat from "./pages/FriendChat.jsx";
import AIChat from "./pages/AIChat.jsx";
import { getMessages, sendMessage } from "./utilis/api.js";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [sender, setSender] = useState("");

  // Fetch messages on component mount
  useEffect(() => {
    async function fetchMessages() {
      const data = await getMessages();
      if (data) setMessages(data);
    }
    fetchMessages();
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/chat-options" element={<ChatOptionsPage />} />
        <Route path="/mood-selection" element={<MoodSelectionPage />} />
        <Route path="/chat-stranger" element={<StrangerChat />} />
        <Route path="/chat-friend" element={<FriendChat />} />
        <Route path="/chat-ai" element={<AIChat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;





