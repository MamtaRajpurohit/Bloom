const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken"); // For generating tokens
const admin = require("firebase-admin");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const Together = require("together-ai");
const dotenv = require("dotenv");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.TOGETHER_API_KEY;
if (!API_KEY) {
  console.error("❌ ERROR: TOGETHER_API_KEY is missing in .env file");
  process.exit(1);
}

const together = new Together({ apiKey: API_KEY });

app.use(cors({
  origin: "http:// 192.168.29.112:5000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
})); // Enable CORS for frontend communication
app.use(bodyParser.json()); // Parse JSON request body

// Chat API route
app.post("/chat", async (req, res) => {
  try {
      const { message } = req.body;
      if (!message) {
          return res.status(400).json({ error: "Message is required" });
      }

      console.log(`📩 User message: ${message}`);

      const response = await together.chat.completions.create({
          messages: [{ role: "user", content: message }],
          model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
      });

      const reply = response.choices[0]?.message?.content || "⚠️ AI response unavailable";
      console.log(`🤖 AI reply: ${reply}`);

      res.json({ reply });
  } catch (error) {
      console.error("❌ Error fetching AI response:", error);
      res.status(500).json({ error: "Failed to fetch AI response" });
  }
});


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
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
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

let waitingQueue = [];
let pairings = {}; // Queue to maintain waiting users

// Friend requests and lists
let friendRequests = {}; // To store pending friend requests
let friendsList = {}; // To maintain established friendships

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("find_stranger", () => {
    console.log(`User ${socket.id} requested a stranger`);

    // Check if there's someone in the queue to match with
    while (waitingQueue.length > 0) {
      const partnerSocketId = waitingQueue.shift(); // Get the first user from the queue

      // Ensure the partner socket is valid and connected
      if (io.sockets.sockets.get(partnerSocketId)) {
        // Notify both users of the match
        pairings[socket.id] = partnerSocketId;
        pairings[partnerSocketId] = socket.id;
        socket.emit("matched", { id: partnerSocketId });
        io.to(partnerSocketId).emit("matched", { id: socket.id });
        console.log(`Matched ${socket.id} with ${partnerSocketId}`);
        return;
      }
      console.log(`User ${partnerSocketId} disconnected before matching`);
    }

    // No match found; add the user to the queue
    waitingQueue.push(socket.id);
    console.log(`User ${socket.id} is waiting for a match`);

    setTimeout(() => {
      if (waitingQueue.includes(socket.id)) {
        waitingQueue = waitingQueue.filter((id) => id !== socket.id);
        console.log(`Timeout reached. No match found for ${socket.id}`);
        socket.emit("no_stranger_found");
      }
    }, 10000); // 10-second timeout
  });

  socket.on("message", (data) => {
    console.log(`Message from ${socket.id}: ${data}`);
    const partnerSocketId = pairings[socket.id];
    if (partnerSocketId && io.sockets.sockets.get(partnerSocketId)) {
      io.to(partnerSocketId).emit("message", data);
      console.log(`Forwarded message from ${socket.id} to ${partnerSocketId}`);
    }
  });

  // Handle friend request
  socket.on("send_friend_request", (strangerSocketId) => {
    if (!friendRequests[strangerSocketId]) {
      friendRequests[strangerSocketId] = [];
    }
    friendRequests[strangerSocketId].push(socket.id);
    io.to(strangerSocketId).emit("friend_request_received", socket.id);
    console.log(`Friend request sent from ${socket.id} to ${strangerSocketId}`);
  });

  // Handle friend request acceptance
  socket.on("accept_friend_request", (strangerSocketId) => {
    if (!friendsList[socket.id]) {
      friendsList[socket.id] = [];
    }
    if (!friendsList[strangerSocketId]) {
      friendsList[strangerSocketId] = [];
    }

    // Establish mutual friendship
    friendsList[socket.id].push(strangerSocketId);
    friendsList[strangerSocketId].push(socket.id);

    io.to(strangerSocketId).emit("friend_request_accepted", socket.id);
    console.log(`Friend request accepted between ${socket.id} and ${strangerSocketId}`);
  });

  // Return the friend list for a socket
  socket.on("get_friend_list", () => {
    const friends = friendsList[socket.id] || [];
    socket.emit("friend_list", friends);
    console.log("Friends list on server:", friendsList);
  });

  socket.on("disconnect", (reason) => {
    console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
    waitingQueue = waitingQueue.filter((id) => id !== socket.id);

    // Remove pairing if exists
    if (pairings[socket.id]) {
      const partnerSocketId = pairings[socket.id];
      delete pairings[partnerSocketId];
      delete pairings[socket.id];
    }

    // Cleanup friend requests and friend lists
    delete friendRequests[socket.id];
    delete friendsList[socket.id];
    console.log(`Removed ${socket.id} from waiting queue and pairings.`);
  });
});

// Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;





