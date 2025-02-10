import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ChatOptionsPage from "./pages/ChatOptionsPage";
import MoodSelectionPage from "./pages/MoodSelectionPage";
import StrangerChat from "./pages/StrangerChat";
import FriendChat from "./pages/FriendChat";
import AIChat from "./pages/AIChat";


const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ChatOptionsPage />} />
        <Route path="/mood-selection" element={<MoodSelectionPage />} />
        <Route path="/chat-stranger" element={<StrangerChat />} />
        <Route path="/chat-friend" element={<FriendChat />} />
        <Route path="/chat-ai" element={<AIChat />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;



