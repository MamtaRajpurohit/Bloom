const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For generating tokens
const admin = require("firebase-admin");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST"] })); // Enable CORS for cross-origin requests
app.use(express.json()); // Middleware to parse JSON

// Initialize Firebase Admin SDK
const serviceAccount = require("./firebase-config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const messagesCollection = db.collection("messages");
const usersCollection = db.collection("users");

// API route to fetch messages
app.get("/api/messages", async (req, res) => {
  try {
    const snapshot = await messagesCollection.get();
    const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// API route to post a message
app.post("/api/messages", async (req, res) => {
  try {
    const { sender, message } = req.body;
    if (!sender || !message) {
      return res.status(400).send("Invalid request body");
    }

    const newMessage = {
      sender,
      message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
    const docRef = await messagesCollection.add(newMessage);
    return res.status(201).json({ id: docRef.id, ...newMessage });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// API route to register a user
app.post("/api/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if user already exists
    const snapshot = await usersCollection.where("username", "==", username).get();
    if (!snapshot.empty) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { username, password: hashedPassword };
    await usersCollection.add(newUser);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API route to log in a user
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const snapshot = await usersCollection.where("username", "==", username).get();
    if (snapshot.empty) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: userDoc.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  pingTimeout: 10000, // Close connection if heartbeat times out
  pingInterval: 5000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let waitingQueue = []; // Queue to maintain waiting users

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("find_stranger", () => {
    console.log(`User ${socket.id} requested a stranger`);

    // Check if there's someone in the queue to match with
    if (waitingQueue.length > 0) {
      const partnerSocketId = waitingQueue.shift(); // Get the first user from the queue

      if (io.sockets.sockets.get(partnerSocketId)) {
        // Notify both users of the match
        socket.emit("matched", { id: partnerSocketId });
        io.to(partnerSocketId).emit("matched", { id: socket.id });
        console.log(`Matched ${socket.id} with ${partnerSocketId}`);
      } else {
        console.log(`User ${partnerSocketId} disconnected before matching`);
      }
    } else {
      // Add the user to the queue if no match is found
      waitingQueue.push(socket.id);
      console.log(`User ${socket.id} is waiting for a match`);

      // Timeout to handle unmatched users
      setTimeout(() => {
        if (waitingQueue.includes(socket.id)) {
          waitingQueue = waitingQueue.filter((id) => id !== socket.id);
          console.log(`Timeout reached. No match found for ${socket.id}`);
          socket.emit("no_stranger_found");
        }
      }, 1000000); // 10-second timeout
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
  
    // Handle if they were in the waiting queue
    if (waitingUser === socket) {
      waitingUser = null;
    }
  });
  
  

  socket.on("message", (data) => {
    console.log(`Message from ${socket.id}: ${data}`);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;




