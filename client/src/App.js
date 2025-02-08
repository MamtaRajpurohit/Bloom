import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ChatBox from './components/ChatBox';
import Login from './pages/Login';  // Import Login page
import Signup from './pages/Signup'; // Import Signup page

import { getMessages, sendMessage } from './utilis/api';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sender, setSender] = useState('');

  // Fetch messages on component mount
  useEffect(() => {
    async function fetchMessages() {
      const data = await getMessages();
      if (data) setMessages(data);
    }
    fetchMessages();
  }, []);

  // Handle form submission to post a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!sender || !newMessage) {
      alert('Both fields are required!');
      return;
    }
    const response = await sendMessage(sender, newMessage);
    if (response) {
      setMessages((prevMessages) => [...prevMessages, response]);
      setNewMessage('');
      setSender('');
    }
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/chat"
          element={
            <ChatBox
              messages={messages}
              sender={sender}
              setSender={setSender}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
            />
          }
        />
        <Route path="/login" element={<Login />} />   {/* Add login route */}
        <Route path="/signup" element={<Signup />} /> {/* Add signup route */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;





