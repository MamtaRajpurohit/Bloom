import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfilePage from "./pages/ProfilePage";
import ChatOptionsPage from "./pages/ChatOptionsPage";
import MoodSelectionPage from "./pages/MoodSelectionPage";
import StrangerChat from "./pages/StrangerChat";
import FriendChat from "./pages/FriendChat";
import AIChat from "./pages/AIChat";
import { getMessages, sendMessage } from "./utilis/api";

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





