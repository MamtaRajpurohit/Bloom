const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cors()); // Allow cross-origin requests

const io = new Server(server, {
  cors: {
    origin: '*', // Replace with your frontend URL for security
    methods: ['GET', 'POST'],
  },
});

let messages = []; // Temporary storage for messages

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send existing messages to the new user
  socket.emit('chat_history', messages);

  // Handle message from a client
  socket.on('send_message', (data) => {
    messages.push(data); // Save the message
    io.emit('receive_message', data); // Broadcast to all users
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const mongoose = require('mongoose');

// Define Message Schema
const MessageSchema = new mongoose.Schema({
  text: String,
  time: String,
});

const MessageModel = mongoose.model('Message', MessageSchema);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Fetch messages from MongoDB and send to the user
  MessageModel.find().then((msgs) => socket.emit('chat_history', msgs));

  // Save new message to DB and broadcast it
  socket.on('send_message', (data) => {
    const message = new MessageModel(data);
    message.save(); // Save to DB
    io.emit('receive_message', data); // Broadcast
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
